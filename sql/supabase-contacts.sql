-- 문의하기 테이블 생성
-- 사용자 문의 및 관리자 답변 관리

-- contacts 테이블 생성
create table public.contacts (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  
  -- 문의 내용
  message text not null,
  
  -- 상태 관리
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'resolved', 'closed')),
  
  -- 관리자 답변
  admin_reply text,
  admin_id uuid references auth.users(id),
  
  -- 타임스탬프
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz,
  
  primary key (id)
);

-- Row Level Security 활성화
alter table public.contacts enable row level security;

-- RLS 정책: 사용자는 자신의 문의만 조회할 수 있음
create policy "Users can view their own contacts"
  on public.contacts
  for select
  using (auth.uid() = user_id);

-- RLS 정책: 사용자는 문의를 생성할 수 있음
create policy "Users can insert their own contacts"
  on public.contacts
  for insert
  with check (auth.uid() = user_id);

-- RLS 정책: 관리자는 모든 문의를 조회할 수 있음
create policy "Admins can view all contacts"
  on public.contacts
  for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- RLS 정책: 관리자는 모든 문의를 수정할 수 있음 (답변 작성)
create policy "Admins can update all contacts"
  on public.contacts
  for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 인덱스 생성 (성능 최적화)
create index contacts_user_id_idx on public.contacts(user_id);
create index contacts_status_idx on public.contacts(status);
create index contacts_created_at_idx on public.contacts(created_at desc);
