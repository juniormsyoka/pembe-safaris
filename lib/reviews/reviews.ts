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

export async function getApprovedReviews(limit?: number): Promise<PublicReview[]> {
  let query = supabaseAdmin
    .from('reviews')
    .select(PUBLIC_REVIEW_FIELDS)
    .eq('status', 'approved')
    .eq('publish_consent', true)
    .order('created_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Failed to load approved reviews:', error.message)
    return []
  }

  return (data ?? []) as PublicReview[]
}

export async function getApprovedReviewsForPackage(
  packageId: string,
  limit = 20
): Promise<PublicReview[]> {
  if (!packageId) return []

  const { data, error } = await supabaseAdmin
    .from('reviews')
    .select(PUBLIC_REVIEW_FIELDS)
    .eq('status', 'approved')
    .eq('publish_consent', true)
    .eq('package_id', packageId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Failed to load package reviews:', error.message)
    return []
  }

  return (data ?? []) as PublicReview[]
}

export async function recomputePackageRating(packageId: string | null | undefined) {
  if (!packageId) return

  const { data, error } = await supabaseAdmin
    .from('reviews')
    .select('rating')
    .eq('package_id', packageId)
    .eq('status', 'approved')

  if (error) throw error

  const ratings = (data ?? [])
    .map((review) => Number(review.rating))
    .filter((rating) => Number.isFinite(rating))

  const reviewsCount = ratings.length
  const average = reviewsCount
    ? Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / reviewsCount) * 10) / 10
    : 0

  const { error: updateError } = await supabaseAdmin
    .from('packages')
    .update({ rating: average, reviews_count: reviewsCount })
    .eq('id', packageId)

  if (updateError) throw updateError
}
