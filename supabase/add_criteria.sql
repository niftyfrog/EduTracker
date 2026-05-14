-- task_edits に完了条件カラムを追加
alter table public.task_edits add column if not exists criteria text;
alter table public.task_edits add column if not exists criteria_image text;

-- 画像用のストレージバケットを作成
insert into storage.buckets (id, name, public)
values ('task-images', 'task-images', true)
on conflict (id) do nothing;

-- 誰でも閲覧可能
create policy "Public read task-images"
  on storage.objects for select
  using (bucket_id = 'task-images');

-- 認証済みユーザーがアップロード可能
create policy "Auth users can upload task-images"
  on storage.objects for insert
  with check (bucket_id = 'task-images' and auth.role() = 'authenticated');

-- 管理者が削除可能
create policy "Admin can delete task-images"
  on storage.objects for delete
  using (
    bucket_id = 'task-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
