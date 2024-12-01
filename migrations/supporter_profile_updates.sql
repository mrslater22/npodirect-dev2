-- Add new columns to supporter_profiles table
ALTER TABLE supporter_profiles
ADD COLUMN IF NOT EXISTS location JSONB,
ADD COLUMN IF NOT EXISTS age_group TEXT CHECK (age_group IN ('18-24', '25-34', '35-44', '45-54', '55-64', '65+')),
ADD COLUMN IF NOT EXISTS interests JSONB;