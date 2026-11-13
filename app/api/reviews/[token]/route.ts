import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX = 5
const rateLimits = new Map<string, { count: number; resetAt: number }>()

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown'
  }

  return request.headers.get('x-real-ip') || 'unknown'
}

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const entry = rateLimits.get(key)

  if (!entry || entry.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true
  }

  entry.count += 1
  return false
}

function invalidResponse(status = 400) {
  return NextResponse.json({ error: 'Unable to submit this review.' }, { status })
}

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const ip = getClientIp(request)

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json().catch(() => null)

    if (!body || typeof body !== 'object') {
      return invalidResponse()
    }

    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ success: true })
    }

    const rating = Number(body.rating)
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return invalidResponse()
    }

    const content = typeof body.content === 'string' ? body.content.trim() : ''
    if (content.length < 10 || content.length > 1000) {
      return invalidResponse()
    }

    const displayName = typeof body.display_name === 'string' ? body.display_name.trim() : ''
    if (displayName.length < 1 || displayName.length > 60) {
      return invalidResponse()
    }

    const publishConsent = body.publish_consent === true

    const { data: review, error: reviewError } = await supabaseAdmin
      .from('reviews')
      .select('id, token_expires_at, submitted_at')
      .eq('token', params.token)
      .maybeSingle()

    if (reviewError) throw reviewError

    if (!review) {
      return invalidResponse()
    }

    if (review.submitted_at) {
      return invalidResponse(409)
    }

    const now = new Date()
    const nowIso = now.toISOString()

    if (!review.token_expires_at || new Date(review.token_expires_at).getTime() <= now.getTime()) {
      return invalidResponse()
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('reviews')
      .update({
        rating,
        content,
        display_name: displayName,
        publish_consent: publishConsent,
        submitted_at: nowIso,
      })
      .eq('id', review.id)
      .is('submitted_at', null)
      .gt('token_expires_at', nowIso)
      .select('id')
      .maybeSingle()

    if (updateError) throw updateError

    if (!updated) {
      return invalidResponse(409)
    }

    return NextResponse.json({ success: true })
  } catch {
    console.error('POST review submission error')
    return invalidResponse(500)
  }
}
