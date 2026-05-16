import { Bot, Send, Sparkles } from "lucide-react";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";

const quickActions = ["Explain simpler", "Give example", "Generate flashcards", "Create practice question", "Summarize this module"];

export function AskAIPage() {
  return (
    <div>
      <PageHeader title="Ask CorAI" subtitle="Get help with your course materials." />
      <section className="soft-card flex min-h-[560px] flex-col p-5 sm:p-6">
        <div className="flex-1 space-y-5">
          <div className="flex justify-end">
            <div className="max-w-[78%] rounded-[22px] bg-navy px-5 py-4 text-sm font-semibold leading-6 text-white">
              Explain subnetting in simple words.
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-lime text-navy">
              <Bot size={18} />
            </span>
            <div className="max-w-[82%] rounded-[22px] bg-gray-50 px-5 py-4 text-sm font-semibold leading-6 text-muted">
              Subnetting means dividing one large network into smaller networks. It helps organize devices and manage IP
              addresses more efficiently.
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 rounded-[24px] bg-gray-50 p-3 sm:flex-row">
          <input
            className="focus-ring min-h-12 flex-1 rounded-2xl bg-white px-4 text-sm font-semibold outline-none placeholder:text-muted"
            placeholder="Ask anything about your course..."
          />
          <Button>
            <Send size={17} />
            Send
          </Button>
        </div>
      </section>
    </div>
  );
}

export function AskAIRightPanel() {
  return (
    <>
      <section className="soft-card p-5">
        <h2 className="text-lg font-extrabold text-ink">Context Selector</h2>
        <p className="mt-4 text-sm font-bold text-muted">Ask about:</p>
        <div className="mt-3 rounded-[20px] bg-navy p-4 text-white">
          <p className="text-sm font-extrabold">Computer Networks</p>
          <p className="mt-1 text-xs font-bold text-white/65">Module 2: IP Addressing</p>
        </div>
      </section>
      <section className="soft-card p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lavender text-navy">
            <Sparkles size={18} />
          </span>
          <h2 className="text-lg font-extrabold text-ink">Quick Actions</h2>
        </div>
        <div className="mt-5 grid gap-2">
          {quickActions.map((action) => (
            <button
              key={action}
              type="button"
              className="focus-ring rounded-2xl bg-gray-50 px-4 py-3 text-left text-sm font-bold text-muted transition hover:bg-white hover:text-navy hover:shadow-card"
            >
              {action}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
