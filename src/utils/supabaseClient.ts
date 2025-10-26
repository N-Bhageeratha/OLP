import { createClient } from '@supabase/supabase-js';

// Vite exposes env vars prefixed with VITE_ via import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string || '';

// For local/demo usage, these may be empty; ensure callers handle that case.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
