import { CalendarCheck2, SlidersHorizontal } from "lucide-react";
import { studyWeek } from "../data/mockData";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";

export function StudyPlanPage() {
  return (
    <div>
      <PageHeader title="Study Plan" subtitle="Your personalized weekly learning schedule." />
      <div className="soft-card p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {studyWeek.map((item, index) => (
            <article
              key={item.day}
              className="rounded-[24px] bg-gray-50 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-card"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-navy text-sm font-extrabold text-white">
                {index + 1}
              </span>
              <h2 className="mt-5 text-lg font-extrabold text-ink">{item.day}</h2>
              <p className="mt-3 text-sm font-extrabold leading-5 text-navy">{item.task}</p>
              <p className="mt-2 text-xs font-bold leading-5 text-muted">{item.meta}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StudyPlanRightPanel() {
  return (
    <section className="soft-card p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lavender text-navy">
          <CalendarCheck2 size={18} />
        </span>
        <h2 className="text-lg font-extrabold text-ink">This Week</h2>
      </div>
      <div className="mt-5 space-y-3 text-sm font-bold text-muted">
        <p>5 study sessions</p>
        <p>2 quizzes</p>
        <p>1 review day</p>
        <p>Estimated time: 8.5 hours</p>
      </div>
      <Button className="mt-6 w-full">
        <SlidersHorizontal size={17} />
        Adjust Plan
      </Button>
    </section>
  );
}
