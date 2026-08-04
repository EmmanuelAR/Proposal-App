-- Esquema para "Fabi & Emma" — pega esto en Supabase Dashboard > SQL Editor > Run

create table if not exists app_state (
  id int primary key default 1,
  said_yes boolean not null default false,
  start_date timestamptz,
  constraint singleton check (id = 1)
);
insert into app_state (id, said_yes, start_date) values (1, false, null)
  on conflict (id) do nothing;

create table if not exists moments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date,
  description text default '',
  photos text[] not null default '{}',
  seeded boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  created_at timestamptz not null default now()
);

create table if not exists reminders (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  note text,
  created_at timestamptz not null default now()
);

-- RLS: esta app usa una contraseña propia como "puerta" en vez de auth de Supabase,
-- así que abrimos lectura/escritura con la clave anónima. No pongas datos sensibles reales aquí.
alter table app_state enable row level security;
alter table moments enable row level security;
alter table notes enable row level security;
alter table reminders enable row level security;

create policy "anon full access" on app_state for all using (true) with check (true);
create policy "anon full access" on moments for all using (true) with check (true);
create policy "anon full access" on notes for all using (true) with check (true);
create policy "anon full access" on reminders for all using (true) with check (true);

-- Bucket de fotos: crea manualmente un bucket público llamado "photos" en Storage,
-- o corre esto (requiere permisos de service_role, mejor hazlo desde el Dashboard > Storage > New bucket "photos", marcado como público).
