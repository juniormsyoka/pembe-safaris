// components/Testimonials.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'United Kingdom',
      image: '/images/testimonials/sarah.jpg',
      rating: 5,
      text: 'The most incredible experience of our lives! Our guide Joseph was knowledgeable, patient, and made sure we saw the Big Five. The accommodations were luxurious and the food was amazing. Already planning our next trip!',
      safari: 'Maasai Mara & Amboseli Safari',
    },
    {
      id: 2,
      name: 'Michael Chen',
      location: 'Singapore',
      image: '/images/testimonials/michael.jpg',
      rating: 5,
      text: 'Pembe Africa Safaris exceeded all our expectations. From the moment we landed in Nairobi to our final farewell, everything was perfectly organized. The cultural visit to a Maasai village was a highlight we\'ll never forget.',
      safari: 'Cultural Safari Experience',
    },
    {
      id: 3,
      name: 'Emma Watson',
      location: 'Australia',
      image: '/images/testimonials/emma.jpg',
      rating: 5,
      text: 'As a solo female traveler, I felt completely safe and well taken care of. The group was small and friendly, and our guide went above and beyond to ensure everyone had a personalized experience. Highly recommended!',
      safari: 'Wildlife Photography Safari',
    },
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold tracking-wider uppercase">
            Testimonials
          </span>
          <h2 className="section-title">
            What Our <span className="gradient-text">Travelers Say</span>
          </h2>
          <p className="section-subtitle">
            Real experiences from real travelers who discovered the magic of Kenya with us
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="max-w-4xl mx-auto relative">
          {/* Main Testimonial */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Author Image */}
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                {/* Quote Icon */}
                <Quote className="w-12 h-12 text-primary/20 mb-4" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonials[currentIndex].rating
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-lg md:text-xl text-gray-700 italic mb-6">
                  "{testimonials[currentIndex].text}"
                </p>

                {/* Author Info */}
                <div>
                  <h4 className="font-serif text-xl font-bold">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-gray-600">{testimonials[currentIndex].location}</p>
                  <p className="text-sm text-primary mt-2">
                    {testimonials[currentIndex].safari}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-primary'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials