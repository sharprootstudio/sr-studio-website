// ==============================================================================
// SR STUDIO — SUPABASE BROWSER CLIENT
// File: src/lib/supabaseClient.ts
// ==============================================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseAnonKey.includes('your-anon-key')
);

if (!isSupabaseConfigured) {
  console.info(
    '[SR Studio] Supabase client is unconfigured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment to enable live authentication and lead management.'
  );
}

// Fallback dummy client values prevent client-side initialization crash before env vars are populated
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'sr-studio-auth-token',
    },
  }
);

