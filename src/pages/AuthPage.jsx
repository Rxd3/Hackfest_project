import { Bot, Chrome, LockKeyhole, ShieldCheck, Sparkles, UserPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/classNames";
import { useLearningData } from "../contexts/LearningDataContext";

export function AuthPage() {
  const { signInWithGoogle, signInWithPassword, signUpWithPassword, isSupabaseConfigured } = useLearningData();
  const [mode, setMode] = useState("login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loadingAction, setLoadingAction] = useState("");

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!isSupabaseConfigured) {
      setError("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
      return;
    }

    setLoadingAction(mode);
    try {
      if (mode === "login") {
        await signInWithPassword({ identifier, password });
      } else {
        const result = await signUpWithPassword({ username: identifier, password });
        setMessage(
          result.needsConfirmation
            ? "Account created. If email confirmation is enabled, confirm the email or disable confirmations for username-only accounts."
            : "Account created. Opening your workspace...",
        );
      }
    } catch (authError) {
      setError(authError.message);
    } finally {
      setLoadingAction("");
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setMessage("");

    if (!isSupabaseConfigured) {
      setError("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
      return;
    }

    setLoadingAction("google");
    try {
      await signInWithGoogle();
    } catch (authError) {
      setError(authError.message);
      setLoadingAction("");
    }
  }

  const passwordBusy = loadingAction === "login" || loadingAction === "signup";

  return (
    <main className="flex min-h-screen items-center justify-center bg-shell px-4 py-8 text-ink">
      <section className="w-full max-w-lg rounded-[32px] bg-white p-6 shadow-soft sm:p-7">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-lime">
            <Bot size={24} />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-navy">CorAI</h1>
            <p className="text-sm font-bold text-muted">Sign in to your learning workspace.</p>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-2 rounded-[20px] bg-gray-50 p-1">
          {[
            { id: "login", label: "Log in", icon: LockKeyhole },
            { id: "signup", label: "Create account", icon: UserPlus },
          ].map((item) => {
            const Icon = item.icon;
            const active = mode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={cn(
                  "focus-ring flex min-h-11 items-center justify-center gap-2 rounded-2xl px-3 text-sm font-extrabold transition",
                  active ? "bg-white text-navy shadow-card" : "text-muted hover:bg-white hover:text-navy",
                )}
                onClick={() => {
                  setMode(item.id);
                  setError("");
                  setMessage("");
                }}
              >
                <Icon size={17} />
                {item.label}
              </button>
            );
          })}
        </div>

        <form className="mt-5 space-y-4 rounded-[24px] bg-gray-50 p-5" onSubmit={handlePasswordSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-extrabold text-ink">
              {mode === "login" ? "Username or email" : "Username"}
            </span>
            <input
              className="focus-ring min-h-12 w-full rounded-2xl border border-divider bg-white px-4 text-sm font-semibold text-ink outline-none placeholder:text-muted"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              autoComplete={mode === "login" ? "username" : "username"}
              placeholder={mode === "login" ? "name or example@email.com" : "name"}
              disabled={passwordBusy || !isSupabaseConfigured}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-extrabold text-ink">Password</span>
            <input
              className="focus-ring min-h-12 w-full rounded-2xl border border-divider bg-white px-4 text-sm font-semibold text-ink outline-none placeholder:text-muted"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              placeholder="At least 6 characters"
              disabled={passwordBusy || !isSupabaseConfigured}
            />
          </label>

          <Button className="w-full" type="submit" disabled={passwordBusy || !identifier || !password || !isSupabaseConfigured}>
            {mode === "login" ? <LockKeyhole size={18} /> : <UserPlus size={18} />}
            {loadingAction === mode ? "Working..." : mode === "login" ? "Log in" : "Create account"}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs font-extrabold uppercase tracking-normal text-muted">
          <span className="h-px flex-1 bg-divider" />
          or
          <span className="h-px flex-1 bg-divider" />
        </div>

        <div className="rounded-[24px] bg-gray-50 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime text-navy">
              <Sparkles size={18} />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-ink">Continue With Google</h2>
              <p className="mt-1 text-sm font-semibold leading-6 text-muted">
                Use your Google account to open your private workspace.
              </p>
            </div>
          </div>

          <Button className="mt-5 w-full" variant="secondary" onClick={handleGoogleSignIn} disabled={loadingAction === "google" || !isSupabaseConfigured}>
            <Chrome size={18} />
            {loadingAction === "google" ? "Opening Google..." : "Continue with Google"}
          </Button>
        </div>

        {!isSupabaseConfigured ? (
          <p className="mt-5 rounded-2xl bg-[#fff0ea] p-4 text-sm font-bold leading-6 text-[#d44724]">
            Supabase is not configured yet. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then redeploy.
          </p>
        ) : null}
        {message ? <p className="mt-5 rounded-2xl bg-lime p-4 text-sm font-bold leading-6 text-navy">{message}</p> : null}
        {error ? <p className="mt-5 rounded-2xl bg-[#fff0ea] p-4 text-sm font-bold leading-6 text-[#d44724]">{error}</p> : null}

        <div className="mt-5 flex gap-3 rounded-[22px] border border-divider p-4">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-navy" />
          <p className="text-xs font-bold leading-5 text-muted">
            Your session keeps courses, files, quizzes, and chats scoped to your own workspace.
          </p>
        </div>
      </section>
    </main>
  );
}
