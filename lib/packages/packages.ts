// lib/services/packages.ts
import { createClientInstance } from '@/lib/supabase/client'

export async function getFeaturedPackages(limit = 5) {
  const supabase = createClientInstance()
  
  const { data: packages, error } = await supabase
    .from('packages')
    .select('*')
    .eq('featured', true)
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching featured packages:', error)
    // Return empty array so the UI doesn't crash and shows the empty state
    return [] 
  }
  
  return packages || []
}

export async function getAllPackages() {
  const supabase = createClientInstance()
  const { data, error } = await supabase
    .from('packages')
    .select('id, title, slug') // Only select what we need for the dropdown
    .eq('active', true)
    .order('title', { ascending: true })
  
  if (error) {
    console.error('Error fetching all packages:', error)
    return []
  }
  return data || []
}