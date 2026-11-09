// app/(routes)/contact/page.tsx
'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          name: formData.name,
          email: formData.email,
          subject: 'Contact Form Inquiry',
          message: formData.message,
        }),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        const error = await response.json()
        setErrorMessage(error.error || 'Failed to send message')
        setStatus('error')
      }
    } catch {
      setErrorMessage('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#FAF2EB] text-[#2A1810] pt-28 pb-20 flex items-center justify-center px-4">
        <div className="max-w-xl w-full text-center bg-white border border-[#2A1810]/10 rounded-[32px] p-8 sm:p-12 shadow-[0_18px_40px_rgba(42,24,16,0.08)]">
          <div className="text-5xl sm:text-6xl mb-4">✅</div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A1810] mb-3">Message Sent!</h2>
          <p className="text-[#2A1810]/75 text-sm sm:text-base mb-6 leading-relaxed">
            Thank you for reaching out! We'll get back to you within 24 hours.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="text-[#C97A2B] font-semibold text-sm sm:text-base hover:underline"
          >
            Send another message →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF2EB] text-[#2A1810] pt-28 sm:pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-[1240px] mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-[#C97A2B] font-semibold tracking-widest uppercase text-xs sm:text-sm block mb-2">
            Get in Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">
            Contact <span className="text-[#C97A2B]">Us</span>
          </h1>
          <p className="text-[#2A1810]/70 text-sm sm:text-base max-w-xl mx-auto">
            Have questions about our safaris or need a custom itinerary? We're here to help.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Contact Information Card */}
          <div className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 shadow-[0_10px_30px_rgba(42,24,16,0.06)] border border-[#2A1810]/5">
            <h2 className="font-serif text-2xl font-bold mb-6 text-[#2A1810]">Direct Reach</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-[#FAF2EB] text-[#C97A2B]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-[#2A1810]/50 font-medium uppercase tracking-wider">Email Us</span>
                  <a href="mailto:deniskamwathi@gmail.com" className="text-sm sm:text-base text-[#2A1810] font-semibold hover:text-[#C97A2B] transition-colors">
                    deniskamwathi@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-[#FAF2EB] text-[#C97A2B]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-[#2A1810]/50 font-medium uppercase tracking-wider">Call / WhatsApp</span>
                  <a href="tel:+254729436767" className="text-sm sm:text-base text-[#2A1810] font-semibold hover:text-[#C97A2B] transition-colors">
                    +254 729 436767
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-[#FAF2EB] text-[#C97A2B]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs text-[#2A1810]/50 font-medium uppercase tracking-wider">Location</span>
                  <span className="text-sm sm:text-base text-[#2A1810] font-semibold">
                    Nairobi, Kenya
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Working Contact Form Card */}
          <div className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 shadow-[0_10px_30px_rgba(42,24,16,0.06)] border border-[#2A1810]/5">
            <h2 className="font-serif text-2xl font-bold mb-6 text-[#2A1810]">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A1810]/70 mb-2">Your Name *</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF2EB]/40 border border-[#2A1810]/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C97A2B] text-sm text-[#2A1810]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A1810]/70 mb-2">Your Email *</label>
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF2EB]/40 border border-[#2A1810]/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C97A2B] text-sm text-[#2A1810]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A1810]/70 mb-2">Your Message *</label>
                <textarea 
                  rows={4}
                  placeholder="Tell us about your safari plans..."
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF2EB]/40 border border-[#2A1810]/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C97A2B] text-sm text-[#2A1810]"
                />
              </div>
              
              {status === 'error' && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-700 text-sm">
                  {errorMessage}
                </div>
              )}
              
              <button 
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#2A1810] text-[#FAF2EB] py-4 rounded-2xl font-semibold hover:bg-[#C97A2B] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md text-sm sm:text-base tracking-wide active:scale-95"
              >
                {status === 'loading' ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}