-- =============================================
-- 利用者の声 (Kuchikomi Voice) - Supabase Schema
-- =============================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- =============================================
-- 1. businesses テーブル
-- =============================================
create table businesses (
  id uuid primary key default uuid_generate_v4(),
  service_name text not null,
  description text not null default '',
  what_you_do text not null default '',
  category text not null default '',
  logo_url text,
  face_url text,
  owner_name text,
  is_public_gallery boolean not null default false,
  admin_token uuid not null default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- admin_token でのルックアップ用インデックス
create unique index idx_businesses_admin_token on businesses(admin_token);

-- =============================================
-- 2. survey_definitions テーブル
-- =============================================
create table survey_definitions (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references businesses(id) on delete cascade,
  version integer not null default 1,
  questions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index idx_survey_definitions_business on survey_definitions(business_id);

-- =============================================
-- 3. survey_responses テーブル
-- =============================================
create table survey_responses (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references businesses(id) on delete cascade,
  survey_definition_id uuid not null references survey_definitions(id) on delete cascade,
  answers jsonb not null default '[]'::jsonb,
  free_comment text,
  created_at timestamptz not null default now()
);

create index idx_survey_responses_business on survey_responses(business_id);
create index idx_survey_responses_survey on survey_responses(survey_definition_id);

-- =============================================
-- 4. generated_copies テーブル
-- =============================================
create table generated_copies (
  id uuid primary key default uuid_generate_v4(),
  survey_response_id uuid not null references survey_responses(id) on delete cascade,
  review_text text not null,
  status text not null default 'draft' check (status in ('draft', 'final')),
  created_at timestamptz not null default now()
);

create index idx_generated_copies_response on generated_copies(survey_response_id);

-- =============================================
-- 5. generated_images テーブル
-- =============================================
create table generated_images (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references businesses(id) on delete cascade,
  template_id text not null,
  generated_copy_id uuid not null references generated_copies(id) on delete cascade,
  image_url text not null default '',
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_generated_images_business on generated_images(business_id);
create index idx_generated_images_copy on generated_images(generated_copy_id);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

-- businesses: 誰でも読める、作成できる
alter table businesses enable row level security;

create policy "businesses_select" on businesses
  for select using (true);

create policy "businesses_insert" on businesses
  for insert with check (true);

create policy "businesses_update" on businesses
  for update using (true);

-- survey_definitions: 誰でも読める、作成できる
alter table survey_definitions enable row level security;

create policy "survey_definitions_select" on survey_definitions
  for select using (true);

create policy "survey_definitions_insert" on survey_definitions
  for insert with check (true);

-- survey_responses: 誰でも作成・読める
alter table survey_responses enable row level security;

create policy "survey_responses_select" on survey_responses
  for select using (true);

create policy "survey_responses_insert" on survey_responses
  for insert with check (true);

-- generated_copies: 誰でも作成・読める
alter table generated_copies enable row level security;

create policy "generated_copies_select" on generated_copies
  for select using (true);

create policy "generated_copies_insert" on generated_copies
  for insert with check (true);

-- generated_images: 誰でも作成・読める
alter table generated_images enable row level security;

create policy "generated_images_select" on generated_images
  for select using (true);

create policy "generated_images_insert" on generated_images
  for insert with check (true);

-- =============================================
-- Storage バケット
-- =============================================
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

-- uploads バケットのポリシー: 誰でもアップロード・読み取り可
create policy "uploads_select" on storage.objects
  for select using (bucket_id = 'uploads');

create policy "uploads_insert" on storage.objects
  for insert with check (bucket_id = 'uploads');

-- =============================================
-- updated_at 自動更新トリガー
-- =============================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger businesses_updated_at
  before update on businesses
  for each row execute function update_updated_at();
