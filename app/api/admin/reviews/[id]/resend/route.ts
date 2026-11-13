import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'node:crypto'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth/admin'
import { toAdminReview } from '@/lib/reviews/admin'

const REVIEW_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const { data: review, error: reviewError } = await supabaseAdmin
      .from('reviews')
      .select('id, submitted_at')
      .eq('id', params.id)
      .maybeSingle()

    if (reviewError) throw reviewError

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    if (review.submitted_at) {
      return NextResponse.json(
        { error: 'This review has already been submitted' },
        { status: 409 }
      )
    }

    const token = randomBytes(32).toString('base64url')
    const tokenExpiresAt = new Date(Date.now() + REVIEW_TOKEN_TTL_MS).toISOString()

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .update({
        token,
        token_expires_at: tokenExpiresAt,
      })
      .eq('id', review.id)
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json(toAdminReview(data, request))
  } catch {
    console.error('Resend review request error')
    return NextResponse.json({ error: 'Failed to resend review request' }, { status: 500 })
  }
}
