import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabaseAdmin: SupabaseClient | null = null

// Lazy-init server-side Supabase client — avoids crashing at module load
// when SUPABASE_SERVICE_ROLE_KEY is not set (e.g. during build or on pages that don't need it)
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_supabaseAdmin) {
      const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error(
          'Supabase admin client requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables'
        )
      }

      _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    }
    return (_supabaseAdmin as any)[prop]
  },
})
