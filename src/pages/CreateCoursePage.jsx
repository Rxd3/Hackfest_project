import { CheckCircle2 } from "lucide-react";
import { TopicInputCard } from "../components/createCourse/TopicInputCard";
import { UploadMaterialsCard } from "../components/createCourse/UploadMaterialsCard";
import { PageHeader } from "../components/ui/PageHeader";

const steps = [
  "Upload or type a topic",
  "AI extracts learning outcomes",
  "AI builds modules",
  "AI adds quizzes and videos",
  "You track your progress",
];

export function CreateCoursePage({ onGenerated }) {
  return (
    <div>
      <PageHeader
        title="Create a New Course"
        subtitle="Turn any material or topic into a structured learning path."
      />
      <div className="grid gap-5 2xl:grid-cols-2">
        <UploadMaterialsCard onGenerate={onGenerated} />
        <TopicInputCard onBuild={onGenerated} />
      </div>
    </div>
  );
}

export function CreateCourseRightPanel() {
  return (
    <section className="soft-card p-5">
      <h2 className="text-lg font-extrabold text-ink">How CorAI Works</h2>
      <div className="mt-5 space-y-4">
        {steps.map((step, index) => (
          <div key={step} className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-navy text-xs font-extrabold text-white">
              {index + 1}
            </span>
            <p className="pt-1 text-sm font-bold leading-5 text-muted">{step}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-[20px] bg-lime p-4 text-navy">
        <CheckCircle2 size={22} />
        <p className="mt-3 text-sm font-extrabold leading-5">Static demo today, API-ready structure tomorrow.</p>
      </div>
    </section>
  );
}
