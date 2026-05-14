// components/FeaturedSafaris.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, MapPin, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

interface SafariPackage {
  id: string;
  title: string;
  location: string;
  duration: string;
  group_size: string;
  price: number;
  rating: number;
  reviews_count: number;
  main_image: string;
  badge: string;
  slug: string;
}

export default function FeaturedSafaris({ packages }: { packages: SafariPackage[] }) {
  if (!packages || packages.length === 0) {
    return (
      <section className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-coral-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <p>No safari packages available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <span className="text-primary font-semibold tracking-wider uppercase text-xs md:text-sm">
            Choose Your Adventure
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-3 md:mb-4">
            Featured <span className="text-primary">Safari Packages</span>
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Handcrafted itineraries that showcase the best of Kenya's wildlife and landscapes
          </p>
        </div>

        {/* Swiper Carousel */}
        <div className="relative px-0 md:px-8 lg:px-12">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              480: {
                slidesPerView: 1.2,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            className="featured-swiper"
          >
            {packages.map((safari) => (
              <SwiperSlide key={safari.id}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                    <Image
                      src={safari.main_image || '/placeholder-image.jpg'}
                      alt={safari.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-image.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Badge */}
                    {safari.badge && (
                      <span className="absolute top-3 left-3 md:top-4 md:left-4 bg-primary text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-semibold z-10">
                        {safari.badge}
                      </span>
                    )}

                    {/* Rating */}
                    {safari.rating > 0 && (
                      <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-white/90 backdrop-blur-sm px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-semibold flex items-center space-x-1 z-10">
                        <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-current" />
                        <span>{safari.rating}</span>
                        <span className="text-gray-500 hidden sm:inline">({safari.reviews_count})</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-5 lg:p-6 flex flex-col flex-grow">
                    <h3 className="font-serif text-lg md:text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                      {safari.title}
                    </h3>
                    
                    <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4">
                      <div className="flex items-center text-gray-600 text-xs md:text-sm">
                        <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2 text-primary flex-shrink-0" />
                        <span className="line-clamp-1">{safari.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-xs md:text-sm">
                        <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2 text-primary" />
                        {safari.duration}
                      </div>
                      <div className="flex items-center text-gray-600 text-xs md:text-sm">
                        <Users className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2 text-primary" />
                        {safari.group_size}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-gray-100 mt-auto">
                      <div>
                        <span className="text-lg md:text-xl lg:text-2xl font-bold text-primary">${safari.price}</span>
                        <span className="text-gray-500 text-xs md:text-sm">/ person</span>
                      </div>
                      <Link
                        href={`/safaris/${safari.id}`}
                        className="text-primary font-semibold hover:text-primary/80 transition-colors text-sm md:text-base active:scale-95"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons - Hidden on mobile, visible on tablet+ */}
          <button className="swiper-button-prev absolute left-0 md:left-2 lg:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-primary text-primary hover:text-white p-2 md:p-3 rounded-full shadow-lg transition-all duration-300 hidden md:block active:scale-95">
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button className="swiper-button-next absolute right-0 md:right-2 lg:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-primary text-primary hover:text-white p-2 md:p-3 rounded-full shadow-lg transition-all duration-300 hidden md:block active:scale-95">
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8 md:mt-10 lg:mt-12">
          <Link href="/safaris" className="inline-block bg-primary text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg hover:bg-primary/90 transition-colors active:scale-95 text-sm md:text-base">
            View All Safaris
          </Link>
        </div>
      </div>

      {/* Custom Swiper Styles */}
      <style jsx global>{`
        .featured-swiper {
          padding: 0.25rem 0.125rem;
        }
        
        .featured-swiper .swiper-button-prev,
        .featured-swiper .swiper-button-next {
          display: none;
        }
        
        @media (min-width: 768px) {
          .featured-swiper {
            padding: 0.5rem 0;
          }
        }
        
        .swiper-button-prev,
        .swiper-button-next {
          transition: all 0.3s ease;
        }
        
        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          background-color: #1e3c3f;
          color: white;
        }
        
        .swiper-button-prev.swiper-button-disabled,
        .swiper-button-next.swiper-button-disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
}