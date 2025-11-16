-- QUESTIONS TABLE
create table questions (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  question text not null,
  short_answer text,
  verdict text check (verdict in ('works','doesnt_work','mixed')),
  category text not null,
  summary text,
  body_markdown text,
  evidence_json jsonb,
  tags text[],
  sources text[] default '{}'::text[],
  status text check (status in ('draft','approved','scheduled','published')) default 'draft',
  published_at timestamptz,
  scheduled_for timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- indexes
create index questions_slug_idx on questions(slug);
create index questions_category_idx on questions(category);
create index questions_status_idx on questions(status);
create index questions_published_idx on questions(published_at desc);

-- HACK IDEAS TABLE
create table hack_ideas (
  id uuid primary key default uuid_generate_v4(),
  proposed_question text not null,
  category text not null,
  tags text[],
  status text check (status in ('new','draft_generated','approved','discarded')) default 'new',
  notes text,
  priority int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- SUBSCRIBERS TABLE (for minimal email signup)
create table subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  created_at timestamptz default now()
);

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_questions_updated_at before update on questions
  for each row execute function update_updated_at_column();

create trigger update_hack_ideas_updated_at before update on hack_ideas
  for each row execute function update_updated_at_column();

