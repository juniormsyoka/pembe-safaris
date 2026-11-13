'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function createPackage(formData: FormData) {
  console.log('=== createPackage started ===')
  
  try {
    const title = formData.get('title') as string
    const location = formData.get('location') as string
    const duration = formData.get('duration') as string
    const group_size = formData.get('group_size') as string
    const description = formData.get('description') as string
    const main_image = formData.get('main_image') as string
    const badge = formData.get('badge') as string
    const featured = formData.get('featured') === 'true'

    // Generate base slug from title
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    
    // Check if slug exists and add suffix if needed
    let finalSlug = slug
    let counter = 1
    
    while (true) {
      const { data: existing } = await supabaseAdmin
        .from('packages')
        .select('slug')
        .eq('slug', finalSlug)
        .single()
      
      if (!existing) break
      finalSlug = `${slug}-${counter}`
      counter++
    }

    const { data, error } = await supabaseAdmin
      .from('packages')
      .insert({
        title,
        slug: finalSlug,
        location,
        duration,
        group_size,
        description,
        main_image,
        badge: badge || null,
        featured,
        rating: 0,
        reviews_count: 0,
        active: true
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/')        
    revalidatePath('/admin/packages')
    revalidatePath('/packages')
    
    // Return success data instead of redirect
    return { success: true, data, slug: finalSlug }
    
  } catch (error) {
    console.error('Detailed error in createPackage:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}