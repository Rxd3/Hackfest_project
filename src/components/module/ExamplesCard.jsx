import { SectionCard } from "../ui/SectionCard";

export function ExamplesCard({ examples = [] }) {
  return (
    <SectionCard>
      <h2 className="text-xl font-extrabold text-ink">Examples</h2>
      <div className="mt-4 space-y-3">
        {examples.map((example) => (
          <p key={example} className="rounded-[20px] bg-gray-50 p-4 text-sm font-semibold leading-6 text-muted">
            {example}
          </p>
        ))}
        {!examples.length ? <p className="text-sm font-semibold text-muted">No examples generated.</p> : null}
      </div>
    </SectionCard>
  );
}
