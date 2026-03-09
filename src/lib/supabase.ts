import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// createBrowserClient gère automatiquement les cookies et les sessions sur Next.js !
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
