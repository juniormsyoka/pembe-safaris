import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth/admin'

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    // Fetch packages from Supabase
    const { data, error } = await supabaseAdmin
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('GET Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const body = await request.json()
    
    // Generate slug if not provided
    if (!body.slug && body.title) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }
    
    // Insert into Supabase
    const { data, error } = await supabaseAdmin
      .from('packages')
      .insert([{
        title: body.title,
        slug: body.slug,
        location: body.location,
        duration: body.duration,
        group_size: body.group_size,
        description: body.description,
        main_image: body.main_image,
        badge: body.badge || null,
        featured: body.featured || false,
        active: body.active !== undefined ? body.active : true,
        rating: body.rating || 0,
        reviews_count: body.reviews_count || 0,
      }])
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('POST Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create package' },
      { status: 500 }
    )
  }
}