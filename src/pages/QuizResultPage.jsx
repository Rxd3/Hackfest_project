import { useNavigate, useParams } from "react-router-dom";
import { QuizResultCard } from "../components/quiz/QuizResultCard";
import { PageHeader } from "../components/ui/PageHeader";
import { useLearningData } from "../contexts/LearningDataContext";

export function QuizResultPage() {
  const navigate = useNavigate();
  const { attemptId } = useParams();
  const data = useLearningData();
  const attempt = data.attempts.find((item) => item.id === attemptId);
  const module = attempt ? data.getModule(attempt.module_id) : null;
  const course = attempt ? data.getCourse(attempt.course_id) : null;

  if (!attempt || !module || !course) {
    return <p className="soft-card p-6 text-sm font-bold text-muted">Quiz result not found.</p>;
  }

  return (
    <div>
      <PageHeader title="Quiz Result" subtitle={`${course.title} - ${module.title}`} />
      <QuizResultCard
        attempt={attempt}
        weakTopics={attempt.weak_topics || []}
        onReview={() => navigate(`/courses/${course.id}/modules/${module.id}`)}
        onRetake={() => navigate(`/courses/${course.id}/modules/${module.id}/quiz`)}
        onContinue={() => navigate(`/courses/${course.id}`)}
      />
    </div>
  );
}
