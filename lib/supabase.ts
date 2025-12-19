import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;
let supabaseAdminClient: SupabaseClient | null = null;

function createSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

function createSupabaseAdminClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.'
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

// Lazy initialization - only creates clients when accessed (not at module load time)
// This prevents build-time errors when environment variables aren't available
export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    if (!supabaseClient) {
      supabaseClient = createSupabaseClient();
    }
    const value = supabaseClient[prop as keyof SupabaseClient];
    return typeof value === 'function' ? value.bind(supabaseClient) : value;
  },
});

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    if (!supabaseAdminClient) {
      supabaseAdminClient = createSupabaseAdminClient();
    }
    const value = supabaseAdminClient[prop as keyof SupabaseClient];
    return typeof value === 'function' ? value.bind(supabaseAdminClient) : value;
  },
});

