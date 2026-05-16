import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { AskAIBox } from "../components/module/AskAIBox";
import { ExamplesCard } from "../components/module/ExamplesCard";
import { ExplanationCard } from "../components/module/ExplanationCard";
import { KeyConceptsCard } from "../components/module/KeyConceptsCard";
import { PracticeTaskCard } from "../components/module/PracticeTaskCard";
import { VideoLessonCard } from "../components/module/VideoLessonCard";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import { ProgressBar } from "../components/ui/ProgressBar";

export function ModuleLessonPage() {
  return (
    <div>
      <PageHeader title="Module 2: IP Addressing" subtitle="Computer Networks" />
      <div className="mb-6 rounded-[22px] bg-white p-4 shadow-card">
        <div className="mb-2 flex justify-between text-sm font-extrabold text-muted">
          <span>Progress</span>
          <span>60% complete</span>
        </div>
        <ProgressBar value={60} />
      </div>

      <div className="space-y-5">
        <VideoLessonCard />
        <ExplanationCard />
        <KeyConceptsCard />
        <ExamplesCard />
        <PracticeTaskCard />
      </div>
    </div>
  );
}

export function ModuleLessonRightPanel({ onQuizOpen }) {
  return (
    <>
      <section className="soft-card p-5">
        <h2 className="text-lg font-extrabold text-ink">Module Progress</h2>
        <p className="mt-5 text-5xl font-extrabold text-navy">60%</p>
        <ProgressBar value={60} className="mt-4" />
        <div className="mt-5 space-y-3 text-sm font-bold text-muted">
          <p className="flex items-center gap-2">
            <CheckCircle2 size={17} className="text-navy" />
            Video watched
          </p>
          <p className="flex items-center gap-2">
            <CheckCircle2 size={17} className="text-navy" />
            Explanation read
          </p>
          <p className="flex items-center gap-2">
            <Circle size={17} />
            Practice pending
          </p>
          <p className="flex items-center gap-2">
            <Circle size={17} />
            Quiz not completed
          </p>
        </div>
      </section>
      <AskAIBox />
      <section className="soft-card p-5">
        <h2 className="text-lg font-extrabold text-ink">Next Quiz</h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-muted">Answer 5 short questions on IP addressing.</p>
        <Button className="mt-5 w-full" onClick={onQuizOpen}>
          <PlayCircle size={17} />
          Start Quiz
        </Button>
      </section>
    </>
  );
}
