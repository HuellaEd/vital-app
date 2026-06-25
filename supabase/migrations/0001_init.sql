create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  nombre text,
  apellido text,
  fecha_nacimiento date,
  sexo text check (sexo in ('masculino', 'femenino', 'otro', 'prefiero_no_decir')),
  altura_cm numeric(5,1) check (altura_cm > 0 and altura_cm < 300),
  created_at timestamptz not null default now()
);

create table public.weight_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  fecha date not null default current_date,
  peso_kg numeric(5,2) not null check (peso_kg > 0 and peso_kg < 500),
  notas text,
  created_at timestamptz not null default now()
);

create index weight_entries_user_id_fecha_idx
  on public.weight_entries (user_id, fecha desc);

create unique index weight_entries_user_fecha_unique
  on public.weight_entries (user_id, fecha);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.weight_entries enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

create policy "weight_entries_select_own" on public.weight_entries for select using (auth.uid() = user_id);
create policy "weight_entries_insert_own" on public.weight_entries for insert with check (auth.uid() = user_id);
create policy "weight_entries_update_own" on public.weight_entries for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "weight_entries_delete_own" on public.weight_entries for delete using (auth.uid() = user_id);
