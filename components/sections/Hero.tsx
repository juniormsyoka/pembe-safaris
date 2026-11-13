'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { getWhatsAppEnquiryLink } from '@/lib/contact'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      baseName: 'maasai-mara',
      title: 'Discover the Wild Heart of Africa',
      subtitle: 'Experience authentic Kenyan safaris with expert guides',
    },
    {
      baseName: 'amboseli',
      title: 'Witness Elephants Against Kilimanjaro',
      subtitle: "Unforgettable moments in Africa's most iconic landscapes",
    },
    {
      baseName: 'beach',
      title: 'From Safari to Beach Paradise',
      subtitle: 'Combine wildlife adventures with Indian Ocean relaxation',
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative h-[100svh] min-h-[600px] overflow-hidden bg-[#2A1810]">
      {/* Background Images with Transition */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Native <picture> tag for viewport-based image swapping */}
          <picture>
            {/* Mobile: Loads the portrait crop for screens up to 768px */}
            <source 
              media="(max-width: 768px)" 
              srcSet={`/images/hero/${slide.baseName}-portrait.jpg`} 
            />
            
            {/* Desktop: Falls back to the landscape crop. 
                We use standard <img> but apply Tailwind classes for absolute positioning and cover. */}
            <img
              src={`/images/hero/${slide.baseName}.jpg`}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
              // Only the first image loads eagerly, the rest lazy load
              loading={index === 0 ? 'eager' : 'lazy'} 
              fetchPriority={index === 0 ? 'high' : 'auto'}
            />
          </picture>

          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 md:from-black/40 md:via-black/30 md:to-black/70" />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center text-center px-4 z-20">
        <div className="max-w-5xl mx-auto w-full">
          <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-[#C97A2B]/20 backdrop-blur-sm rounded-full text-[#FAF2EB] text-xs md:text-sm font-semibold mb-4 md:mb-6 animate-fade-in border border-[#C97A2B]/30">
            ✦✦✦✦✦
          </span>
          
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6 leading-[1.1]">
            <span className="bg-[linear-gradient(135deg,#ffffff_0%,#f5e6d3_25%,#e8c99e_50%,#f5e6d3_75%,#ffffff_100%)] bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)] bg-[length:200%_auto] animate-shine">
              {slides[currentSlide].title}
            </span>
          </h1>
          
          <p className="font-serif text-base sm:text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 max-w-3xl mx-auto px-2 italic font-light text-white/85 drop-shadow-lg leading-relaxed">
            {slides[currentSlide].subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Link 
              href="/safaris" 
              className="bg-[#C97A2B] text-[#FAF2EB] px-8 py-3.5 rounded-full font-semibold hover:bg-[#b06521] transition-all duration-300 active:scale-95 text-sm sm:text-base inline-block shadow-lg"
            >
              Explore Safaris
            </Link>
            <a 
              href={getWhatsAppEnquiryLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-md text-[#FAF2EB] px-8 py-3.5 rounded-full font-semibold hover:bg-white/20 border border-white/30 transition-all duration-300 active:scale-95 text-sm sm:text-base inline-block"
            >
              Enquire on WhatsApp
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-6 md:gap-8 mt-10 sm:mt-16 md:mt-20 max-w-2xl mx-auto">
              {[
                { value: 'Exemplary', label: 'Custom Itineraries' },
                { value: 'Certified', label: 'Safari Guides' },
                { value: 'Authentic', label: 'Kenyan Routes' },
              ].map((stat, index) => (
                <div key={index} className="text-center bg-[#1F1109]/40 backdrop-blur-md rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-white/10 shadow-sm">
                  <div className="font-serif text-sm sm:text-2xl md:text-3xl font-semibold text-[#E5A663] tracking-tight leading-snug">
                    {stat.value}
                  </div>
                  <div className="text-[9px] sm:text-xs text-[#FAF2EB]/80 mt-1 sm:mt-1.5 uppercase tracking-widest font-medium line-clamp-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-3 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 md:h-3 rounded-full transition-all duration-300 active:scale-95 touch-manipulation ${
                index === currentSlide
                  ? 'w-8 md:w-12 bg-[#C97A2B]'
                  : 'w-2 md:w-3 bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-8 hidden lg:block animate-bounce z-30">
          <ChevronDown className="w-6 h-6 md:w-8 md:h-8 text-white/70" />
        </div>
      </div>
    </section>
  )
}

export default Hero