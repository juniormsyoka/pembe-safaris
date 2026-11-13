import { Star } from 'lucide-react'
import { getApprovedReviews } from '@/lib/reviews/reviews'

export default async function Testimonials() {
  const reviews = await getApprovedReviews(3)

  if (reviews.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-[#FAF2EB] text-[#2A1810]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-[#C97A2B] font-semibold tracking-[0.15em] uppercase text-xs">
            Testimonials
          </span>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl font-bold">
            Stories from our <em className="font-normal text-[#C97A2B]">Travelers</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={`${review.package_id ?? 'review'}-${review.created_at}-${index}`}
              className="bg-white p-8 rounded-[24px] shadow-[0_8px_30px_rgba(42,24,16,0.04)] border border-[#2A1810]/10"
            >
              <div className="flex gap-1 mb-4" aria-label={`${review.rating} out of 5 stars`}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? 'text-[#C97A2B] fill-current' : 'text-gray-200'}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="text-[#2A1810]/80 italic mb-6 leading-relaxed">{review.content}</p>
              <div>
                <p className="font-bold text-[#2A1810]">{review.display_name || 'Safari guest'}</p>
                <p className="text-xs text-[#2A1810]/50 uppercase tracking-wider mt-1">
                  {new Date(review.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
