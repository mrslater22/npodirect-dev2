import { createClient } from '@supabase/supabase-js';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

if (!process.env.SUPABASE_KEY) {
  throw new Error('SUPABASE_KEY is not set');
}

export const supabase = createClient(
  process.env.DATABASE_URL,
  process.env.SUPABASE_KEY,
  {
    auth: {
      persistSession: false,
    },
  }
);