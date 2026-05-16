import { cn } from "../../lib/classNames";

const styles = {
  completed: "bg-navy text-white",
  "in progress": "bg-peach text-navy",
  "needs review": "bg-[#ffefe8] text-[#d44724]",
  "not started": "bg-gray-100 text-muted",
};

export function StatusPill({ status }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-bold capitalize", styles[status])}>
      {status}
    </span>
  );
}
