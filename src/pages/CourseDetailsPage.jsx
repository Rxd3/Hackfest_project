import { BarChart3, ChevronRight, Target } from "lucide-react";
import { CourseHeader } from "../components/course/CourseHeader";
import { CourseRoadmap } from "../components/course/CourseRoadmap";
import { LearningOutcomesCard } from "../components/course/LearningOutcomesCard";
import { ModuleCard } from "../components/course/ModuleCard";
import { Button } from "../components/ui/Button";
import { ProgressBar } from "../components/ui/ProgressBar";
import { computerNetworkModules, courses } from "../data/mockData";

const course = courses[0];

export function CourseDetailsPage({ onContinue, onModuleOpen }) {
  return (
    <div className="space-y-6">
      <CourseHeader course={course} onContinue={onContinue} />

      <div className="grid gap-5 2xl:grid-cols-[0.85fr_1.15fr]">
        <LearningOutcomesCard />
        <CourseRoadmap />
      </div>

      <section>
        <h2 className="mb-4 text-xl font-extrabold text-ink">Modules</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {computerNetworkModules.map((module) => (
            <ModuleCard key={module.id} module={module} onOpen={onModuleOpen} />
          ))}
        </div>
      </section>
    </div>
  );
}

export function CourseDetailsRightPanel({ onProgress }) {
  return (
    <>
      <section className="soft-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-ink">Course Progress</h2>
          <BarChart3 size={19} className="text-navy" />
        </div>
        <p className="mt-5 text-5xl font-extrabold text-navy">54%</p>
        <ProgressBar value={54} className="mt-4" />
        <div className="mt-5 space-y-3 text-sm font-bold text-muted">
          <p>Completed: 6 / 12 modules</p>
          <p>Quizzes passed: 3 / 6</p>
          <p>Average score: 76%</p>
        </div>
        <Button className="mt-5 w-full" variant="outline" onClick={onProgress}>
          View Progress
        </Button>
      </section>

      <section className="soft-card p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fff0ea] text-[#d44724]">
            <Target size={18} />
          </span>
          <h2 className="text-lg font-extrabold text-ink">Weak Topics</h2>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {course.weakTopics.map((topic) => (
            <span key={topic} className="rounded-2xl bg-gray-100 px-3 py-2 text-xs font-extrabold text-muted">
              {topic}
            </span>
          ))}
        </div>
      </section>

      <section className="soft-card p-5">
        <h2 className="text-lg font-extrabold text-ink">Next Step</h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-muted">Review Module 2 and retake the quiz.</p>
        <Button className="mt-5 w-full" onClick={onProgress}>
          Open Plan
          <ChevronRight size={17} />
        </Button>
      </section>
    </>
  );
}
