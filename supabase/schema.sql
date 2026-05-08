-- ─── EduTracker Supabase Schema ──────────────────────────────────────────────
-- Supabase ダッシュボードの SQL Editor でこのファイルを実行してください

-- ── profiles ─────────────────────────────────────────────────────────────────
create table public.profiles (
  id         uuid references auth.users on delete cascade primary key,
  name       text not null,
  role       text not null check (role in ('admin', 'trainee')) default 'trainee',
  joined_at  date default current_date,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Anyone can read profiles"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- ── task_progress ─────────────────────────────────────────────────────────────
create table public.task_progress (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references public.profiles(id) on delete cascade not null,
  step_id      text not null,
  task_id      integer not null,
  completed_at date not null default current_date,
  unique(user_id, step_id, task_id)
);

alter table public.task_progress enable row level security;

create policy "Anyone can read task_progress"
  on public.task_progress for select using (true);

create policy "Users can insert their own progress"
  on public.task_progress for insert with check (auth.uid() = user_id);

create policy "Users can delete their own progress"
  on public.task_progress for delete using (auth.uid() = user_id);

-- ── task_comments ─────────────────────────────────────────────────────────────
create table public.task_comments (
  id         uuid default gen_random_uuid() primary key,
  step_id    text not null,
  task_id    integer not null,
  user_id    uuid references public.profiles(id) on delete cascade not null,
  text       text not null,
  created_at timestamptz default now()
);

alter table public.task_comments enable row level security;

create policy "Anyone can read comments"
  on public.task_comments for select using (true);

create policy "Users can insert their own comments"
  on public.task_comments for insert with check (auth.uid() = user_id);

-- ── ai_tasks ──────────────────────────────────────────────────────────────────
create table public.ai_tasks (
  id           uuid default gen_random_uuid() primary key,
  lang         text not null,
  tag          text not null,
  title        text not null,
  description  text not null,
  links        jsonb default '[]'::jsonb,
  checkpoints  jsonb default '[]'::jsonb,
  status       text not null check (status in ('pending', 'approved', 'rejected')) default 'pending',
  created_by   uuid references public.profiles(id),
  approved_by  uuid references public.profiles(id),
  created_at   timestamptz default now(),
  approved_at  timestamptz
);

alter table public.ai_tasks enable row level security;

create policy "Anyone can read ai_tasks"
  on public.ai_tasks for select using (true);

create policy "Authenticated users can insert ai_tasks"
  on public.ai_tasks for insert with check (auth.uid() = created_by);

create policy "Admin can update ai_tasks"
  on public.ai_tasks for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ── task_edits (課題の編集・追加) ──────────────────────────────────────────────
create table public.task_edits (
  id          uuid default gen_random_uuid() primary key,
  step_id     text not null,
  task_id     integer not null,
  title       text not null,
  tag         text,
  description text,
  links       jsonb default '[]'::jsonb,
  updated_by  uuid references public.profiles(id),
  updated_at  timestamptz default now(),
  unique(step_id, task_id)
);

alter table public.task_edits enable row level security;

create policy "Anyone can read task_edits"
  on public.task_edits for select using (true);

create policy "Admin can insert task_edits"
  on public.task_edits for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admin can update task_edits"
  on public.task_edits for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admin can delete task_edits"
  on public.task_edits for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ── Auto-create profile on signup ─────────────────────────────────────────────
-- 最初に登録したユーザーを自動的に admin にする
create or replace function public.handle_new_user()
returns trigger as $$
declare
  user_count integer;
begin
  select count(*) into user_count from public.profiles;
  insert into public.profiles (id, name, role, joined_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    case when user_count = 0 then 'admin' else 'trainee' end,
    current_date
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
