
-- Create a new storage bucket for company logos
insert into storage.buckets (id, name, public)
values ('company-logos', 'company-logos', true)
on conflict (id) do nothing;

-- Allow public access to the bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'company-logos' );

-- Allow authenticated and anon uploads (for demo purposes)
-- In production, you might want to restrict this to authenticated users
create policy "Allow Uploads"
  on storage.objects for insert
  with check ( bucket_id = 'company-logos' );

-- Allow updates
create policy "Allow Updates"
  on storage.objects for update
  with check ( bucket_id = 'company-logos' );
