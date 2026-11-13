// app/(public)/safaris/[id]/page.tsx
import { supabaseAdmin } from '@/lib/supabase/admin'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Users, Star, Clock, CheckCircle, ArrowLeft } from 'lucide-react'
import { getContactUrl, getWhatsAppEnquiryLink } from '@/lib/contact'
import { getApprovedReviewsForPackage } from '@/lib/reviews/reviews'

export const revalidate = 60

// Helper function to get package by ID
async function getPackageById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('packages')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function SafariDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const safari = await getPackageById(id)

  if (!safari) {
    notFound()
  }

  const reviews = await getApprovedReviewsForPackage(safari.id)

  return (
    <div className="min-h-screen bg-[#FAF2EB] text-[#2A1810] pb-24">
      {/* Hero Section - Mobile First Height & Typography */}
      <div className="relative h-[45vh] sm:h-[50vh] md:h-[55vh] overflow-hidden">
        <Image
          src={safari.main_image || '/images/placeholder.png'}
          alt={safari.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Pembe Dusk Scrim Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1109]/90 via-[#1F1109]/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-[#FAF2EB]">
          <div className="max-w-[1240px] mx-auto">
            <div className="max-w-3xl">
              {safari.badge && (
                <span className="inline-block bg-[#C97A2B] text-[#FAF2EB] px-3 py-1 rounded-full text-xs sm:text-sm font-semibold mb-3 tracking-wide shadow-md">
                  {safari.badge}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-3 leading-[1.1]">
                {safari.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-[#FAF2EB]/90">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#E5A663]" />
                  <span>{safari.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#E5A663]" />
                  <span>{safari.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#E5A663]" />
                  <span>{safari.group_size}</span>
                </div>
                {safari.rating > 0 && (
                  <div className="flex items-center gap-1.5 bg-[#FAF2EB]/20 backdrop-blur-md px-3 py-1 rounded-full text-[#FAF2EB]">
                    <Star className="w-3.5 h-3.5 text-[#E5A663] fill-current" />
                    <span>{safari.rating}</span>
                    <span className="text-[#FAF2EB]/70">({safari.reviews_count} reviews)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        {/* Back Button */}
        <Link
          href="/safaris"
          className="inline-flex items-center gap-2 text-[#2A1810]/70 hover:text-[#C97A2B] transition-colors mb-6 sm:mb-8 text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Safaris
        </Link>

        {/* Mobile-first grid stack: Sidebar moves down or up depending on screen */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          
          {/* Main Content (Spans 2 cols on desktop) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Overview Description */}
            <div className="bg-white rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 shadow-[0_10px_30px_rgba(42,24,16,0.06)]">
              <h2 className="text-2xl font-serif font-bold mb-4 text-[#2A1810]">Overview</h2>
              <p className="text-[#2A1810]/75 text-sm sm:text-base leading-relaxed">{safari.description}</p>
            </div>

            {/* Itinerary */}
            {safari.itinerary && safari.itinerary.length > 0 && (
              <div className="bg-white rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 shadow-[0_10px_30px_rgba(42,24,16,0.06)]">
                <h2 className="text-2xl font-serif font-bold mb-6 text-[#2A1810]">Itinerary</h2>
                <div className="space-y-4">
                  {safari.itinerary.map((day: any, index: number) => (
                    <div key={index} className="bg-[#FAF2EB]/60 rounded-2xl p-4 sm:p-5 border border-[#2A1810]/5">
                      <h3 className="font-serif font-bold text-[#2A1810] text-base sm:text-lg mb-1">
                        Day {day.day}: {day.title}
                      </h3>
                      <p className="text-[#2A1810]/75 text-xs sm:text-sm leading-relaxed">{day.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {safari.includes && safari.includes.length > 0 && (
                <div className="bg-white rounded-[24px] p-6 shadow-[0_10px_30px_rgba(42,24,16,0.06)]">
                  <h3 className="font-serif font-bold text-[#2A1810] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Included
                  </h3>
                  <ul className="space-y-3">
                    {safari.includes.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#2A1810]/75">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {safari.excludes && safari.excludes.length > 0 && (
                <div className="bg-white rounded-[24px] p-6 shadow-[0_10px_30px_rgba(42,24,16,0.06)]">
                  <h3 className="font-serif font-bold text-[#2A1810] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-600"></span> Excluded
                  </h3>
                  <ul className="space-y-3">
                    {safari.excludes.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#2A1810]/75">
                        <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">✕</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Gallery */}
            {safari.images && safari.images.length > 0 && (
              <div className="bg-white rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 shadow-[0_10px_30px_rgba(42,24,16,0.06)]">
                <h2 className="text-2xl font-serif font-bold mb-6 text-[#2A1810]">Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {safari.images.map((image: string, index: number) => (
                    <div key={index} className="aspect-square relative rounded-2xl overflow-hidden shadow-md group">
                      <Image
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Traveler Reviews */}
            {reviews.length > 0 && (
              <div className="bg-white rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 shadow-[0_10px_30px_rgba(42,24,16,0.06)]">
                <h2 className="text-2xl font-serif font-bold mb-6 text-[#2A1810]">Traveler Reviews</h2>
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <div
                      key={`${review.created_at}-${index}`}
                      className="rounded-2xl border border-[#2A1810]/10 bg-[#FAF2EB]/40 p-4 sm:p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <p className="font-semibold text-[#2A1810]">
                          {review.display_name || 'Safari guest'}
                        </p>
                        <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${i < review.rating ? 'text-[#C97A2B] fill-current' : 'text-gray-200'}`}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-[#2A1810]/75 text-sm leading-relaxed">{review.content}</p>
                      <p className="text-[#2A1810]/45 text-xs mt-2">
                        {new Date(review.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[28px] sm:rounded-[32px] shadow-[0_18px_40px_rgba(42,24,16,0.1)] p-6 sm:p-8 sticky top-28 border border-[#2A1810]/5">
              <div className="text-center mb-6 pb-6 border-b border-[#2A1810]/10">
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#C97A2B]">
                  Tailored quote
                </div>
                <div className="text-xs sm:text-sm text-[#2A1810]/60 mt-1">Pricing is arranged personally for your trip</div>
              </div>

              <div className="space-y-3.5 mb-6 text-sm">
                <div className="flex justify-between py-2 border-b border-[#2A1810]/5">
                  <span className="text-[#2A1810]/65">Duration</span>
                  <span className="font-semibold text-[#2A1810]">{safari.duration}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#2A1810]/5">
                  <span className="text-[#2A1810]/65">Group Size</span>
                  <span className="font-semibold text-[#2A1810]">{safari.group_size}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#2A1810]/5">
                  <span className="text-[#2A1810]/65">Location</span>
                  <span className="font-semibold text-[#2A1810] line-clamp-1">{safari.location}</span>
                </div>
                {safari.rating > 0 && (
                  <div className="flex justify-between py-2 border-b border-[#2A1810]/5">
                    <span className="text-[#2A1810]/65">Rating</span>
                    <span className="font-semibold text-[#2A1810] flex items-center gap-1">
                      {safari.rating} <Star className="w-3.5 h-3.5 text-[#C97A2B] fill-current" />
                    </span>
                  </div>
                )}
              </div>

              <a
                href={getWhatsAppEnquiryLink(safari.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-[#C97A2B] text-[#FAF2EB] text-center py-3.5 sm:py-4 rounded-2xl font-semibold hover:bg-[#b06521] transition-all duration-300 mb-3 shadow-md text-sm sm:text-base tracking-wide active:scale-95"
              >
                Enquire on WhatsApp
              </a>

              <Link
                href={getContactUrl(safari.slug || safari.id)}
                className="block w-full border-2 border-[#2A1810]/20 text-[#2A1810] text-center py-3.5 sm:py-4 rounded-2xl font-semibold hover:bg-[#FAF2EB] transition-colors text-sm sm:text-base active:scale-95"
              >
                Send a message
              </Link>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}