// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a singleton instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Also export a function for server components
export const createClientInstance = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}