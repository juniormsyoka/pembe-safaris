// components/Newsletter.tsx
'use client'

import { useState } from 'react'
import { Send, Mail, CheckCircle } from 'lucide-react'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setEmail('')
  }

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-gradient-to-r from-primary to-accent relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          {/* Icon */}
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
            <Mail className="w-8 h-8 md:w-10 md:h-10" />
          </div>

          {/* Content */}
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-4">
            Subscribe to Our Newsletter
          </h2>
          
          <p className="text-sm md:text-base lg:text-xl text-white/90 mb-6 md:mb-8 px-4">
            Get exclusive offers, safari tips, and stories from the wild delivered to your inbox
          </p>

          {/* Form - Mobile: column, Tablet+: row */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-lg mx-auto px-4 sm:px-0">
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 md:px-6 md:py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50 text-sm md:text-base"
              />
            </div>
            <button
              type="submit"
              className="bg-white text-primary px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group text-sm md:text-base min-h-[48px]"
            >
              {submitted ? (
                <>
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Subscribed!</span>
                </>
              ) : (
                <>
                  <span>Subscribe</span>
                  <Send className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Trust Badges - Mobile: column, Tablet: row */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 mt-6 md:mt-8 text-xs md:text-sm text-white/80">
            <span className="flex items-center justify-center gap-1">✓ No spam, ever</span>
            <span className="flex items-center justify-center gap-1">✓ Unsubscribe anytime</span>
            <span className="flex items-center justify-center gap-1">✓ Travel tips & exclusive offers</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter