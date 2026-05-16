import { MoreHorizontal, PlayCircle, RotateCcw, Trophy } from "lucide-react";
import { recommendedTasks } from "../../data/mockData";

const icons = [Trophy, PlayCircle, RotateCcw];

export function RecommendedTasks({ onQuiz, onModule }) {
  return (
    <section className="soft-card p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-ink">AI Recommended Tasks</h2>
      </div>
      <div className="space-y-3">
        {recommendedTasks.map((task, index) => {
          const Icon = icons[index] ?? Trophy;
          const action = index === 0 ? onQuiz : index === 1 ? onModule : onModule;
          return (
            <button
              key={`${task.type}-${task.title}`}
              type="button"
              onClick={action}
              className="focus-ring grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[20px] bg-gray-50 p-4 text-left transition hover:bg-white hover:shadow-card"
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${task.color} text-navy`}>
                <Icon size={20} strokeWidth={2.3} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-extrabold text-ink">
                  {task.type}: {task.title}
                </span>
                <span className="mt-1 block truncate text-xs font-bold text-muted">{task.course}</span>
              </span>
              <span className="flex items-center gap-3">
                <span className="hidden rounded-full bg-white px-3 py-1 text-xs font-extrabold text-muted sm:inline-flex">
                  {task.date}
                </span>
                <MoreHorizontal size={18} className="text-muted" />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
