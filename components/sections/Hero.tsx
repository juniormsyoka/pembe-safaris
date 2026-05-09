// components/Hero.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, Play } from 'lucide-react'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
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
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="hero-section">
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
            priority
            className="object-cover"
          />
          <div className="hero-overlay" />
        </div>
      ))}

      {/* Content */}
      <div className="hero-content">
        <div className="max-w-5xl mx-auto">
          <span className="inline-block px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-6 animate-fade-in">
            ✦ Since 1995 ✦
          </span>
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            {slides[currentSlide].title}
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-white/90">
            {slides[currentSlide].subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/safaris" className="btn-primary">
              Explore Safaris
            </Link>
            <Link href="/contact" className="btn-secondary">
              Contact Us
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
            {[
              { value: '25+', label: 'Years Experience' },
              { value: '10k+', label: 'Happy Travelers' },
              { value: '50+', label: 'Expert Guides' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/80 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-12 bg-primary'
                  : 'bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-8 hidden lg:block animate-bounce">
          <ChevronDown className="w-8 h-8 text-white" />
        </div>
      </div>
    </section>
  )
}

export default Hero