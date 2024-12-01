-- Update nonprofit_profiles table with new columns
ALTER TABLE nonprofit_profiles
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS tax_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS contact_info JSONB,
ADD COLUMN IF NOT EXISTS address JSONB,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Create index for tax_id lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_nonprofit_profiles_tax_id ON nonprofit_profiles(tax_id);

-- Add constraint for tax_id format
ALTER TABLE nonprofit_profiles
ADD CONSTRAINT tax_id_format CHECK (tax_id ~ '^\d{2}-\d{7}$');