import { cn } from "../../lib/classNames";

function MiniAreaChart() {
  const points = [18, 24, 20, 34, 28, 42, 36];

  return (
    <div className="mt-4 flex h-12 items-end gap-1.5" aria-label="Study hours trend">
      {points.map((point, index) => (
        <span
          key={index}
          className="w-full rounded-t-full bg-navy"
          style={{ height: `${point}px`, opacity: 0.35 + index * 0.08 }}
        />
      ))}
    </div>
  );
}

export function StatsCard({ value, label, chart }) {
  return (
    <article className={cn("soft-card min-h-[140px] p-5", chart && "overflow-hidden")}>
      <p className="text-3xl font-extrabold text-navy">{value}</p>
      <p className="mt-2 text-sm font-bold leading-5 text-muted">{label}</p>
      {chart ? <MiniAreaChart /> : null}
    </article>
  );
}
