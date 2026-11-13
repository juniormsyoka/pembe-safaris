import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth/admin'

const EDITABLE_FIELDS = [
  'title',
  'slug',
  'location',
  'duration',
  'group_size',
  'description',
  'main_image',
  'badge',
  'featured',
  'active',
  'rating',
  'reviews_count',
] as const

type EditableField = (typeof EDITABLE_FIELDS)[number]

function pickEditableFields(body: Record<string, unknown>): Partial<Record<EditableField, unknown>> {
  const update: Partial<Record<EditableField, unknown>> = {}
  for (const field of EDITABLE_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      update[field] = body[field]
    }
  }
  return update
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const body = await request.json()
    const update = pickEditableFields(body)

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No editable fields provided' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('packages')
      .update({ ...update, updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('PATCH package error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update package' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const { error } = await supabaseAdmin.from('packages').delete().eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE package error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete package' },
      { status: 500 }
    )
  }
}
