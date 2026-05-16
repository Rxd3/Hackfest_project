import { useState } from "react";
import { OptionGroup } from "../ui/OptionGroup";

export function CourseOptions() {
  const [level, setLevel] = useState("Beginner");
  const [duration, setDuration] = useState("1 Month");
  const [goal, setGoal] = useState("Full Course");

  return (
    <div className="space-y-5">
      <OptionGroup label="Course Level" options={["Beginner", "Intermediate", "Advanced"]} value={level} onChange={setLevel} />
      <OptionGroup label="Study Duration" options={["1 Week", "1 Month", "3 Months"]} value={duration} onChange={setDuration} />
      <OptionGroup label="Goal" options={["Exam Preparation", "Full Course", "Quick Revision"]} value={goal} onChange={setGoal} />
    </div>
  );
}
