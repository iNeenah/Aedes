-- Storage policies for reports bucket
-- Execute this AFTER creating the 'reports' bucket in Supabase Storage UI

-- Enable RLS for storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy to allow public uploads to reports bucket
CREATE POLICY "Allow public uploads to reports bucket" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'reports');

-- Policy to allow public downloads from reports bucket
CREATE POLICY "Allow public downloads from reports bucket" ON storage.objects
FOR SELECT USING (bucket_id = 'reports');

-- Policy to allow public updates to reports bucket (optional)
CREATE POLICY "Allow public updates to reports bucket" ON storage.objects
FOR UPDATE USING (bucket_id = 'reports');

-- Policy to allow public deletes from reports bucket (optional)
CREATE POLICY "Allow public deletes from reports bucket" ON storage.objects
FOR DELETE USING (bucket_id = 'reports');

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage';

-- Success message
SELECT 'Storage policies created successfully! ✅' as storage_status;

-- IMPORTANT: Make sure you have created the bucket first:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create bucket named 'reports'
-- 3. Make it PUBLIC
-- 4. Then run this SQL
