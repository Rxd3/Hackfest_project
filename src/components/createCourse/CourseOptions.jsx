import { OptionGroup } from "../ui/OptionGroup";

const defaultOptions = {
  level: "Beginner",
  duration: "1 Month",
  goal: "Full Course",
};

export function CourseOptions({ value = defaultOptions, onChange }) {
  function setOption(key, nextValue) {
    onChange?.({ ...value, [key]: nextValue });
  }

  return (
    <div className="space-y-5">
      <OptionGroup
        label="Course Level"
        options={["Beginner", "Intermediate", "Advanced"]}
        value={value.level}
        onChange={(nextValue) => setOption("level", nextValue)}
      />
      <OptionGroup
        label="Study Duration"
        options={["1 Week", "1 Month", "3 Months"]}
        value={value.duration}
        onChange={(nextValue) => setOption("duration", nextValue)}
      />
      <OptionGroup
        label="Goal"
        options={["Exam Preparation", "Full Course", "Quick Revision"]}
        value={value.goal}
        onChange={(nextValue) => setOption("goal", nextValue)}
      />
    </div>
  );
}
