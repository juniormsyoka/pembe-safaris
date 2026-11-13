import type { Metadata } from 'next'
import Link from 'next/link'
import { Star } from 'lucide-react'
import {
  getApprovedReviewsPage,
  getApprovedReviewStats,
} from '@/lib/reviews/paginated'

export const metadata: Metadata = {
  title: 'Reviews — Pembe Africa Safaris',
  description:
    'Read real reviews from travelers who have explored Africa with Pembe Africa Safaris.',
}

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 12

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const requestedPage = Number(searchParams.page)
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1

  const [pageData, stats] = await Promise.all([
    getApprovedReviewsPage(page, PAGE_SIZE),
    getApprovedReviewStats(),
  ])

  const { reviews, total, totalPages, hasMore } = pageData

  return (
    <main className="py-16 md:py-24 bg-[#FAF2EB] text-[#2A1810]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <header className="text-center mb-12">
          <span className="text-[#C97A2B] font-semibold tracking-[0.15em] uppercase text-xs">
            Testimonials
          </span>
          <h1 className="mt-3 font-serif text-3xl md:text-5xl font-bold">
            Stories from our <em className="font-normal text-[#C97A2B]">Travelers</em>
          </h1>
          {stats.count > 0 && (
            <p className="mt-4 text-sm text-[#2A1810]/60">
              <span className="text-[#C97A2B] font-semibold">{stats.average} ★</span>{' '}
              from {stats.count} {stats.count === 1 ? 'review' : 'reviews'}
            </p>
          )}
        </header>

        {reviews.length === 0 ? (
          <p className="text-center text-[#2A1810]/60 py-16">
            No reviews yet — check back soon.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <article
                key={`${review.package_id ?? 'review'}-${review.created_at}-${index}`}
                className="bg-white p-8 rounded-[24px] shadow-[0_8px_30px_rgba(42,24,16,0.04)] border border-[#2A1810]/10 flex flex-col"
              >
                <div
                  className="flex gap-1 mb-4"
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'text-[#C97A2B] fill-current'
                          : 'text-gray-200'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="text-[#2A1810]/80 italic mb-6 leading-relaxed flex-1">
                  {review.content}
                </p>
                <div>
                  <p className="font-bold text-[#2A1810]">
                    {review.display_name || 'Safari guest'}
                  </p>
                  <p className="text-xs text-[#2A1810]/50 uppercase tracking-wider mt-1">
                    {new Date(review.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        {total > 0 && (
          <nav
            className="flex items-center justify-center gap-3 mt-12 flex-wrap"
            aria-label="Review pagination"
          >
            {page > 1 ? (
              <Link
                href={`/reviews?page=${page - 1}`}
                className="px-5 py-2 rounded-full border border-[#C97A2B] text-[#C97A2B] hover:bg-[#C97A2B] hover:text-white transition"
              >
                Previous
              </Link>
            ) : (
              <span className="px-5 py-2 rounded-full border border-[#2A1810]/10 text-[#2A1810]/30">
                Previous
              </span>
            )}

            <span className="px-4 py-2 text-sm text-[#2A1810]/60">
              Page {page} of {totalPages}
            </span>

            {hasMore ? (
              <Link
                href={`/reviews?page=${page + 1}`}
                className="px-5 py-2 rounded-full bg-[#C97A2B] text-white hover:bg-[#b06a24] transition"
              >
                Next
              </Link>
            ) : (
              <span className="px-5 py-2 rounded-full bg-[#2A1810]/10 text-[#2A1810]/30">
                Next
              </span>
            )}
          </nav>
        )}

        <div className="text-center mt-10">
          <Link
            href="/"
            className="text-sm text-[#C97A2B] hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}