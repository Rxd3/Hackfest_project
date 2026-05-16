import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { quizQuestion } from "../../data/mockData";
import { cn } from "../../lib/classNames";
import { Button } from "../ui/Button";
import { SectionCard } from "../ui/SectionCard";

const letters = ["A", "B", "C", "D"];

export function QuizQuestionCard({ selectedOption, onSelect, onSubmit }) {
  return (
    <SectionCard>
      <p className="text-sm font-extrabold text-muted">Question 1 of 5</p>
      <h2 className="mt-3 text-2xl font-extrabold leading-tight text-ink">{quizQuestion.title}</h2>

      <div className="mt-6 space-y-3">
        {quizQuestion.options.map((option, index) => {
          const selected = selectedOption === index;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(index)}
              className={cn(
                "focus-ring flex w-full items-center gap-4 rounded-[20px] border p-4 text-left transition",
                selected ? "border-navy bg-navy text-white" : "border-divider bg-gray-50 text-ink hover:bg-white",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold",
                  selected ? "bg-white text-navy" : "bg-white text-muted",
                )}
              >
                {letters[index]}
              </span>
              <span className="text-sm font-bold">{option}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-7 flex flex-wrap justify-between gap-3">
        <Button variant="outline">
          <ArrowLeft size={17} />
          Previous
        </Button>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline">
            Next
            <ArrowRight size={17} />
          </Button>
          <Button onClick={onSubmit}>
            <Send size={17} />
            Submit Quiz
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}
