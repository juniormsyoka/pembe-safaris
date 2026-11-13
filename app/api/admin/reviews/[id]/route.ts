import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth/admin'
import { recomputePackageRating } from '@/lib/reviews/reviews'

const ALLOWED_STATUSES = ['pending', 'approved', 'rejected'] as const
type ReviewStatus = (typeof ALLOWED_STATUSES)[number]

function revalidateReviewPages(packageId: string | null) {
  revalidatePath('/')

  if (packageId) {
    revalidatePath(`/safaris/${packageId}`)
  } else {
    revalidatePath('/safaris/[id]', 'page')
  }
}

function isReviewStatus(value: unknown): value is ReviewStatus {
  return typeof value === 'string' && (ALLOWED_STATUSES as readonly string[]).includes(value)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const body = await request.json().catch(() => null)

    if (!isReviewStatus(body?.status)) {
      return NextResponse.json({ error: 'Invalid review status' }, { status: 400 })
    }

    const { data: review, error: reviewError } = await supabaseAdmin
      .from('reviews')
      .select('id, package_id, publish_consent, submitted_at')
      .eq('id', params.id)
      .maybeSingle()

    if (reviewError) throw reviewError

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    if (body.status === 'approved' && (!review.publish_consent || !review.submitted_at)) {
      return NextResponse.json(
        { error: 'Reviews can only be approved after submission with publish consent' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .update({ status: body.status })
      .eq('id', review.id)
      .select()
      .single()

    if (error) throw error

    await recomputePackageRating(review.package_id)
    revalidateReviewPages(review.package_id)

    return NextResponse.json(data)
  } catch {
    console.error('PATCH review error')
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const { data: review, error: reviewError } = await supabaseAdmin
      .from('reviews')
      .select('id, package_id')
      .eq('id', params.id)
      .maybeSingle()

    if (reviewError) throw reviewError

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    const { error } = await supabaseAdmin.from('reviews').delete().eq('id', review.id)

    if (error) throw error

    await recomputePackageRating(review.package_id)
    revalidateReviewPages(review.package_id)

    return NextResponse.json({ success: true })
  } catch {
    console.error('DELETE review error')
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}
