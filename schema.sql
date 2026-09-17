-- Khume Technologies — finance ledger schema for Supabase
create extension if not exists "pgcrypto";
create table if not exists entities (id uuid primary key default gen_random_uuid(), name text not null, created_at timestamptz not null default now());
create table if not exists subscriptions (id uuid primary key default gen_random_uuid(), entity_id uuid references entities(id) on delete set null, name text not null, category text, amount numeric not null default 0, cycle text not null default 'monthly' check (cycle in ('monthly','yearly')), status text not null default 'active' check (status in ('active','paused')), created_at timestamptz not null default now());
create table if not exists transactions (id uuid primary key default gen_random_uuid(), entity_id uuid references entities(id) on delete set null, name text not null, category text, amount numeric not null default 0, type text not null default 'expense' check (type in ('income','expense')), date date not null default current_date, created_at timestamptz not null default now());
create table if not exists settings (id text primary key default 'app', currency text not null default '$');
insert into settings (id,currency) values ('app','$') on conflict (id) do nothing;
alter table entities enable row level security;
alter table subscriptions enable row level security;
alter table transactions enable row level security;
alter table settings enable row level security;
DO $$ BEGIN CREATE POLICY "anon full access" ON entities FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "anon full access" ON subscriptions FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "anon full access" ON transactions FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "anon full access" ON settings FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
alter publication supabase_realtime add table entities;
alter publication supabase_realtime add table subscriptions;
alter publication supabase_realtime add table transactions;
alter publication supabase_realtime add table settings;
