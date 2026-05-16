import { Bot, Lightbulb, ListChecks, MessageSquareText, Send } from "lucide-react";
import { useState } from "react";
import { useLearningData } from "../../contexts/LearningDataContext";
import { Button } from "../ui/Button";
import { SectionCard } from "../ui/SectionCard";

const quickPrompts = [
  {
    label: "Explain simpler",
    icon: Lightbulb,
    prompt: "Explain this lecture in simpler beginner-friendly language. Focus only on this lecture.",
  },
  {
    label: "Give example",
    icon: MessageSquareText,
    prompt: "Give me one clear example from this lecture and explain why it matters.",
  },
  {
    label: "Summarize",
    icon: ListChecks,
    prompt: "Summarize the key points of this lecture in a short checklist.",
  },
];

export function ExplanationCard({ courseId, moduleId, moduleTitle, explanation }) {
  const data = useLearningData();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function askLecture(question, displayText = question) {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    const userMessage = { id: `user-${Date.now()}`, role: "user", content: displayText };
    setChat((current) => [...current, userMessage]);
    setLoading(true);
    setError("");

    try {
      const result = await data.askAi({ courseId, moduleId, message: trimmed });
      setChat((current) => [
        ...current,
        { id: `assistant-${Date.now()}`, role: "assistant", content: result.answer },
      ]);
      setMessage("");
    } catch (askError) {
      setError(askError.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    askLecture(message);
  }

  return (
    <SectionCard>
      <h2 className="text-xl font-extrabold text-ink">Short Explanation</h2>
      <p className="mt-4 text-sm font-semibold leading-7 text-muted">
        {explanation}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        {quickPrompts.map(({ label, icon: Icon, prompt }) => (
          <Button key={label} variant="outline" onClick={() => askLecture(prompt, label)} disabled={loading}>
            <Icon size={17} />
            {label}
          </Button>
        ))}
      </div>

      <div className="mt-6 border-t border-divider pt-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime text-navy">
            <MessageSquareText size={18} />
          </span>
          <div>
            <h3 className="text-base font-extrabold text-ink">Ask About This Lecture</h3>
            <p className="text-xs font-bold text-muted">{moduleTitle}</p>
          </div>
        </div>

        {chat.length ? (
          <div className="mt-4 max-h-96 space-y-4 overflow-y-auto rounded-[20px] bg-gray-50 p-4">
            {chat.map((item) => (
              <ChatMessage key={item.id} message={item} />
            ))}
            {loading ? <ChatMessage message={{ id: "loading", role: "assistant", content: "Thinking through this lecture..." }} muted /> : null}
          </div>
        ) : null}

        {error ? <p className="mt-3 rounded-2xl bg-[#fff0ea] p-3 text-sm font-bold text-[#d44724]">{error}</p> : null}

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <label className="flex-1">
            <span className="sr-only">Ask about this lecture</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="focus-ring min-h-24 w-full resize-none rounded-2xl border border-divider bg-gray-50 px-4 py-3 text-sm font-semibold leading-6 outline-none placeholder:text-muted focus:bg-white"
              placeholder="Ask a question about this lecture..."
            />
          </label>
          <Button type="submit" className="self-stretch sm:self-end" disabled={loading || !message.trim()}>
            <Send size={17} />
            {loading ? "Asking..." : "Ask"}
          </Button>
        </form>
      </div>
    </SectionCard>
  );
}

function ChatMessage({ message, muted = false }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl bg-navy px-4 py-3 text-sm font-semibold leading-6 text-white shadow-sm">
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-lime text-navy">
        <Bot size={16} />
      </span>
      <div className={muted ? "max-w-[92%] rounded-2xl bg-white px-4 py-3 text-sm font-semibold leading-6 text-ink opacity-75 shadow-sm" : "max-w-[92%] rounded-2xl bg-white px-4 py-3 text-sm font-semibold leading-6 text-ink shadow-sm"}>
        <p className="mb-1 text-xs font-extrabold text-navy">CorAI</p>
        <MessageContent text={message.content} />
      </div>
    </div>
  );
}

function MessageContent({ text }) {
  const blocks = parseMessageBlocks(text);

  return (
    <div className="space-y-3 break-words">
      {blocks.map((block, index) => {
        if (block.type === "list") {
          return (
            <ul key={`list-${index}`} className="space-y-2 pl-4">
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`} className="list-disc pl-1">
                  <InlineText text={item} />
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={`paragraph-${index}`} className="whitespace-pre-wrap">
            <InlineText text={block.text} />
          </p>
        );
      })}
    </div>
  );
}

function parseMessageBlocks(text = "") {
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  const blocks = [];

  for (const line of lines) {
    const bulletMatch = line.match(/^[-*]\s+(.+)/);
    const numberedMatch = line.match(/^\d+[.)]\s+(.+)/);
    const listText = bulletMatch?.[1] || numberedMatch?.[1];

    if (listText) {
      const previous = blocks[blocks.length - 1];
      if (previous?.type === "list") {
        previous.items.push(listText);
      } else {
        blocks.push({ type: "list", items: [listText] });
      }
      continue;
    }

    blocks.push({ type: "paragraph", text: line });
  }

  return blocks.length ? blocks : [{ type: "paragraph", text: "I am ready when you ask about this lecture." }];
}

function InlineText({ text = "" }) {
  const parts = [];
  const pattern = /(\*\*|__)(.+?)\1/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    parts.push(
      <strong key={`${match.index}-${match[2]}`} className="font-extrabold text-ink">
        {match[2]}
      </strong>,
    );
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length ? parts : text;
}
