import { SectionCard } from "../ui/SectionCard";

const concepts = ["IPv4", "Subnet Mask", "Gateway", "Private IP", "Public IP"];

export function KeyConceptsCard() {
  return (
    <SectionCard>
      <h2 className="text-xl font-extrabold text-ink">Key Concepts</h2>
      <div className="mt-5 flex flex-wrap gap-2">
        {concepts.map((concept) => (
          <span key={concept} className="rounded-2xl bg-gray-100 px-4 py-2 text-sm font-extrabold text-navy">
            {concept}
          </span>
        ))}
      </div>
    </SectionCard>
  );
}
