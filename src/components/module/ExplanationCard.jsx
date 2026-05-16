import { Lightbulb, ListChecks, MessageSquareText } from "lucide-react";
import { Button } from "../ui/Button";
import { SectionCard } from "../ui/SectionCard";

export function ExplanationCard() {
  return (
    <SectionCard>
      <h2 className="text-xl font-extrabold text-ink">Short Explanation</h2>
      <p className="mt-4 text-sm font-semibold leading-7 text-muted">
        IP addressing is the method used to identify devices on a network. Each device needs an IP address so data can
        be sent to the correct destination.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button variant="outline">
          <Lightbulb size={17} />
          Explain simpler
        </Button>
        <Button variant="outline">
          <MessageSquareText size={17} />
          Give example
        </Button>
        <Button variant="outline">
          <ListChecks size={17} />
          Summarize
        </Button>
      </div>
    </SectionCard>
  );
}
