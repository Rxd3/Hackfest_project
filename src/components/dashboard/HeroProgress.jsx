import { FileUp, Plus } from "lucide-react";
import { Button } from "../ui/Button";
import { CourseCard } from "./CourseCard";

export function HeroProgress({ courses, onCreate, onCourseOpen, userName = "there" }) {
  return (
    <section className="overflow-hidden rounded-[28px] bg-navy p-5 text-white shadow-soft sm:p-7">
      <div className="grid gap-7 xl:grid-cols-[0.9fr_1.1fr] xl:items-center">
        <div className="max-w-xl">
          <p className="text-lg font-bold text-white/80">Hi, {userName}!</p>
          <h1 className="mt-3 max-w-lg text-3xl font-extrabold leading-tight tracking-normal sm:text-4xl">
            What would you like to learn today?
          </h1>
          <p className="mt-4 max-w-md text-sm font-medium leading-6 text-white/65">
            Upload your materials or create a course from any topic.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={onCreate}>
              <FileUp size={18} />
              Upload Materials
            </Button>
            <Button variant="peach" onClick={onCreate}>
              <Plus size={18} />
              Create from Topic
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
          {courses.slice(0, 3).map((course) => (
            <CourseCard key={course.id} course={course} compact onOpen={() => onCourseOpen(course.id)} />
          ))}
          {!courses.length ? (
            <div className="rounded-[24px] bg-white/10 p-5 text-sm font-bold leading-6 text-white/70">
              Your generated courses will appear here.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
