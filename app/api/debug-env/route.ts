import { NextResponse } from 'next/server'

export async function GET() {
  // Log all environment variables (without exposing full values in production)
  const supabaseKeys = Object.keys(process.env).filter(key => key.includes('SUPABASE'))
  const supabaseValues: Record<string, string> = {}
  
  supabaseKeys.forEach(key => {
    // Only show first 20 chars for debugging
    const value = process.env[key] || ''
    supabaseValues[key] = value.substring(0, 20) + (value.length > 20 ? '...' : '')
  })
  
  return NextResponse.json({
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasPublicUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKeys: supabaseKeys,
    supabaseValues: supabaseValues,
    allEnvKeys: Object.keys(process.env).slice(0, 20) // First 20 keys
  })
}