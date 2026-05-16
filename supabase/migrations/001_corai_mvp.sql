create extension if not exists vector;
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  level text not null default 'Beginner',
  duration text not null default '1 Month',
  goal text not null default 'Full Course',
  source_type text not null default 'topic',
  source_label text,
  source_file text,
  estimated_time text,
  learning_outcomes jsonb not null default '[]'::jsonb,
  weak_topics jsonb not null default '[]'::jsonb,
  card_color text not null default 'lavender',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  kind text not null,
  file_path text,
  file_name text,
  mime_type text,
  text_excerpt text,
  created_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  position integer not null,
  title text not null,
  summary text,
  explanation text,
  key_concepts jsonb not null default '[]'::jsonb,
  examples jsonb not null default '[]'::jsonb,
  practice_tasks jsonb not null default '[]'::jsonb,
  estimated_minutes integer not null default 30,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(course_id, position)
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  url text not null,
  thumbnail_url text,
  channel_title text,
  source text not null default 'youtube',
  created_at timestamptz not null default now()
);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  position integer not null,
  prompt text not null,
  options jsonb not null,
  correct_option_index integer not null,
  explanation text,
  topic text,
  created_at timestamptz not null default now(),
  unique(quiz_id, position)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  score integer not null default 0,
  total_questions integer not null default 0,
  correct_count integer not null default 0,
  weak_topics jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.module_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  completed_sections jsonb not null default '[]'::jsonb,
  percent integer not null default 0,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(user_id, module_id)
);

create table if not exists public.study_plan_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  module_id uuid references public.modules(id) on delete cascade,
  title text not null,
  meta text,
  kind text not null default 'lesson',
  due_date date,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.material_chunks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  source_id uuid references public.course_sources(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  embedding vector(768),
  created_at timestamptz not null default now()
);

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  module_id uuid references public.modules(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_courses_user on public.courses(user_id, created_at desc);
create index if not exists idx_modules_course on public.modules(course_id, position);
create index if not exists idx_quiz_questions_quiz on public.quiz_questions(quiz_id, position);
create index if not exists idx_quiz_attempts_quiz on public.quiz_attempts(user_id, quiz_id, created_at desc);
create index if not exists idx_module_progress_user on public.module_progress(user_id, course_id);
create index if not exists idx_material_chunks_course on public.material_chunks(user_id, course_id);
create index if not exists idx_material_chunks_embedding on public.material_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create or replace function public.match_material_chunks(
  query_embedding vector(768),
  match_count int,
  filter_user_id uuid,
  filter_course_id uuid
)
returns table (
  id uuid,
  course_id uuid,
  content text,
  similarity float
)
language sql stable
as $$
  select
    material_chunks.id,
    material_chunks.course_id,
    material_chunks.content,
    1 - (material_chunks.embedding <=> query_embedding) as similarity
  from public.material_chunks
  where material_chunks.user_id = filter_user_id
    and material_chunks.course_id = filter_course_id
    and material_chunks.embedding is not null
  order by material_chunks.embedding <=> query_embedding
  limit match_count;
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists courses_touch_updated_at on public.courses;
create trigger courses_touch_updated_at before update on public.courses
for each row execute function public.touch_updated_at();

drop trigger if exists modules_touch_updated_at on public.modules;
create trigger modules_touch_updated_at before update on public.modules
for each row execute function public.touch_updated_at();

drop trigger if exists module_progress_touch_updated_at on public.module_progress;
create trigger module_progress_touch_updated_at before update on public.module_progress
for each row execute function public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.course_sources enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.videos enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.module_progress enable row level security;
alter table public.study_plan_items enable row level security;
alter table public.material_chunks enable row level security;
alter table public.ai_messages enable row level security;

create policy "profiles are user owned" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "courses are user owned" on public.courses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "course sources are user owned" on public.course_sources
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "modules are user owned" on public.modules
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "lessons are user owned" on public.lessons
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "videos are user owned" on public.videos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "quizzes are user owned" on public.quizzes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "quiz questions are user owned" on public.quiz_questions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "quiz attempts are user owned" on public.quiz_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "module progress is user owned" on public.module_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "study plan items are user owned" on public.study_plan_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "material chunks are user owned" on public.material_chunks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "ai messages are user owned" on public.ai_messages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('materials', 'materials', false)
on conflict (id) do nothing;

create policy "materials select own folder" on storage.objects
  for select using (
    bucket_id = 'materials'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "materials insert own folder" on storage.objects
  for insert with check (
    bucket_id = 'materials'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "materials update own folder" on storage.objects
  for update using (
    bucket_id = 'materials'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "materials delete own folder" on storage.objects
  for delete using (
    bucket_id = 'materials'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
