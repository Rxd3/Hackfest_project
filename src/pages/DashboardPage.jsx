import { BarChart3, BookOpenCheck, GraduationCap } from "lucide-react";
import { AITipCard } from "../components/dashboard/AITipCard";
import { CalendarPanel } from "../components/dashboard/CalendarPanel";
import { HeroProgress } from "../components/dashboard/HeroProgress";
import { RecommendedTasks } from "../components/dashboard/RecommendedTasks";
import { StatsCard } from "../components/dashboard/StatsCard";
import { UpcomingCard } from "../components/dashboard/UpcomingCard";

export function DashboardPage({ onCreate, onCourseOpen, onModuleOpen, onQuizOpen }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">My Learning Progress</h1>
      </div>

      <HeroProgress onCreate={onCreate} onCourseOpen={onCourseOpen} />

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard value="5" label="Courses Generated" icon={GraduationCap} />
        <StatsCard value="18" label="Modules Completed" icon={BookOpenCheck} />
        <StatsCard value="8.5h" label="Study Hours This Week" icon={BarChart3} chart />
      </div>

      <RecommendedTasks onQuiz={onQuizOpen} onModule={onModuleOpen} />
    </div>
  );
}

export function DashboardRightPanel() {
  return (
    <>
      <CalendarPanel />
      <UpcomingCard />
      <AITipCard />
    </>
  );
}
