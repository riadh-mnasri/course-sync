create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  checked boolean not null default false,
  added_by text,
  created_at timestamptz not null default now(),
  checked_at timestamptz
);

create table if not exists item_history (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  purchased_at timestamptz not null default now()
);

alter publication supabase_realtime add table items;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on items to anon, authenticated;
grant select, insert on item_history to anon, authenticated;

create or replace view item_habits as
with intervals as (
  select
    lower(name) as name_key,
    name,
    purchased_at,
    extract(epoch from (
      purchased_at - lag(purchased_at) over (partition by lower(name) order by purchased_at)
    )) as gap_seconds
  from item_history
),
agg as (
  select
    name_key,
    min(name) as name,
    avg(gap_seconds) as avg_interval_seconds,
    max(purchased_at) as last_purchase,
    count(*) as purchase_count
  from intervals
  group by name_key
  having count(gap_seconds) >= 1
)
select
  name_key,
  name,
  avg_interval_seconds,
  last_purchase,
  purchase_count,
  extract(epoch from (now() - last_purchase)) as seconds_since_last_purchase
from agg;

grant select on item_habits to anon, authenticated;
