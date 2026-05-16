import { SectionCard } from "../ui/SectionCard";

const topics = [
  { label: "Strong", topic: "Networking Basics", score: "90%", className: "bg-navy text-white" },
  { label: "Medium", topic: "IP Addressing", score: "60%", className: "bg-peach text-navy" },
  { label: "Needs Review", topic: "Subnetting", score: "45%", className: "bg-[#fff0ea] text-[#d44724]" },
];

export function WeakTopicHeatmap() {
  return (
    <SectionCard>
      <h2 className="text-xl font-extrabold text-ink">Weak Topic Heatmap</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {topics.map((item) => (
          <article key={item.topic} className={`rounded-[22px] p-5 ${item.className}`}>
            <p className="text-xs font-extrabold uppercase tracking-normal opacity-75">{item.label}</p>
            <h3 className="mt-2 text-lg font-extrabold">{item.topic}</h3>
            <p className="mt-3 text-3xl font-extrabold">{item.score}</p>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}
