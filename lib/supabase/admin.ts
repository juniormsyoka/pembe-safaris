import { createClient } from '@supabase/supabase-js'

// Use the correct variable names from your .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// Your variable has NEXT_PUBLIC_ prefix
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

// Debug logging
console.log('=== Debugging Environment Variables ===')
console.log('Has NEXT_PUBLIC_SUPABASE_URL?', !!supabaseUrl)
console.log('Has NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY?', !!supabaseServiceKey)
console.log('All SUPABASE env vars:', Object.keys(process.env).filter(key => key.includes('SUPABASE')))

// Better error handling with more details
if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is missing from environment variables')
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
}

if (!supabaseServiceKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY is missing from environment variables')
  console.error('Available SUPABASE vars:', Object.keys(process.env).filter(key => key.includes('SUPABASE')))
  
  // Provide a helpful error message
  throw new Error(`
    ═══════════════════════════════════════════════════════════════
    NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY is required for admin operations.
    
    Your .env.local file has it as:
    NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
    
    Please make sure this variable is set correctly.
    ═══════════════════════════════════════════════════════════════
  `)
}

console.log('✅ Supabase admin client initialized successfully')

// Create admin client with service role (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// For testing purposes, export a function to check if admin client is ready
export function isAdminClientReady() {
  return !!supabaseUrl && !!supabaseServiceKey
}