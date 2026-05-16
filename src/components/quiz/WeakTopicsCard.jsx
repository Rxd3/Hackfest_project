import { AlertCircle } from "lucide-react";
import { SectionCard } from "../ui/SectionCard";

export function WeakTopicsCard({ topics = ["Subnet mask", "Network address"] }) {
  return (
    <SectionCard>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fff0ea] text-[#d44724]">
          <AlertCircle size={18} />
        </span>
        <h2 className="text-xl font-extrabold text-ink">Weak Topics</h2>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {topics.map((topic) => (
          <span key={topic} className="rounded-2xl bg-[#fff0ea] px-4 py-2 text-sm font-extrabold text-[#d44724]">
            {topic}
          </span>
        ))}
      </div>
    </SectionCard>
  );
}
