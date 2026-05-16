import { SectionCard } from "../ui/SectionCard";

export function StudyActivityChart({ activityBars = [] }) {
  const max = Math.max(1, ...activityBars.map((item) => item.hours));

  return (
    <SectionCard>
      <h2 className="text-xl font-extrabold text-ink">Study Activity</h2>
      <div className="mt-6 grid h-56 grid-cols-7 items-end gap-3">
        {activityBars.map((item) => (
          <div key={item.day} className="flex h-full flex-col items-center justify-end gap-3">
            <div className="flex w-full flex-1 items-end rounded-full bg-gray-100 p-1">
              <span
                className="block w-full rounded-full bg-lavender"
                style={{ height: item.hours === 0 ? "8px" : `${Math.max(12, (item.hours / max) * 100)}%` }}
              />
            </div>
            <span className="text-xs font-extrabold text-muted">{item.day}</span>
            <span className="text-xs font-bold text-ink">{item.hours}h</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
