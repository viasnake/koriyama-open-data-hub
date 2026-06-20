alter table rss_feeds add column title text;
alter table rss_feeds add column path text not null default '';
alter table rss_feeds add column kind text not null default 'unknown';
alter table rss_feeds add column source text not null default 'seed';
alter table rss_feeds add column verified_at text;
alter table rss_feeds add column verification_status text not null default 'unchecked';
alter table rss_feeds add column http_status integer;
alter table rss_feeds add column last_error text;
alter table rss_feeds add column first_seen_at text;
alter table rss_feeds add column last_seen_at text;
alter table rss_feeds add column discovered_from_url text;

update rss_feeds
set
  title = coalesce(title, name),
  path = case
    when path = '' and url like 'https://www.city.koriyama.lg.jp/%' then replace(url, 'https://www.city.koriyama.lg.jp', '')
    else path
  end,
  kind = case
    when id like 'list%' then 'global'
    when id like 'life%' then 'life'
    when id like 'site-%' then 'site'
    when id like 'soshiki-%' then 'organization'
    else kind
  end,
  first_seen_at = coalesce(first_seen_at, created_at),
  last_seen_at = coalesce(last_seen_at, updated_at);

alter table rss_entries add column canonical_url text;

create table if not exists rss_entry_feeds (
  entry_id text not null,
  feed_id text not null,
  first_seen_at text not null,
  last_seen_at text not null,
  primary key(entry_id, feed_id),
  foreign key(entry_id) references rss_entries(id),
  foreign key(feed_id) references rss_feeds(id)
);

insert or ignore into rss_entry_feeds (
  entry_id,
  feed_id,
  first_seen_at,
  last_seen_at
)
select
  id,
  feed_id,
  fetched_at,
  fetched_at
from rss_entries
where feed_id is not null;

create table if not exists rss_audits (
  id integer primary key autoincrement,
  generated_at text not null,
  seed_count integer not null,
  discovered_count integer not null,
  verified_ok_count integer not null,
  dead_count integer not null,
  parse_error_count integer not null,
  report_json text not null
);

create index if not exists idx_rss_feeds_kind_status on rss_feeds(kind, enabled, verification_status);
create unique index if not exists idx_rss_entries_source_hash_unique on rss_entries(source_hash);
create unique index if not exists idx_rss_entries_canonical_url_unique on rss_entries(canonical_url) where canonical_url is not null;
create index if not exists idx_rss_entry_feeds_feed_id on rss_entry_feeds(feed_id);
create index if not exists idx_rss_audits_generated_at on rss_audits(generated_at);
