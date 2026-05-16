import { Sparkles } from "lucide-react";

export function AITipCard() {
  return (
    <section className="soft-card p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime text-navy">
          <Sparkles size={18} />
        </span>
        <h2 className="text-lg font-extrabold text-ink">AI Tip</h2>
      </div>
      <p className="mt-4 text-sm font-semibold leading-6 text-muted">
        You scored lower in subnetting. Review Module 2 before starting Routing.
      </p>
    </section>
  );
}
