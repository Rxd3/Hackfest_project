import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AskAIBox } from "../components/module/AskAIBox";
import { ExamplesCard } from "../components/module/ExamplesCard";
import { ExplanationCard } from "../components/module/ExplanationCard";
import { KeyConceptsCard } from "../components/module/KeyConceptsCard";
import { PracticeTaskCard } from "../components/module/PracticeTaskCard";
import { VideoLessonCard } from "../components/module/VideoLessonCard";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import { ProgressBar } from "../components/ui/ProgressBar";
import { useAuth } from "../contexts/AuthContext";
import { useLearningData } from "../contexts/LearningDataContext";
import { apiFetch } from "../lib/apiClient";
import { normalizeArray } from "../lib/learningTransforms";
import { supabase } from "../lib/supabaseClient";

export function ModuleLessonPage() {
  const { courseId, moduleId } = useParams();
  const { user } = useAuth();
  const data = useLearningData();
  const module = data.getModule(moduleId);
  const course = data.getCourse(courseId);
  const videos = data.getVideos(moduleId);
  const [videoStatus, setVideoStatus] = useState("");
  const [requestedVideos, setRequestedVideos] = useState(false);

  useEffect(() => {
    if (!moduleId || videos.length || requestedVideos) return;

    let active = true;
    setRequestedVideos(true);
    apiFetch(`/api/videos?moduleId=${moduleId}`)
      .then((result) => {
        if (active) {
          setVideoStatus(result.message || "");
          data.refresh();
        }
      })
      .catch((error) => active && setVideoStatus(error.message));

    return () => {
      active = false;
    };
  }, [data, moduleId, requestedVideos, videos.length]);

  async function markPracticeComplete() {
    if (!module || !user) return;

    const existing = data.raw.progress.find((item) => item.module_id === module.id);
    const sections = new Set(normalizeArray(existing?.completed_sections));
    sections.add("practice");

    await supabase.from("module_progress").upsert(
      {
        user_id: user.id,
        course_id: course.id,
        module_id: module.id,
        completed_sections: [...sections],
        percent: Math.max(existing?.percent || 0, 70),
      },
      { onConflict: "user_id,module_id" },
    );
    await data.refresh();
  }

  if (!module || !course) {
    return <p className="soft-card p-6 text-sm font-bold text-muted">Module not found.</p>;
  }

  return (
    <div>
      <PageHeader title={`Module ${module.position}: ${module.title}`} subtitle={course.title} />
      <div className="mb-6 rounded-[22px] bg-white p-4 shadow-card">
        <div className="mb-2 flex justify-between text-sm font-extrabold text-muted">
          <span>Progress</span>
          <span>{module.progress}% complete</span>
        </div>
        <ProgressBar value={module.progress} />
      </div>

      {videoStatus ? <p className="mb-5 rounded-[20px] bg-peach px-4 py-3 text-sm font-bold text-navy">{videoStatus}</p> : null}

      <div className="space-y-5">
        <VideoLessonCard video={videos[0]} moduleTitle={module.title} />
        <ExplanationCard explanation={module.explanation} />
        <KeyConceptsCard concepts={normalizeArray(module.key_concepts)} />
        <ExamplesCard examples={normalizeArray(module.examples)} />
        <PracticeTaskCard tasks={normalizeArray(module.practice_tasks)} onComplete={markPracticeComplete} />
      </div>
    </div>
  );
}

export function ModuleLessonRightPanel() {
  const navigate = useNavigate();
  const { courseId, moduleId } = useParams();
  const data = useLearningData();
  const module = data.getModule(moduleId);
  const quiz = data.getQuizForModule(moduleId);

  if (!module) return null;

  return (
    <>
      <section className="soft-card p-5">
        <h2 className="text-lg font-extrabold text-ink">Module Progress</h2>
        <p className="mt-5 text-5xl font-extrabold text-navy">{module.progress}%</p>
        <ProgressBar value={module.progress} className="mt-4" />
        <div className="mt-5 space-y-3 text-sm font-bold text-muted">
          <p className="flex items-center gap-2">
            <CheckCircle2 size={17} className="text-navy" />
            Lesson opened
          </p>
          <p className="flex items-center gap-2">
            {module.progress >= 70 ? <CheckCircle2 size={17} className="text-navy" /> : <Circle size={17} />}
            Practice {module.progress >= 70 ? "complete" : "pending"}
          </p>
          <p className="flex items-center gap-2">
            {module.progress >= 100 ? <CheckCircle2 size={17} className="text-navy" /> : <Circle size={17} />}
            Quiz {module.progress >= 100 ? "completed" : "not completed"}
          </p>
        </div>
      </section>
      <AskAIBox courseId={courseId} moduleId={moduleId} />
      <section className="soft-card p-5">
        <h2 className="text-lg font-extrabold text-ink">Next Quiz</h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-muted">
          Answer {quiz ? data.getQuestions(quiz.id).length : 0} questions on {module.title}.
        </p>
        <Button className="mt-5 w-full" onClick={() => navigate(`/courses/${courseId}/modules/${moduleId}/quiz`)}>
          <PlayCircle size={17} />
          Start Quiz
        </Button>
      </section>
    </>
  );
}
