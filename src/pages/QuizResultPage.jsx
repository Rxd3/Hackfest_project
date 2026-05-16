import { Sparkles } from "lucide-react";
import { QuizResultCard } from "../components/quiz/QuizResultCard";
import { WeakTopicsCard } from "../components/quiz/WeakTopicsCard";
import { Button } from "../components/ui/Button";
import { SectionCard } from "../components/ui/SectionCard";

export function QuizResultPage({ onReview, onRetake, onContinue }) {
  return (
    <div className="space-y-5">
      <QuizResultCard onReview={onReview} onRetake={onRetake} onContinue={onContinue} />
      <SectionCard>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime text-navy">
            <Sparkles size={18} />
          </span>
          <h2 className="text-xl font-extrabold text-ink">CorAI Feedback</h2>
        </div>
        <p className="mt-4 text-sm font-semibold leading-7 text-muted">
          You understand the basic idea of IP addresses, but you need more practice with subnet masks.
        </p>
      </SectionCard>
      <WeakTopicsCard />
      <SectionCard>
        <h2 className="text-xl font-extrabold text-ink">Recommended Action</h2>
        <p className="mt-4 text-sm font-semibold leading-7 text-muted">
          Review Module 2 explanation and watch the video again before moving to Routing.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="outline" onClick={onReview}>Review Module</Button>
          <Button variant="peach" onClick={onRetake}>Retake Quiz</Button>
          <Button onClick={onContinue}>Continue Course</Button>
        </div>
      </SectionCard>
    </div>
  );
}
