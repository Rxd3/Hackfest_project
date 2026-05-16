import { Check, Circle, Flag, Play, RotateCcw } from "lucide-react";
import { cn } from "../../lib/classNames";

const roadmap = [
  { label: "Start", status: "completed", Icon: Check },
  { label: "Module 1: Networking Basics", status: "completed", Icon: Check },
  { label: "Module 2: IP Addressing", status: "in progress", Icon: Play },
  { label: "Module 3: Subnetting", status: "needs review", Icon: RotateCcw },
  { label: "Module 4: Routing", status: "not started", Icon: Circle },
  { label: "Module 5: Switching", status: "not started", Icon: Circle },
  { label: "Final Quiz", status: "not started", Icon: Flag },
];

const styles = {
  completed: "bg-navy text-white border-navy",
  "in progress": "bg-peach text-navy border-peach",
  "needs review": "bg-[#fff0ea] text-[#d44724] border-[#ffb49d]",
  "not started": "bg-white text-muted border-divider",
};

export function CourseRoadmap() {
  return (
    <section className="soft-card p-5 sm:p-6">
      <h2 className="text-xl font-extrabold text-ink">Course Roadmap</h2>
      <div className="mt-5 grid gap-3">
        {roadmap.map(({ label, status, Icon }, index) => (
          <div key={label} className="grid grid-cols-[36px_1fr] gap-3">
            <div className="flex flex-col items-center">
              <span className={cn("flex h-9 w-9 items-center justify-center rounded-2xl border", styles[status])}>
                <Icon size={17} />
              </span>
              {index < roadmap.length - 1 ? <span className="h-7 w-px bg-divider" /> : null}
            </div>
            <div className={cn("rounded-[18px] border px-4 py-3 text-sm font-extrabold", styles[status])}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
