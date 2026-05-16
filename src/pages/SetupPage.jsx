import { AlertTriangle, Database, KeyRound } from "lucide-react";
import { SectionCard } from "../components/ui/SectionCard";

export function SetupPage() {
  return (
    <main className="min-h-screen bg-shell px-4 py-8 text-ink">
      <section className="mx-auto max-w-3xl rounded-[32px] bg-app p-6 shadow-soft sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-peach text-navy">
            <AlertTriangle size={22} />
          </span>
          <div>
            <h1 className="text-3xl font-extrabold text-navy">CorAI needs configuration</h1>
            <p className="mt-3 text-sm font-semibold leading-6 text-muted">
              Add your Supabase and API keys before running the real app. Keep these files local; `.env*` is already
              ignored except `.env.example`.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <SectionCard>
            <Database className="text-navy" size={24} />
            <h2 className="mt-4 text-lg font-extrabold text-ink">Supabase</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-muted">
              Create a project, run `supabase/migrations/001_corai_mvp.sql`, enable Email and Google Auth, then add the
              URL and anon key.
            </p>
          </SectionCard>
          <SectionCard>
            <KeyRound className="text-navy" size={24} />
            <h2 className="mt-4 text-lg font-extrabold text-ink">Server Keys</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-muted">
              Add `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, and `YOUTUBE_API_KEY` for Vercel functions.
            </p>
          </SectionCard>
        </div>
      </section>
    </main>
  );
}
