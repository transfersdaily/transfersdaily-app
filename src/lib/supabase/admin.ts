import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Create a Supabase client with the service role key for admin API routes.
 * This bypasses RLS and has full read/write access.
 * Only use in server-side API routes behind auth validation.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY. Add it to Vercel environment variables.'
    )
  }

  return createSupabaseClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
