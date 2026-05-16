import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  courseProgress,
  decorateCourse,
  decorateModule,
  latestAttemptForModule,
  latestAttemptForQuiz,
  normalizeArray,
} from "../lib/learningTransforms";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";

const LearningDataContext = createContext(null);

const emptyState = {
  courses: [],
  sources: [],
  modules: [],
  lessons: [],
  videos: [],
  quizzes: [],
  questions: [],
  attempts: [],
  progress: [],
  studyPlan: [],
  messages: [],
};

export function LearningDataProvider({ children }) {
  const { user, configMissing } = useAuth();
  const [state, setState] = useState(emptyState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!user || configMissing) {
      setState(emptyState);
      return;
    }

    setLoading(true);
    setError("");

    const queries = await Promise.all([
      supabase.from("courses").select("*").order("created_at", { ascending: false }),
      supabase.from("course_sources").select("*").order("created_at", { ascending: true }),
      supabase.from("modules").select("*").order("position", { ascending: true }),
      supabase.from("lessons").select("*"),
      supabase.from("videos").select("*").order("created_at", { ascending: true }),
      supabase.from("quizzes").select("*").order("created_at", { ascending: true }),
      supabase.from("quiz_questions").select("*").order("position", { ascending: true }),
      supabase.from("quiz_attempts").select("*").order("created_at", { ascending: false }),
      supabase.from("module_progress").select("*"),
      supabase.from("study_plan_items").select("*").order("due_date", { ascending: true }),
      supabase.from("ai_messages").select("*").order("created_at", { ascending: true }).limit(80),
    ]);

    const firstError = queries.find((query) => query.error)?.error;
    if (firstError) {
      setError(firstError.message);
      setLoading(false);
      return;
    }

    setState({
      courses: queries[0].data || [],
      sources: queries[1].data || [],
      modules: queries[2].data || [],
      lessons: queries[3].data || [],
      videos: queries[4].data || [],
      quizzes: queries[5].data || [],
      questions: queries[6].data || [],
      attempts: queries[7].data || [],
      progress: queries[8].data || [],
      studyPlan: queries[9].data || [],
      messages: queries[10].data || [],
    });
    setLoading(false);
  }, [configMissing, user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(() => {
    const decoratedCourses = state.courses.map((course) => decorateCourse(course, state));
    const decoratedModules = state.modules.map((module) => decorateModule(module, state));

    return {
      ...state,
      courses: decoratedCourses,
      modules: decoratedModules,
      raw: state,
      loading,
      error,
      refresh,
      getCourse: (courseId) => decoratedCourses.find((course) => course.id === courseId),
      getModules: (courseId) => decoratedModules.filter((module) => module.course_id === courseId),
      getModule: (moduleId) => decoratedModules.find((module) => module.id === moduleId),
      getLesson: (moduleId) => state.lessons.find((lesson) => lesson.module_id === moduleId),
      getVideos: (moduleId) => state.videos.filter((video) => video.module_id === moduleId),
      getQuizForModule: (moduleId) => state.quizzes.find((quiz) => quiz.module_id === moduleId),
      getQuestions: (quizId) => state.questions.filter((question) => question.quiz_id === quizId),
      getLatestAttemptForQuiz: (quizId) => latestAttemptForQuiz(quizId, state),
      getLatestAttemptForModule: (moduleId) => latestAttemptForModule(moduleId, state),
      getCourseProgress: (courseId) => courseProgress(courseId, state),
      getCourseWeakTopics: (courseId) => {
        const weakTopics = state.attempts
          .filter((attempt) => attempt.course_id === courseId)
          .flatMap((attempt) => normalizeArray(attempt.weak_topics));
        return [...new Set(weakTopics)].slice(0, 8);
      },
    };
  }, [error, loading, refresh, state]);

  return <LearningDataContext.Provider value={value}>{children}</LearningDataContext.Provider>;
}

export function useLearningData() {
  const context = useContext(LearningDataContext);
  if (!context) {
    throw new Error("useLearningData must be used inside LearningDataProvider");
  }

  return context;
}
