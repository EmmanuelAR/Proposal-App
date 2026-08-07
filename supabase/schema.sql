-- Esquema para "Fabi & Emma" — pega esto en Supabase Dashboard > SQL Editor > Run
-- La app solo necesita esta tabla: guarda si ya dijo que sí y desde cuándo,
-- para que el contador no dependa del navegador ni del dispositivo.

create table if not exists app_state (
  id int primary key default 1,
  said_yes boolean not null default false,
  start_date timestamptz,
  constraint singleton check (id = 1)
);
insert into app_state (id, said_yes, start_date) values (1, false, null)
  on conflict (id) do nothing;

-- RLS: esta app usa una contraseña propia como "puerta" en vez de auth de Supabase,
-- así que abrimos lectura/escritura con la clave anónima. No pongas datos sensibles reales aquí.
alter table app_state enable row level security;
create policy "anon full access" on app_state for all using (true) with check (true);

-- Limpieza opcional: la app ya NO usa la funcionalidad de "momentos" (fotos/galería).
-- Si quieres borrar esas tablas y el bucket de fotos que quedaron de esa etapa, corre esto
-- desde el SQL Editor de Supabase (borra los datos que hubiera ahí, no se puede deshacer):
--
-- drop table if exists moments;
-- delete from storage.objects where bucket_id = 'photos';
-- delete from storage.buckets where id = 'photos';
