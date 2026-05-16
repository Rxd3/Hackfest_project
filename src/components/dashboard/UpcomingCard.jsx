import { Clock3 } from "lucide-react";

export function UpcomingCard() {
  return (
    <section className="soft-card p-5">
      <h2 className="text-lg font-extrabold text-ink">Upcoming</h2>
      <div className="mt-4 rounded-[20px] bg-navy p-4 text-white">
        <div className="flex items-center gap-2 text-xs font-bold text-white/65">
          <Clock3 size={15} />
          10:00 - 12:30
        </div>
        <p className="mt-3 text-sm font-extrabold leading-5">Computer Networks: IP Addressing Quiz</p>
      </div>
    </section>
  );
}
