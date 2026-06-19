'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  
  const slides = [
    {
      image: '/images/hero/maasai-mara.jpg',
      title: 'Discover the Wild Heart of Africa',
      subtitle: 'Experience authentic Kenyan safaris with expert guides',
    },
    {
      image: '/images/hero/amboseli.jpg',
      title: 'Witness Elephants Against Kilimanjaro',
      subtitle: 'Unforgettable moments in Africa\'s most iconic landscapes',
    },
    {
      image: '/images/hero/beach.jpg',
      title: 'From Safari to Beach Paradise',
      subtitle: 'Combine wildlife adventures with Indian Ocean relaxation',
    },
  ]

  useEffect(() => {
    setIsMounted(true)
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative h-[100vh] min-h-[600px] overflow-hidden">
      {/* Background Images with Transition */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0} // Only first slide is priority
            className="object-cover"
            sizes="100vw"
            quality={80} // Reduced quality for faster loading
            loading={index === 0 ? 'eager' : 'lazy'} // Lazy load non-visible slides
            fetchPriority={index === 0 ? 'high' : 'auto'} // Prioritize first slide
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center px-4">
        <div className="max-w-5xl mx-auto">
          <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-primary/20 backdrop-blur-sm rounded-full text-white text-xs md:text-sm font-semibold mb-4 md:mb-6 animate-fade-in">
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
            <Link href="/safaris" className="btn-primary text-center">
              Explore Safaris
            </Link>
            <Link href="/contact" className="btn-secondary text-center">
              Contact Us
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-12 sm:mt-16 md:mt-20 max-w-2xl mx-auto">
            {[
              { value: '25+', label: 'Years Experience' },
              { value: '10k+', label: 'Happy Travelers' },
              { value: '50+', label: 'Expert Guides' },
            ].map((stat, index) => (
              <div key={index} className="text-center bg-black/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-xs sm:text-sm text-white/80 mt-1 sm:mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 md:h-3 rounded-full transition-all duration-300 active:scale-95 touch-manipulation ${
                index === currentSlide
                  ? 'w-8 md:w-12 bg-primary'
                  : 'w-2 md:w-3 bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 hidden lg:block animate-bounce">
          <ChevronDown className="w-6 h-6 md:w-8 md:h-8 text-white" />
        </div>
      </div>
    </section>
  )
}

export default Hero