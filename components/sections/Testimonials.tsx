import { Star } from 'lucide-react'
import { getApprovedReviews } from '@/lib/reviews/reviews'

export default async function Testimonials() {
  const reviews = await getApprovedReviews(3)

  if (reviews.length === 0) return null

  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-[#1F1109] text-[#FAF2EB]">
      {/* Subtle Architectural Grid & Ambient Dusk Glow (Inspired by reference) */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#FAF2EB08_1px,transparent_1px),linear-gradient(to_bottom,#FAF2EB08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" 
        aria-hidden="true"
      />
      <div 
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[#C97A2B]/15 blur-[120px] rounded-full pointer-events-none" 
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Centered Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-16">
          <span className="text-[#C97A2B] font-semibold tracking-[0.2em] uppercase text-xs block mb-3">
            Testimonials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#FAF2EB] tracking-tight">
            Stories from our <em className="font-normal text-[#E5A663]">Travelers</em>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#FAF2EB]/65 leading-relaxed">
            Discover what our guests have to say about their unforgettable journeys across Kenya&apos;s wild landscapes.
          </p>
        </div>

        {/* 3-Column Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
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
              <div
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

                <div className="relative z-10">
                  {/* Top Row: Initial Avatar + Star Rating */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C97A2B] to-[#8C4F16] p-[2px] shadow-md">
                      <div className="w-full h-full rounded-full bg-[#24140C] flex items-center justify-center">
                        <span className="font-serif font-bold text-lg tracking-wider text-[#E5A663]">
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

                  {/* Guest Name & Date */}
                  <div className="mb-4">
                    <h3 className="font-serif font-bold text-lg text-[#FAF2EB] group-hover:text-[#E5A663] transition-colors">
                      {guestName}
                    </h3>
                    <p className="text-xs text-[#FAF2EB]/50 uppercase tracking-widest mt-0.5">
                      {new Date(review.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </p>
                  </div>

                  {/* Review Body */}
                  <p className="text-sm sm:text-[15px] text-[#FAF2EB]/75 leading-relaxed">
                    &ldquo;{review.content}&rdquo;
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 md:mt-14">
          <a
            href="/review"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#C97A2B] hover:bg-[#b56a21] text-[#FAF2EB] font-semibold text-sm tracking-wide transition-all duration-300 shadow-[0_8px_25px_rgba(201,122,43,0.3)] active:scale-95"
          >
            Read all reviews
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}