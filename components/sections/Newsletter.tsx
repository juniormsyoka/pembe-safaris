// components/Newsletter.tsx
'use client'

import { useState } from 'react'
import { Send, Mail, CheckCircle } from 'lucide-react'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    // Handle newsletter signup
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setEmail('')
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-r from-primary to-accent relative overflow-hidden">
      {/* Background Pattern - Simplified for mobile */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          {/* Icon - Smaller on mobile */}
          <div className="w-14 h-14 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5 md:mb-8">
            <Mail className="w-7 h-7 md:w-10 md:h-10" />
          </div>

          {/* Content - Smaller text on mobile */}
          <h2 className="font-serif text-xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 px-2">
            Subscribe to Our Newsletter
          </h2>
          
          <p className="text-sm md:text-base lg:text-lg text-white/90 mb-6 md:mb-8 px-4 max-w-md mx-auto">
            Get exclusive offers, safari tips, and stories from the wild
          </p>

          {/* Form - Mobile optimized */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto px-4 sm:px-0">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="w-full px-5 py-3 md:px-6 md:py-4 rounded-full text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 text-base min-h-[48px]"
            />
            <button
              type="submit"
              className="bg-white text-primary px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 text-base min-h-[48px] shadow-lg"
            >
              {submitted ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Subscribed!</span>
                </>
              ) : (
                <>
                  <span>Subscribe Now</span>
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Trust Badges - Stacked on mobile, row on tablet */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 mt-6 md:mt-8 text-xs text-white/70">
            <span className="flex items-center justify-center gap-1.5">
              <span className="text-green-300">✓</span> No spam, ever
            </span>
            <span className="flex items-center justify-center gap-1.5">
              <span className="text-green-300">✓</span> Unsubscribe anytime
            </span>
            <span className="flex items-center justify-center gap-1.5">
              <span className="text-green-300">✓</span> Exclusive offers
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter