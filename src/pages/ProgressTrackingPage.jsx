import { Bot } from "lucide-react";
import { ProgressOverview } from "../components/progress/ProgressOverview";
import { ProgressTable } from "../components/progress/ProgressTable";
import { StudyActivityChart } from "../components/progress/StudyActivityChart";
import { WeakTopicHeatmap } from "../components/progress/WeakTopicHeatmap";
import { StatsCard } from "../components/dashboard/StatsCard";
import { PageHeader } from "../components/ui/PageHeader";

export function ProgressTrackingPage() {
  return (
    <div>
      <PageHeader
        title="Progress Tracking"
        subtitle="Track your courses, quiz scores, weak topics, and study activity."
      />
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <StatsCard value="54%" label="Overall Progress" />
        <StatsCard value="18" label="Modules Completed" />
        <StatsCard value="76%" label="Average Quiz Score" />
        <StatsCard value="5" label="Days Study Streak" />
      </div>
      <div className="mt-6 space-y-5">
        <ProgressOverview />
        <ProgressTable />
        <WeakTopicHeatmap />
        <StudyActivityChart />
      </div>
    </div>
  );
}

export function ProgressRightPanel() {
  return (
    <>
      <section className="soft-card p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime text-navy">
            <Bot size={18} />
          </span>
          <h2 className="text-lg font-extrabold text-ink">AI Recommendation</h2>
        </div>
        <p className="mt-4 text-sm font-semibold leading-6 text-muted">
          Spend 30 minutes reviewing subnetting, then retake the IP Addressing quiz.
        </p>
      </section>
      <section className="soft-card p-5">
        <h2 className="text-lg font-extrabold text-ink">Upcoming Study Plan</h2>
        <div className="mt-4 space-y-3 text-sm font-bold text-muted">
          <p>Today: Review Subnetting</p>
          <p>Tomorrow: Routing Basics</p>
          <p>Friday: Quiz: Routing</p>
        </div>
      </section>
    </>
  );
}
