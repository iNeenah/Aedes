-- Setup script for Vigilantes del Aedes Supabase Database
-- Execute this script in your Supabase SQL Editor

-- 1. Create the reports table
CREATE TABLE IF NOT EXISTS reports (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    description TEXT,
    photo_url TEXT NOT NULL,
    latitude FLOAT8 NOT NULL,
    longitude FLOAT8 NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for public access (for MVP purposes)
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read" ON reports;
DROP POLICY IF EXISTS "Allow public insert" ON reports;

-- Policy for SELECT (read access)
CREATE POLICY "Allow public read" ON reports
FOR SELECT USING (true);

-- Policy for INSERT (write access)
CREATE POLICY "Allow public insert" ON reports
FOR INSERT WITH CHECK (true);

-- 4. Create storage bucket for images (this needs to be done via UI or API)
-- Go to Storage > Create Bucket > Name: "reports" > Public: true

-- 5. Insert sample data for testing
INSERT INTO reports (description, photo_url, latitude, longitude) VALUES
('Recipiente con agua estancada en patio trasero', 'https://via.placeholder.com/400x300/14b8a6/ffffff?text=Criadero+1', -27.3671, -55.8961),
('Maceta abandonada con agua de lluvia acumulada', 'https://via.placeholder.com/400x300/f97316/ffffff?text=Criadero+2', -27.368, -55.897),
('Neumático viejo con acumulación de agua', 'https://via.placeholder.com/400x300/dc2626/ffffff?text=Criadero+3', -27.366, -55.895),
('Balde plástico en jardín con agua estancada', 'https://via.placeholder.com/400x300/059669/ffffff?text=Criadero+4', -27.3580, -55.9020),
('Canaleta obstruida con agua acumulada', 'https://via.placeholder.com/400x300/7c3aed/ffffff?text=Criadero+5', -27.3750, -55.8700)
ON CONFLICT DO NOTHING;

-- 6. Enable realtime for reports table
ALTER PUBLICATION supabase_realtime ADD TABLE reports;

-- 7. Verify setup - This query should return the sample data
SELECT
    id,
    created_at,
    description,
    latitude,
    longitude,
    CASE
        WHEN photo_url LIKE 'https://via.placeholder.com%' THEN 'Sample Data'
        ELSE 'Real Data'
    END as data_type
FROM reports
ORDER BY created_at DESC;

-- 8. Show table structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'reports'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Success message
SELECT 'Supabase setup completed successfully! ✅' as setup_status;

-- IMPORTANT MANUAL STEPS:
-- After running this SQL, you MUST manually create the storage bucket:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Click "Create Bucket"
-- 3. Name: "reports"
-- 4. Make it PUBLIC
-- 5. Create the bucket
