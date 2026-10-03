-- Tabela de sync do System Level Up. Rode no projeto Supabase escolhido.
create table if not exists public.saves (
  user_id uuid primary key default auth.uid() references auth.users on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.saves enable row level security;
create policy "own row select" on public.saves for select using (auth.uid() = user_id);
create policy "own row insert" on public.saves for insert with check (auth.uid() = user_id);
create policy "own row update" on public.saves for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
