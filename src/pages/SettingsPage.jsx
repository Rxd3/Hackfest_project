import { Bell, Lock, Palette } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";

const settings = [
  { icon: Bell, title: "Study reminders", text: "Keep quiz and review notifications enabled." },
  { icon: Palette, title: "Dashboard theme", text: "Premium light dashboard mode is active." },
  { icon: Lock, title: "Privacy controls", text: "Uploaded materials stay scoped to your workspace." },
];

export function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your CorAI learning workspace preferences." />
      <div className="grid gap-5 md:grid-cols-3">
        {settings.map((item) => {
          const Icon = item.icon;
          return (
            <SectionCard key={item.title}>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime text-navy">
                <Icon size={19} />
              </span>
              <h2 className="mt-5 text-lg font-extrabold text-ink">{item.title}</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-muted">{item.text}</p>
            </SectionCard>
          );
        })}
      </div>
    </div>
  );
}
