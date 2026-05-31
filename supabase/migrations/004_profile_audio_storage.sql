-- Bucket pour musique de profil (upload direct)

insert into storage.buckets (id, name, public)
values ('profile-media', 'profile-media', true)
on conflict (id) do nothing;

create policy "Profile media public read"
  on storage.objects for select
  using (bucket_id = 'profile-media');

create policy "Users upload own profile media"
  on storage.objects for insert
  with check (
    bucket_id = 'profile-media'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users update own profile media"
  on storage.objects for update
  using (
    bucket_id = 'profile-media'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users delete own profile media"
  on storage.objects for delete
  using (
    bucket_id = 'profile-media'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
