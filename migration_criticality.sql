-- Migration script to add criticality columns to existing reports table
-- Run this in Supabase SQL Editor if you already have a reports table with data

-- Add new columns for criticality tracking
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS initial_criticality TEXT DEFAULT 'BAJA',
ADD COLUMN IF NOT EXISTS criticality_weight FLOAT8 DEFAULT 0.3;

-- Update existing records with default criticality values
-- You can customize these values based on your existing data
UPDATE reports
SET
  initial_criticality = 'BAJA',
  criticality_weight = 0.3
WHERE initial_criticality IS NULL OR criticality_weight IS NULL;

-- Optional: Set some variation in existing data for testing
-- Remove or modify this section based on your needs
UPDATE reports
SET
  initial_criticality = 'MEDIA',
  criticality_weight = 0.6
WHERE id % 4 = 1;

UPDATE reports
SET
  initial_criticality = 'ALTA',
  criticality_weight = 0.9
WHERE id % 4 = 2;

UPDATE reports
SET
  initial_criticality = 'CRITICA',
  criticality_weight = 1.0
WHERE id % 4 = 3;

-- Verify the migration
SELECT
    id,
    created_at,
    initial_criticality,
    criticality_weight,
    description
FROM reports
ORDER BY created_at DESC
LIMIT 10;

-- Show updated table structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'reports'
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'Migration completed successfully! ✅' as migration_status;
