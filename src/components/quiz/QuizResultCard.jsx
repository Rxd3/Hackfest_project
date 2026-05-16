import { RotateCcw, Trophy } from "lucide-react";
import { Button } from "../ui/Button";
import { SectionCard } from "../ui/SectionCard";

export function QuizResultCard({ onReview, onRetake, onContinue }) {
  return (
    <SectionCard className="text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-lime text-navy">
        <Trophy size={28} />
      </span>
      <h1 className="mt-5 text-2xl font-extrabold text-ink">Your Score</h1>
      <p className="mt-3 text-6xl font-extrabold text-navy">60%</p>
      <p className="mt-3 text-sm font-bold text-muted">You passed 3 out of 5 questions.</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button variant="outline" onClick={onReview}>
          Review Module
        </Button>
        <Button variant="peach" onClick={onRetake}>
          <RotateCcw size={17} />
          Retake Quiz
        </Button>
        <Button onClick={onContinue}>Continue Course</Button>
      </div>
    </SectionCard>
  );
}
