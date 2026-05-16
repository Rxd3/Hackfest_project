import { cn } from "../../lib/classNames";

export function OptionGroup({ label, options, value, onChange }) {
  return (
    <div>
      <p className="mb-3 text-sm font-bold text-ink">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option === value;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={cn(
                "focus-ring rounded-2xl px-4 py-2 text-sm font-bold transition",
                active ? "bg-navy text-white" : "bg-gray-100 text-muted hover:bg-white hover:text-navy",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
