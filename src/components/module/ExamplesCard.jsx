import { SectionCard } from "../ui/SectionCard";

export function ExamplesCard() {
  return (
    <SectionCard>
      <h2 className="text-xl font-extrabold text-ink">Examples</h2>
      <p className="mt-4 rounded-[20px] bg-gray-50 p-4 text-sm font-semibold leading-6 text-muted">
        192.168.1.10 is a private IPv4 address commonly used inside local networks.
      </p>
    </SectionCard>
  );
}
