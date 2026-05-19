import { AlertTriangle, Moon, Save, Sun, Trash2, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import { SectionCard } from "../components/ui/SectionCard";
import { useLearningData } from "../contexts/LearningDataContext";
import { cn } from "../lib/classNames";

export function SettingsPage() {
  const { deleteAccount, setThemePreference, theme, updateUsername, user } = useLearningData();
  const currentUsername = useMemo(() => getUserName(user), [user]);
  const [username, setUsername] = useState(currentUsername);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setUsername(currentUsername);
  }, [currentUsername]);

  async function handleUsernameSubmit(event) {
    event.preventDefault();
    setStatus("");
    setError("");
    setSaving(true);

    try {
      await updateUsername(username);
      setStatus("Username updated.");
    } catch (settingsError) {
      setError(settingsError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    setStatus("");
    setError("");

    if (!window.confirm("Delete your CorAI account and all saved courses? This cannot be undone.")) return;

    setDeleting(true);
    try {
      await deleteAccount();
    } catch (settingsError) {
      setError(settingsError.message);
      setDeleting(false);
    }
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your CorAI learning workspace preferences." />

      <div className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
        <SectionCard>
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-lime text-navy">
              {theme === "dark" ? <Moon size={19} /> : <Sun size={19} />}
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-extrabold text-ink">Appearance</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-muted">
                Choose the workspace theme for this browser.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 rounded-[20px] bg-gray-50 p-1">
            {[
              { id: "light", label: "Light", icon: Sun },
              { id: "dark", label: "Dark", icon: Moon },
            ].map((item) => {
              const Icon = item.icon;
              const active = theme === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={cn(
                    "focus-ring flex min-h-11 items-center justify-center gap-2 rounded-2xl px-3 text-sm font-extrabold transition",
                    active ? "bg-white text-navy shadow-card" : "text-muted hover:bg-white hover:text-navy",
                  )}
                  onClick={() => setThemePreference(item.id)}
                >
                  <Icon size={17} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard>
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-lavender text-navy">
              <UserRound size={19} />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-extrabold text-ink">Username</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-muted">
                This name appears on your CorAI profile.
              </p>
            </div>
          </div>

          <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={handleUsernameSubmit}>
            <input
              className="focus-ring min-h-12 min-w-0 flex-1 rounded-2xl border border-divider bg-gray-50 px-4 text-sm font-semibold text-ink outline-none placeholder:text-muted focus:bg-white"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="username"
              autoComplete="username"
              disabled={saving || deleting}
            />
            <Button type="submit" disabled={saving || deleting || username === currentUsername}>
              <Save size={18} />
              {saving ? "Saving..." : "Save"}
            </Button>
          </form>
        </SectionCard>

        <SectionCard className="xl:col-span-2">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff0ea] text-[#d44724]">
                <AlertTriangle size={19} />
              </span>
              <div className="min-w-0">
                <h2 className="text-lg font-extrabold text-ink">Delete account</h2>
                <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-muted">
                  This removes your account, courses, files, quizzes, study plan, progress, and chat history.
                </p>
              </div>
            </div>

            <Button variant="danger" onClick={handleDeleteAccount} disabled={deleting || saving}>
              <Trash2 size={18} />
              {deleting ? "Deleting..." : "Delete account"}
            </Button>
          </div>
        </SectionCard>
      </div>

      {status ? <p className="mt-5 rounded-2xl bg-lime px-4 py-3 text-sm font-bold text-navy">{status}</p> : null}
      {error ? <p className="mt-5 rounded-2xl bg-[#fff0ea] px-4 py-3 text-sm font-bold text-[#d44724]">{error}</p> : null}
    </div>
  );
}

function getUserName(user) {
  return user?.user_metadata?.username || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "";
}
