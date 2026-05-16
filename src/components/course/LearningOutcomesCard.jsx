import { CheckCircle2 } from "lucide-react";
import { learningOutcomes } from "../../data/mockData";
import { SectionCard } from "../ui/SectionCard";

export function LearningOutcomesCard() {
  return (
    <SectionCard>
      <h2 className="text-xl font-extrabold text-ink">Learning Outcomes</h2>
      <ol className="mt-5 space-y-3">
        {learningOutcomes.map((outcome, index) => (
          <li key={outcome} className="flex gap-3 text-sm font-semibold leading-6 text-muted">
            <CheckCircle2 className="mt-0.5 shrink-0 text-navy" size={18} />
            <span>
              <strong className="font-extrabold text-ink">{index + 1}.</strong> {outcome}
            </span>
          </li>
        ))}
      </ol>
    </SectionCard>
  );
}
