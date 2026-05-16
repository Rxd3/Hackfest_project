import { CheckCircle2, ListChecks } from "lucide-react";
import { QuizQuestionCard } from "../components/quiz/QuizQuestionCard";
import { PageHeader } from "../components/ui/PageHeader";

export function QuizPage({ selectedOption, onSelect, onSubmit }) {
  return (
    <div>
      <PageHeader title="Quiz: IP Addressing" subtitle="5 Questions • Estimated time: 5 minutes" />
      <QuizQuestionCard selectedOption={selectedOption} onSelect={onSelect} onSubmit={onSubmit} />
    </div>
  );
}

export function QuizRightPanel({ answered = 3 }) {
  return (
    <>
      <section className="soft-card p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lavender text-navy">
            <ListChecks size={18} />
          </span>
          <h2 className="text-lg font-extrabold text-ink">Quiz Progress</h2>
        </div>
        <p className="mt-5 text-4xl font-extrabold text-navy">{answered} / 5</p>
        <p className="mt-2 text-sm font-bold text-muted">answered</p>
      </section>
      <section className="soft-card p-5">
        <h2 className="text-lg font-extrabold text-ink">Topic Coverage</h2>
        <p className="mt-3 text-sm font-semibold text-muted">This quiz covers:</p>
        <div className="mt-4 space-y-3">
          {["IP address", "Subnet mask", "Gateway"].map((topic) => (
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
