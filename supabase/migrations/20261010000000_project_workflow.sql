create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users (id) on delete cascade,
  owner_profile_id uuid references public.profiles (id) on delete set null,
  title text not null check (char_length(title) between 1 and 120),
  brief text not null check (char_length(brief) between 1 and 4000),
  role text not null,
  specialization text,
  city text,
  budget text check (budget is null or char_length(budget) <= 100),
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_status_created_at_idx
  on public.projects (status, created_at desc);
create index if not exists projects_owner_created_at_idx
  on public.projects (owner_user_id, created_at desc);

create table if not exists public.project_applications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  applicant_user_id uuid not null references auth.users (id) on delete cascade,
  applicant_profile_id uuid references public.profiles (id) on delete set null,
  applicant_name text not null,
  applicant_username text,
  message text not null check (char_length(message) between 1 and 2000),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, applicant_user_id)
);

create index if not exists project_applications_project_created_at_idx
  on public.project_applications (project_id, created_at desc);
create index if not exists project_applications_applicant_created_at_idx
  on public.project_applications (applicant_user_id, created_at desc);

alter table public.projects enable row level security;
alter table public.project_applications enable row level security;

create policy "Authenticated users can view projects"
  on public.projects for select to authenticated using (true);
create policy "Users can create their own projects"
  on public.projects for insert to authenticated with check (auth.uid() = owner_user_id);
create policy "Owners can update their projects"
  on public.projects for update to authenticated
  using (auth.uid() = owner_user_id)
  with check (auth.uid() = owner_user_id);

create policy "Applicants and project owners can view applications"
  on public.project_applications for select to authenticated
  using (
    auth.uid() = applicant_user_id
    or exists (
      select 1 from public.projects
      where projects.id = project_applications.project_id
        and projects.owner_user_id = auth.uid()
    )
  );
create policy "Users can apply to open projects"
  on public.project_applications for insert to authenticated
  with check (
    auth.uid() = applicant_user_id
    and exists (
      select 1 from public.projects
      where projects.id = project_applications.project_id
        and projects.status = 'open'
        and projects.owner_user_id <> auth.uid()
    )
  );
create policy "Project owners can decide on applications"
  on public.project_applications for update to authenticated
  using (
    exists (
      select 1 from public.projects
      where projects.id = project_applications.project_id
        and projects.owner_user_id = auth.uid()
    )
  )
  with check (
    status in ('pending', 'accepted', 'declined')
    and exists (
      select 1 from public.projects
      where projects.id = project_applications.project_id
        and projects.owner_user_id = auth.uid()
    )
  );