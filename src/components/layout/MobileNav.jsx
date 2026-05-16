import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "../../data/mockData";
import { cn } from "../../lib/classNames";
import { Button } from "../ui/Button";

export function MobileNav({ activePage, onNavigate }) {
  const [open, setOpen] = useState(false);

  function handleNavigate(page) {
    onNavigate(page);
    setOpen(false);
  }

  return (
    <div className="border-b border-divider/80 px-4 py-4 lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => handleNavigate("dashboard")} className="focus-ring text-left">
          <span className="block text-xl font-extrabold text-navy">CorAI</span>
          <span className="block text-xs font-bold text-muted">AI Course Builder</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="hidden h-10 items-center gap-2 rounded-2xl bg-white px-3 text-sm font-semibold text-muted shadow-card sm:flex">
            <Search size={16} />
            Search
          </span>
          <Button variant="outline" className="h-11 w-11 p-0" onClick={() => setOpen((value) => !value)}>
            {open ? <X size={19} /> : <Menu size={19} />}
          </Button>
        </div>
      </div>
      {open ? (
        <nav className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigate(item.id)}
              className={cn(
                "focus-ring rounded-2xl px-3 py-3 text-sm font-bold transition",
                activePage === item.id ? "bg-navy text-white" : "bg-white text-muted hover:text-navy",
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
