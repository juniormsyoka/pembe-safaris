import 'server-only'
import type { NextRequest } from 'next/server'

export function getReviewSiteUrl(request: NextRequest): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ||
    request.nextUrl.origin
  )
}

type ReviewRow = {
  token?: string | null
  submitted_at?: string | null
} & Record<string, unknown>

export function toAdminReview(row: ReviewRow, request: NextRequest) {
  const { token, ...review } = row
  const submittedAt =
    typeof review.submitted_at === 'string' ? review.submitted_at : null

  return {
    ...review,
    reviewLink:
      !submittedAt && token ? `${getReviewSiteUrl(request)}/review/${token}` : null,
  }
}
