import { Send, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";

export function AskAIBox() {
  return (
    <section className="soft-card p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime text-navy">
          <Sparkles size={18} />
        </span>
        <h2 className="text-lg font-extrabold text-ink">Ask CorAI</h2>
      </div>
      <label className="mt-4 block">
        <input
          className="focus-ring w-full rounded-2xl border border-divider bg-gray-50 px-4 py-3 text-sm font-semibold outline-none placeholder:text-muted focus:bg-white"
          placeholder="Ask about this module..."
        />
      </label>
      <Button className="mt-3 w-full">
        <Send size={17} />
        Ask
      </Button>
    </section>
  );
}
