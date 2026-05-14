// components/Testimonials.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { useSwipeable } from 'react-swipeable'

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

  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => nextTestimonial(),
    onSwipedRight: () => prevTestimonial(),
    trackMouse: false,
  })

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <span className="text-primary font-semibold tracking-wider uppercase text-xs md:text-sm">
            Testimonials
          </span>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-3 md:mb-4">
            What Our <span className="gradient-text">Travelers Say</span>
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Real experiences from real travelers who discovered the magic of Kenya with us
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="max-w-4xl mx-auto relative px-4 sm:px-0">
          {/* Main Testimonial with Swipe Support */}
          <div {...swipeHandlers} className="touch-pan-y">
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-5 md:p-8 lg:p-12">
              <div className="flex flex-col md:flex-row items-start gap-5 md:gap-6 lg:gap-8">
                {/* Author Image */}
                <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden flex-shrink-0 mx-auto md:mx-0">
                  <Image
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 80px, 128px"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  {/* Quote Icon */}
                  <Quote className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary/20 mb-3 md:mb-4 mx-auto md:mx-0" />

                  {/* Rating */}
                  <div className="flex gap-1 mb-3 md:mb-4 justify-center md:justify-start">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 md:w-5 md:h-5 ${
                          i < testimonials[currentIndex].rating
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-base md:text-lg lg:text-xl text-gray-700 italic mb-4 md:mb-5 lg:mb-6">
                    "{testimonials[currentIndex].text}"
                  </p>

                  {/* Author Info */}
                  <div>
                    <h4 className="font-serif text-lg md:text-xl font-bold">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-sm md:text-base text-gray-600">{testimonials[currentIndex].location}</p>
                    <p className="text-xs md:text-sm text-primary mt-1 md:mt-2">
                      {testimonials[currentIndex].safari}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons - Hidden on mobile, visible on tablet+ */}
          <button
            onClick={prevTestimonial}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 lg:-translate-x-12 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors active:scale-95"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>

          <button
            onClick={nextTestimonial}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 lg:translate-x-12 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors active:scale-95"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>

          {/* Indicators - Touch friendly */}
          <div className="flex justify-center mt-6 md:mt-8 space-x-2 md:space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 md:h-3 rounded-full transition-all active:scale-95 touch-manipulation ${
                  index === currentIndex
                    ? 'w-6 md:w-8 bg-primary'
                    : 'w-2 md:w-3 bg-gray-300 hover:bg-gray-400'
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