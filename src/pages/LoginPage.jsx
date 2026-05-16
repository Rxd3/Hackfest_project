import { Bot, LogIn, Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/Button";
import { supabase } from "../lib/supabaseClient";

export function LoginPage() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailAuth(event) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    const authCall =
      mode === "signin"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: window.location.origin },
          });

    const { error } = await authCall;
    setLoading(false);

    if (error) {
      setStatus(error.message);
      return;
    }

    if (mode === "signup") {
      setStatus("Check your email to confirm your account.");
    }
  }

  async function handleGoogleAuth() {
    setStatus("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });

    if (error) {
      setStatus(error.message);
    }
  }

  return (
    <main className="min-h-screen bg-shell px-4 py-8 text-ink">
      <section className="mx-auto grid min-h-[760px] max-w-6xl overflow-hidden rounded-[34px] bg-app shadow-soft lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-between bg-navy p-7 text-white sm:p-10">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime text-navy">
              <Bot size={24} />
            </span>
            <div>
              <p className="text-xl font-extrabold">CorAI</p>
              <p className="text-xs font-bold text-white/60">AI Course Builder</p>
            </div>
          </div>
          <div className="max-w-xl py-14">
            <h1 className="text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl">
              Build courses from your notes, then study with AI.
            </h1>
            <p className="mt-5 text-sm font-semibold leading-6 text-white/68">
              Upload demo materials, generate modules and quizzes, track progress, and ask CorAI questions in context.
            </p>
          </div>
          <div className="rounded-[24px] bg-white/10 p-4 text-sm font-bold leading-6 text-white/75">
            Demo privacy note: do not upload private or sensitive materials while using Gemini free tier.
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <form onSubmit={handleEmailAuth} className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-card sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lavender text-navy">
                <Sparkles size={19} />
              </span>
              <div>
                <h2 className="text-2xl font-extrabold text-ink">
                  {mode === "signin" ? "Welcome back" : "Create account"}
                </h2>
                <p className="mt-1 text-sm font-semibold text-muted">Sign in to your learning workspace.</p>
              </div>
            </div>

            <label className="mt-7 block">
              <span className="text-sm font-extrabold text-muted">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="focus-ring mt-2 w-full rounded-2xl border border-divider bg-gray-50 px-4 py-3 text-sm font-semibold outline-none focus:bg-white"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-sm font-extrabold text-muted">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
                className="focus-ring mt-2 w-full rounded-2xl border border-divider bg-gray-50 px-4 py-3 text-sm font-semibold outline-none focus:bg-white"
              />
            </label>

            {status ? <p className="mt-4 rounded-2xl bg-peach px-4 py-3 text-sm font-bold text-navy">{status}</p> : null}

            <Button type="submit" className="mt-6 w-full" disabled={loading}>
              <Mail size={17} />
              {loading ? "Working..." : mode === "signin" ? "Sign In" : "Sign Up"}
            </Button>
            <Button type="button" variant="outline" className="mt-3 w-full" onClick={handleGoogleAuth}>
              <LogIn size={17} />
              Continue with Google
            </Button>
            <button
              type="button"
              onClick={() => setMode((value) => (value === "signin" ? "signup" : "signin"))}
              className="focus-ring mt-5 w-full rounded-2xl px-4 py-3 text-sm font-extrabold text-muted transition hover:bg-gray-50 hover:text-navy"
            >
              {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
