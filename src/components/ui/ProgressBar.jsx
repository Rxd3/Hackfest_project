import { cn } from "../../lib/classNames";

export function ProgressBar({ value, tone = "navy", className }) {
  const color = tone === "white" ? "bg-white" : tone === "lime" ? "bg-lime" : "bg-navy";

  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-black/10", className)}>
      <div className={cn("h-full rounded-full transition-all duration-500", color)} style={{ width: `${value}%` }} />
    </div>
  );
}
