// components/FeaturedSafaris.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Clock, Users, MapPin, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, A11y } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'

interface SafariPackage {
  id: string
  title: string
  location: string
  //duration: string
  group_size: string
  //price: number
  rating: number
  reviews_count: number
  main_image: string
  badge: string
  slug: string
}

export default function FeaturedSafaris({ packages }: { packages: SafariPackage[] }) {
  // Empty state — kept theme-consistent
  if (!packages || packages.length === 0) {
    return (
      <section
        className="py-10 sm:py-14 md:py-16 lg:py-24 bg-[#FAF2EB] text-[#2A1810]"
        id="featured-safaris"
      >
  
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 text-center">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#C97A2B]">
            Choose Your Adventure
          </p>
          <h2 className="mt-2 font-serif text-[clamp(1.75rem,5vw,2.75rem)] font-bold">
            Featured <em className="font-normal text-[#C97A2B]">Safari Packages</em>
          </h2>
          <p className="mt-4 text-[#2A1810]/60 text-sm sm:text-base">
            No safari packages available at the moment. Check back soon.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      className="py-10 sm:py-14 md:py-16 lg:py-24 bg-[#FAF2EB] text-[#2A1810]"
      id="featured-safaris"
    >
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        {/* Section Header — mirrors Destinations editorial style */}
        <div className="text-center mb-8 sm:mb-10 md:mb-14">
          <span className="text-[#C97A2B] font-semibold tracking-[0.15em] uppercase text-[0.7rem] sm:text-xs">
            Choose Your Adventure
          </span>
          <h2 className="mt-3 mb-3 font-serif text-[clamp(1.75rem,5.5vw,2.75rem)] font-bold leading-[1.1] tracking-tight">
            Featured <em className="font-normal text-[#C97A2B]">Safari Packages</em>
          </h2>
          <p className="text-sm sm:text-base text-[#2A1810]/70 max-w-2xl mx-auto">
            Handcrafted itineraries that showcase the best of Kenya&rsquo;s wildlife and
            landscapes.
          </p>
        </div>

        {/* Carousel wrapper */}
        <div
          className="relative md:px-8 lg:px-12"
          role="region"
          aria-label="Featured safari packages carousel"
        >
          <Swiper
            modules={[Navigation, Autoplay, A11y]}
            spaceBetween={16}
            slidesPerView={1.1}
            loop={packages.length > 3}
            navigation={{
              nextEl: '.safari-swiper-next',
              prevEl: '.safari-swiper-prev',
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            a11y={{ enabled: true }}
            breakpoints={{
              480: { slidesPerView: 1.25, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="featured-safari-swiper !pb-2"
          >
            {packages.map((safari) => (
              <SwiperSlide key={safari.id} className="!h-auto">
                <article className="h-full flex flex-col bg-white rounded-[22px] sm:rounded-[26px] overflow-hidden shadow-[0_10px_28px_rgba(42,24,16,0.10)] hover:shadow-[0_18px_40px_rgba(42,24,16,0.18)] transition-shadow duration-300 group">
                  {/* Image */}
                  <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-[#E5A663]">
                    <Image
                      src={safari.main_image || '/images/safaris/placeholder.jpg'}
                      alt={safari.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 25vw"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/images/safaris/placeholder.jpg'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(42,24,16,0.55)] via-transparent to-transparent" />

                    {/* Badge — matches card accent */}
                    {safari.badge && (
                      <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#C97A2B] text-[#FAF2EB] px-2.5 py-1 rounded-full text-[0.7rem] sm:text-xs font-semibold tracking-wide z-10">
                        {safari.badge}
                      </span>
                    )}

                    {/* Rating pill — cream glass */}
                    {safari.rating > 0 && (
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[rgba(250,242,235,0.94)] backdrop-blur-sm px-2.5 py-1 rounded-full text-[0.7rem] sm:text-xs font-semibold flex items-center gap-1 z-10 text-[#2A1810]">
                        <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C97A2B] fill-current" />
                        <span>{safari.rating}</span>
                        <span className="text-[#2A1810]/50 hidden sm:inline">
                          ({safari.reviews_count})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-grow p-4 sm:p-5">
                    <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug mb-2 group-hover:text-[#C97A2B] transition-colors line-clamp-1">
                      {safari.title}
                    </h3>

                    <div className="space-y-1.5 mb-4 text-[#2A1810]/70 text-xs sm:text-sm">
                      <div className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#C97A2B] flex-shrink-0" />
                        <span className="line-clamp-1">{safari.location}</span>
                      </div>
                     {/* <div className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-[#C97A2B] flex-shrink-0" />
                        <span>{safari.duration}</span>
                      </div>*/}
                      <div className="flex items-center">
                        <Users className="w-3.5 h-3.5 mr-1.5 text-[#C97A2B] flex-shrink-0" />
                        <span>{safari.group_size}</span>
                      </div>
                    </div>

                    {/* Price row */}
                    <div className="flex items-end justify-between pt-3 border-t border-[#2A1810]/10 mt-auto">
                      <Link 
                          href="/contact?subject=Quotation%20Inquiry"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C97A2B]/10 hover:bg-[#C97A2B] text-[#C97A2B] hover:text-[#FAF2EB] transition-all duration-300 font-semibold text-xs sm:text-sm border border-[#C97A2B]/20 shadow-sm active:scale-95 group"
                        >
                          <span className="tracking-wide">Get Quotation</span>
                          <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
                        </Link>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Nav arrows — desktop/tablet only, cream glass aesthetic */}
          <button
            type="button"
            aria-label="Previous safari packages"
            className="safari-swiper-prev absolute left-0 md:left-2 lg:left-4 top-1/2 -translate-y-1/2 z-10 bg-[rgba(250,242,235,0.94)] hover:bg-[#2A1810] text-[#2A1810] hover:text-[#FAF2EB] p-2.5 md:p-3 rounded-full shadow-lg transition-all duration-300 hidden md:flex items-center justify-center active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C97A2B]"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            type="button"
            aria-label="Next safari packages"
            className="safari-swiper-next absolute right-0 md:right-2 lg:right-4 top-1/2 -translate-y-1/2 z-10 bg-[rgba(250,242,235,0.94)] hover:bg-[#2A1810] text-[#2A1810] hover:text-[#FAF2EB] p-2.5 md:p-3 rounded-full shadow-lg transition-all duration-300 hidden md:flex items-center justify-center active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C97A2B]"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* CTA — matches Destinations chip / button language */}
        <div className="text-center mt-8 sm:mt-10 lg:mt-12">
          <Link
            href="/safaris"
            className="inline-flex items-center justify-center bg-[#2A1810] text-[#FAF2EB] px-6 sm:px-8 py-3 rounded-full hover:bg-[#C97A2B] transition-colors active:scale-95 text-sm sm:text-base font-semibold tracking-wide focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C97A2B]"
          >
            View All Safaris
          </Link>
        </div>
      </div>

      {/* Swiper-scoped styles */}
      <style jsx global>{`
        .featured-safari-swiper {
          padding: 0.25rem 0.125rem;
        }

        /* Hide Swiper's default nav — we render custom ones */
        .featured-safari-swiper .swiper-button-prev,
        .featured-safari-swiper .swiper-button-next {
          display: none;
        }

        /* Ensure slides stretch to equal height */
        .featured-safari-swiper .swiper-slide {
          height: auto;
        }

        .safari-swiper-prev.swiper-button-disabled,
        .safari-swiper-next.swiper-button-disabled {
          opacity: 0.35;
          cursor: not-allowed;
          pointer-events: none;
        }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .featured-safari-swiper .swiper-wrapper {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  )
}