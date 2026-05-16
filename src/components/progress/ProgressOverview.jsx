import { ProgressBar } from "../ui/ProgressBar";
import { SectionCard } from "../ui/SectionCard";

export function ProgressOverview() {
  return (
    <SectionCard>
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-ink">Computer Networks</h2>
          <p className="mt-2 text-sm font-bold text-muted">54% Complete</p>
        </div>
        <div className="grid grid-cols-1 gap-3 text-sm font-bold text-muted sm:grid-cols-3">
          <span className="rounded-2xl bg-gray-50 px-4 py-3">Completed: 6 modules</span>
          <span className="rounded-2xl bg-gray-50 px-4 py-3">Remaining: 6 modules</span>
          <span className="rounded-2xl bg-gray-50 px-4 py-3">Next: IP Addressing Quiz</span>
        </div>
      </div>
      <ProgressBar value={54} className="mt-6" />
    </SectionCard>
  );
}
