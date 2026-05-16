import { useMemo, useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { AskAIPage, AskAIRightPanel } from "./pages/AskAIPage";
import { CourseDetailsPage, CourseDetailsRightPanel } from "./pages/CourseDetailsPage";
import { CreateCoursePage, CreateCourseRightPanel } from "./pages/CreateCoursePage";
import { DashboardPage, DashboardRightPanel } from "./pages/DashboardPage";
import { ModuleLessonPage, ModuleLessonRightPanel } from "./pages/ModuleLessonPage";
import { MyCoursesPage } from "./pages/MyCoursesPage";
import { ProgressRightPanel, ProgressTrackingPage } from "./pages/ProgressTrackingPage";
import { QuizPage, QuizRightPanel } from "./pages/QuizPage";
import { QuizResultPage } from "./pages/QuizResultPage";
import { SettingsPage } from "./pages/SettingsPage";
import { StudyPlanPage, StudyPlanRightPanel } from "./pages/StudyPlanPage";

const navAlias = {
  "course-details": "courses",
  module: "courses",
  progress: "courses",
  "quiz-result": "quiz",
};

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);

  const goTo = (nextPage) => {
    if (nextPage === "quiz") {
      setSelectedQuizOption(null);
    }
    setPage(nextPage);
  };

  const activeNav = navAlias[page] ?? page;

  const screen = useMemo(() => {
    const commonActions = {
      onCreate: () => goTo("create"),
      onCourseOpen: () => goTo("course-details"),
      onDetails: () => goTo("course-details"),
      onContinue: () => goTo("module"),
      onModuleOpen: () => goTo("module"),
      onQuizOpen: () => goTo("quiz"),
      onProgress: () => goTo("progress"),
    };

    switch (page) {
      case "create":
        return {
          content: <CreateCoursePage onGenerated={() => goTo("course-details")} />,
          rightPanel: <CreateCourseRightPanel />,
        };
      case "courses":
        return {
          content: (
            <MyCoursesPage
              onCreate={commonActions.onCreate}
              onDetails={commonActions.onDetails}
              onContinue={commonActions.onContinue}
            />
          ),
        };
      case "course-details":
        return {
          content: <CourseDetailsPage onContinue={commonActions.onContinue} onModuleOpen={commonActions.onModuleOpen} />,
          rightPanel: <CourseDetailsRightPanel onProgress={commonActions.onProgress} />,
        };
      case "module":
        return {
          content: <ModuleLessonPage />,
          rightPanel: <ModuleLessonRightPanel onQuizOpen={commonActions.onQuizOpen} />,
        };
      case "quiz":
        return {
          content: (
            <QuizPage
              selectedOption={selectedQuizOption}
              onSelect={setSelectedQuizOption}
              onSubmit={() => goTo("quiz-result")}
            />
          ),
          rightPanel: <QuizRightPanel answered={selectedQuizOption === null ? 3 : 4} />,
        };
      case "quiz-result":
        return {
          content: (
            <QuizResultPage
              onReview={commonActions.onModuleOpen}
              onRetake={commonActions.onQuizOpen}
              onContinue={commonActions.onCourseOpen}
            />
          ),
        };
      case "progress":
        return {
          content: <ProgressTrackingPage />,
          rightPanel: <ProgressRightPanel />,
        };
      case "study-plan":
        return {
          content: <StudyPlanPage />,
          rightPanel: <StudyPlanRightPanel />,
        };
      case "ask-ai":
        return {
          content: <AskAIPage />,
          rightPanel: <AskAIRightPanel />,
        };
      case "settings":
        return {
          content: <SettingsPage />,
        };
      case "dashboard":
      default:
        return {
          content: (
            <DashboardPage
              onCreate={commonActions.onCreate}
              onCourseOpen={commonActions.onCourseOpen}
              onModuleOpen={commonActions.onModuleOpen}
              onQuizOpen={commonActions.onQuizOpen}
            />
          ),
          rightPanel: <DashboardRightPanel />,
        };
    }
  }, [page, selectedQuizOption]);

  return (
    <AppShell activePage={activeNav} onNavigate={goTo} rightPanel={screen.rightPanel}>
      {screen.content}
    </AppShell>
  );
}
