// app/reviews/page.tsx
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
    <main className="relative overflow-hidden py-20 md:py-28 bg-[#1F1109] text-[#FAF2EB] min-h-screen">
      {/* Background Architectural Grid & Subtle Dusk Glow */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#FAF2EB08_1px,transparent_1px),linear-gradient(to_bottom,#FAF2EB08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" 
        aria-hidden="true"
      />
      <div 
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#C97A2B]/15 blur-[140px] rounded-full pointer-events-none" 
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <header className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#C97A2B] font-semibold tracking-[0.2em] uppercase text-xs block mb-3">
            Testimonials
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Stories from our <em className="font-normal text-[#E5A663]">Travelers</em>
          </h1>
          {stats.count > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF2EB]/5 border border-[#FAF2EB]/10">
              <span className="text-[#E5A663] font-semibold">{stats.average} ★</span>
              <span className="text-[#FAF2EB]/60 text-sm">from {stats.count} {stats.count === 1 ? 'review' : 'reviews'}</span>
            </div>
          )}
        </header>

        {reviews.length === 0 ? (
          <div className="text-center py-24 bg-[#2E1B11]/50 rounded-[28px] border border-[#FAF2EB]/10 max-w-lg mx-auto">
            <p className="text-[#FAF2EB]/60">
              No reviews yet — check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {reviews.map((review, index) => {
              const guestName = review.display_name || 'Safari guest'
              const initials = guestName
                .split(' ')
                .filter(Boolean)
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)

              return (
                <article
                  key={`${review.package_id ?? 'review'}-${review.created_at}-${index}`}
                  className="group relative flex flex-col justify-between rounded-[24px] p-8 bg-gradient-to-b from-[#2E1B11]/90 to-[#180C06]/95 border border-[#FAF2EB]/10 hover:border-[#C97A2B]/50 transition-all duration-500 hover:-translate-y-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] hover:shadow-[0_20px_50px_rgba(201,122,43,0.16)] overflow-hidden"
                >
                  {/* Top Rim Light & Bottom Hover Glow */}
                  <div 
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E5A663]/40 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500" 
                    aria-hidden="true"
                  />
                  <div 
                    className="absolute -bottom-16 inset-x-4 h-32 bg-[#C97A2B]/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                    aria-hidden="true"
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Top Row: Initial Avatar + Star Rating */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C97A2B] to-[#8C4F16] p-[2px] shadow-md">
                        <div className="w-full h-full rounded-full bg-[#24140C] flex items-center justify-center">
                          <span className="font-serif font-bold text-sm tracking-wider text-[#E5A663]">
                            {initials}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-1 bg-[#FAF2EB]/5 px-3 py-1.5 rounded-full border border-[#FAF2EB]/5" aria-label={`${review.rating} out of 5 stars`}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating ? 'text-[#E5A663] fill-current' : 'text-[#FAF2EB]/20'
                            }`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Content */}
                    <p className="text-sm sm:text-[15px] text-[#FAF2EB]/75 italic mb-6 leading-relaxed flex-1">
                      &ldquo;{review.content}&rdquo;
                    </p>

                    {/* Guest Details */}
                    <div>
                      <h3 className="font-serif font-bold text-[#FAF2EB] group-hover:text-[#E5A663] transition-colors">
                        {guestName}
                      </h3>
                      <p className="text-xs text-[#FAF2EB]/50 uppercase tracking-widest mt-0.5">
                        {new Date(review.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {total > 0 && (
          <nav
            className="flex items-center justify-center gap-4 mt-14 flex-wrap"
            aria-label="Review pagination"
          >
            {page > 1 ? (
              <Link
                href={`/reviews?page=${page - 1}`}
                className="px-6 py-2.5 rounded-full border border-[#C97A2B] text-[#C97A2B] hover:bg-[#C97A2B] hover:text-[#FAF2EB] transition text-sm font-semibold shadow-sm"
              >
                Previous
              </Link>
            ) : (
              <span className="px-6 py-2.5 rounded-full border border-[#FAF2EB]/10 text-[#FAF2EB]/30 text-sm font-semibold cursor-not-allowed">
                Previous
              </span>
            )}

            <span className="px-4 py-2 text-sm text-[#FAF2EB]/60 font-medium">
              Page {page} of {totalPages}
            </span>

            {hasMore ? (
              <Link
                href={`/reviews?page=${page + 1}`}
                className="px-6 py-2.5 rounded-full bg-[#C97A2B] text-[#FAF2EB] hover:bg-[#b56a21] transition text-sm font-semibold shadow-[0_4px_15px_rgba(201,122,43,0.3)]"
              >
                Next
              </Link>
            ) : (
              <span className="px-6 py-2.5 rounded-full bg-[#FAF2EB]/10 text-[#FAF2EB]/30 text-sm font-semibold cursor-not-allowed">
                Next
              </span>
            )}
          </nav>
        )}

        {/* Return Home Link */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#E5A663] hover:text-[#C97A2B] transition-colors font-medium"
          >
            <span>←</span> Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}