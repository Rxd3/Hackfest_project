import { cn } from "../../lib/classNames";

const days = ["M", "T", "W", "T", "F", "S", "S"];
const studyDays = new Set([4, 7, 11, 13, 16, 20, 24, 29]);

export function CalendarPanel() {
  const blanks = Array.from({ length: 4 }, (_, index) => `blank-${index}`);
  const dates = Array.from({ length: 31 }, (_, index) => index + 1);

  return (
    <section className="soft-card p-5">
      <h2 className="text-lg font-extrabold text-ink">May 2026</h2>
      <div className="mt-5 grid grid-cols-7 gap-2 text-center">
        {days.map((day, index) => (
          <span key={`${day}-${index}`} className="text-xs font-extrabold text-muted">
            {day}
          </span>
        ))}
        {blanks.map((blank) => (
          <span key={blank} />
        ))}
        {dates.map((date) => {
          const selected = date === 16;
          return (
            <div key={date} className="flex h-10 flex-col items-center justify-center gap-1">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold",
                  selected ? "bg-navy text-white" : "text-muted",
                )}
              >
                {date}
              </span>
              <span className={cn("h-1 w-1 rounded-full", studyDays.has(date) ? "bg-lime" : "bg-transparent")} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
