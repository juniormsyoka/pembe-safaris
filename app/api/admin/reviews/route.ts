import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'node:crypto'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth/admin'
import { toAdminReview } from '@/lib/reviews/admin'

const REVIEW_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000
const MAX_CUSTOMER_NAME_LENGTH = 80

function isValidEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .select('*')
      .order('submitted_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json((data || []).map((review) => toAdminReview(review, request)))
  } catch (error) {
    console.error('GET reviews error', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Wrap the auth check so a throwing requireAdmin can't escape as a bare 500.
  let unauthorized: NextResponse | null = null
  try {
    unauthorized = await requireAdmin()
  } catch (error) {
    console.error('requireAdmin threw during POST review request', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (unauthorized) return unauthorized

  try {
    const body = await request.json().catch(() => null)

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const payload = body as Record<string, unknown>

    if (typeof payload.customer_name !== 'string') {
      return NextResponse.json({ error: 'customer_name is required' }, { status: 400 })
    }

    const customerName = payload.customer_name.trim()

    if (!customerName || customerName.length > MAX_CUSTOMER_NAME_LENGTH) {
      return NextResponse.json(
        { error: `customer_name must be between 1 and ${MAX_CUSTOMER_NAME_LENGTH} characters` },
        { status: 400 }
      )
    }

    let customerPhone: string | null = null

    if (payload.customer_phone !== undefined && payload.customer_phone !== null) {
      if (typeof payload.customer_phone !== 'string') {
        return NextResponse.json({ error: 'customer_phone must be a string' }, { status: 400 })
      }

      const phone = payload.customer_phone.trim()

      if (phone) {
        if (!/^\+?\d{7,15}$/.test(phone)) {
          return NextResponse.json(
            { error: 'customer_phone must contain digits with an optional leading +' },
            { status: 400 }
          )
        }

        customerPhone = phone
      }
    }

    let customerEmail: string | null = null

    if (payload.customer_email !== undefined && payload.customer_email !== null) {
      if (typeof payload.customer_email !== 'string') {
        return NextResponse.json({ error: 'customer_email must be a string' }, { status: 400 })
      }

      const email = payload.customer_email.trim()

      if (email) {
        if (!isValidEmail(email)) {
          return NextResponse.json({ error: 'customer_email is invalid' }, { status: 400 })
        }

        customerEmail = email
      }
    }

    let tripDate: string | null = null

    if (payload.trip_date !== undefined && payload.trip_date !== null) {
      if (typeof payload.trip_date !== 'string') {
        return NextResponse.json({ error: 'trip_date must be a string' }, { status: 400 })
      }

      const date = payload.trip_date.trim()

      if (date) {
        if (!isValidDateOnly(date)) {
          return NextResponse.json({ error: 'trip_date is invalid' }, { status: 400 })
        }

        tripDate = date
      }
    }

    let packageId: string | null = null

    if (payload.package_id !== undefined && payload.package_id !== null) {
      if (typeof payload.package_id !== 'string') {
        return NextResponse.json({ error: 'package_id must be a string' }, { status: 400 })
      }

      const requestedPackageId = payload.package_id.trim()

      if (requestedPackageId) {
        const { data: packageRow, error: packageError } = await supabaseAdmin
          .from('packages')
          .select('id')
          .eq('id', requestedPackageId)
          .maybeSingle()

        if (packageError) throw packageError

        if (!packageRow) {
          return NextResponse.json({ error: 'Package not found' }, { status: 400 })
        }

        packageId = packageRow.id
      }
    }

    const token = randomBytes(32).toString('base64url')
    const tokenExpiresAt = new Date(Date.now() + REVIEW_TOKEN_TTL_MS).toISOString()

    const insertPayload = {
      booking_id: null,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      package_id: packageId,
      trip_date: tripDate,
      token,
      token_expires_at: tokenExpiresAt,
      status: 'pending',
    }

    // TEMP diagnostic — remove once the 500 is fixed.
    console.log('INSERT reviews payload:', insertPayload)

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert(insertPayload)
      .select('*')
      .single()

    if (error) {
      // TEMP diagnostic — remove once the 500 is fixed.
      console.error('Supabase insert error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      })
      throw error
    }

    return NextResponse.json(toAdminReview(data, request), { status: 201 })
  } catch (error) {
    console.error('POST review request error', error)
    return NextResponse.json({ error: 'Failed to create review request' }, { status: 500 })
  }
}