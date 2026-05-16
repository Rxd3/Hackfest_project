import { CheckCircle2, ListChecks } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QuizQuestionCard } from "../components/quiz/QuizQuestionCard";
import { PageHeader } from "../components/ui/PageHeader";
import { useAuth } from "../contexts/AuthContext";
import { useLearningData } from "../contexts/LearningDataContext";
import { supabase } from "../lib/supabaseClient";

export function QuizPage() {
  const navigate = useNavigate();
  const { courseId, moduleId } = useParams();
  const { user } = useAuth();
  const data = useLearningData();
  const resolved = useMemo(() => resolveQuiz(data, courseId, moduleId), [courseId, data, moduleId]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!resolved.quiz || !resolved.module || !resolved.course) {
    return <p className="soft-card p-6 text-sm font-bold text-muted">No quiz is available yet. Generate a course first.</p>;
  }

  const questions = data.getQuestions(resolved.quiz.id);
  const currentQuestion = questions[questionIndex];

  if (!questions.length) {
    return <p className="soft-card p-6 text-sm font-bold text-muted">This quiz has no questions yet.</p>;
  }

  async function handleSubmit() {
    if (Object.keys(answers).length < questions.length || submitting) {
      setError("Answer every question before submitting.");
      return;
    }

    setSubmitting(true);
    setError("");

    const incorrectTopics = [];
    let correctCount = 0;

    for (const question of questions) {
      const answer = answers[question.id];
      if (answer === question.correct_option_index) {
        correctCount += 1;
      } else if (question.topic) {
        incorrectTopics.push(question.topic);
      }
    }

    const score = Math.round((correctCount / questions.length) * 100);
    const weakTopics = [...new Set(incorrectTopics)];

    const { data: attempt, error: attemptError } = await supabase
      .from("quiz_attempts")
      .insert({
        user_id: user.id,
        course_id: resolved.course.id,
        module_id: resolved.module.id,
        quiz_id: resolved.quiz.id,
        answers,
        score,
        total_questions: questions.length,
        correct_count: correctCount,
        weak_topics: weakTopics,
      })
      .select()
      .single();

    if (attemptError) {
      setSubmitting(false);
      setError(attemptError.message);
      return;
    }

    await supabase.from("module_progress").upsert(
      {
        user_id: user.id,
        course_id: resolved.course.id,
        module_id: resolved.module.id,
        completed_sections: score >= 60 ? ["lesson", "practice", "quiz"] : ["lesson", "practice"],
        percent: score >= 60 ? 100 : Math.max(70, score),
        completed_at: score >= 60 ? new Date().toISOString() : null,
      },
      { onConflict: "user_id,module_id" },
    );

    await data.refresh();
    navigate(`/quiz-result/${attempt.id}`);
  }

  return (
    <div>
      <PageHeader title={`Quiz: ${resolved.module.title}`} subtitle={`${questions.length} Questions - Estimated time: 5 minutes`} />
      {error ? <p className="mb-5 rounded-[20px] bg-[#fff0ea] px-4 py-3 text-sm font-bold text-[#d44724]">{error}</p> : null}
      <QuizQuestionCard
        question={currentQuestion}
        questionIndex={questionIndex}
        total={questions.length}
        selectedOption={answers[currentQuestion.id]}
        onSelect={(optionIndex) => setAnswers((value) => ({ ...value, [currentQuestion.id]: optionIndex }))}
        onPrevious={() => setQuestionIndex((value) => Math.max(0, value - 1))}
        onNext={() => setQuestionIndex((value) => Math.min(questions.length - 1, value + 1))}
        onSubmit={handleSubmit}
        canSubmit={Object.keys(answers).length === questions.length && !submitting}
      />
    </div>
  );
}

export function QuizRightPanel() {
  const { courseId, moduleId } = useParams();
  const data = useLearningData();
  const resolved = resolveQuiz(data, courseId, moduleId);

  if (!resolved.quiz || !resolved.module) {
    return null;
  }

  const questions = data.getQuestions(resolved.quiz.id);
  const latestAttempt = data.getLatestAttemptForQuiz(resolved.quiz.id);

  return (
    <>
      <section className="soft-card p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lavender text-navy">
            <ListChecks size={18} />
          </span>
          <h2 className="text-lg font-extrabold text-ink">Quiz Progress</h2>
        </div>
        <p className="mt-5 text-4xl font-extrabold text-navy">{latestAttempt ? `${latestAttempt.score}%` : "New"}</p>
        <p className="mt-2 text-sm font-bold text-muted">{questions.length} questions</p>
      </section>
      <section className="soft-card p-5">
        <h2 className="text-lg font-extrabold text-ink">Topic Coverage</h2>
        <p className="mt-3 text-sm font-semibold text-muted">This quiz covers:</p>
        <div className="mt-4 space-y-3">
          {[...new Set(questions.map((question) => question.topic).filter(Boolean))].slice(0, 5).map((topic) => (
            <p key={topic} className="flex items-center gap-2 text-sm font-bold text-muted">
              <CheckCircle2 size={17} className="text-navy" />
              {topic}
            </p>
          ))}
        </div>
      </section>
    </>
  );
}

function resolveQuiz(data, courseId, moduleId) {
  const module = moduleId ? data.getModule(moduleId) : data.modules[0];
  const course = courseId ? data.getCourse(courseId) : data.getCourse(module?.course_id);
  const quiz = module ? data.getQuizForModule(module.id) : data.quizzes[0];

  return { course, module, quiz };
}
