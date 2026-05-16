import { CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button";
import { SectionCard } from "../ui/SectionCard";

export function PracticeTaskCard() {
  return (
    <SectionCard>
      <h2 className="text-xl font-extrabold text-ink">Practice Task</h2>
      <div className="mt-4 rounded-[20px] bg-gray-50 p-5 text-sm font-semibold leading-7 text-muted">
        <p>Given the IP address 192.168.1.10/24, identify:</p>
        <ol className="mt-3 list-inside list-decimal space-y-1">
          <li>Network address</li>
          <li>Host part</li>
          <li>Subnet mask</li>
        </ol>
      </div>
      <Button className="mt-5">
        <CheckCircle2 size={18} />
        Check My Answer
      </Button>
    </SectionCard>
  );
}
