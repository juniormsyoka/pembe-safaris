import 'server-only'
import { supabaseAdmin } from '@/lib/supabase/admin'

const PUBLIC_REVIEW_FIELDS = 'display_name, rating, content, created_at, package_id'

export interface PublicReview {
  display_name: string | null
  rating: number
  content: string | null
  created_at: string
  package_id: string | null
}

export interface PublicReviewPage {
  reviews: PublicReview[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasMore: boolean
}

export async function getApprovedReviewsPage(
  page = 1,
  limit = 12
): Promise<PublicReviewPage> {
  const safePage = Math.max(1, Math.floor(page) || 1)
  const safeLimit = Math.min(50, Math.max(1, Math.floor(limit) || 12))
  const from = (safePage - 1) * safeLimit
  const to = from + safeLimit - 1

  const { data, count, error } = await supabaseAdmin
    .from('reviews')
    .select(PUBLIC_REVIEW_FIELDS, { count: 'exact' })
    .eq('status', 'approved')
    .eq('publish_consent', true)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Failed to load paginated reviews:', error.message)
    return {
      reviews: [],
      total: 0,
      page: safePage,
      limit: safeLimit,
      totalPages: 1,
      hasMore: false,
    }
  }

  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / safeLimit))

  return {
    reviews: (data ?? []) as PublicReview[],
    total,
    page: safePage,
    limit: safeLimit,
    totalPages,
    hasMore: safePage < totalPages,
  }
}

export async function getApprovedReviewStats(): Promise<{
  average: number
  count: number
}> {
  const { data, error } = await supabaseAdmin
    .from('reviews')
    .select('rating')
    .eq('status', 'approved')
    .eq('publish_consent', true)

  if (error) {
    console.error('Failed to load review stats:', error.message)
    return { average: 0, count: 0 }
  }

  const ratings = (data ?? [])
    .map((r) => Number(r.rating))
    .filter((n) => Number.isFinite(n))

  const count = ratings.length
  const average = count
    ? Math.round((ratings.reduce((s, n) => s + n, 0) / count) * 10) / 10
    : 0

  return { average, count }
}