// app/(routes)/contact/page.tsx
'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react'
import { getWhatsAppEnquiryLink } from '@/lib/contact'

function humanizePackageSlug(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function ContactFormContent() {
  const searchParams = useSearchParams()
  const packageParam = searchParams.get('package') || ''
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    package: humanizePackageSlug(packageParam),
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setFormData((prev) => ({ ...prev, package: humanizePackageSlug(packageParam) }))
  }, [packageParam])

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
          subject: formData.package ? `Package Inquiry: ${formData.package}` : 'Contact Form Inquiry',
          message: formData.package
            ? `Package of interest: ${formData.package}\n\n${formData.message}`
            : formData.message,
        }),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', package: '', message: '' })
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

  const whatsappUrl = getWhatsAppEnquiryLink(formData.package || undefined)

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
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A1810]/70 mb-2">Safari of Interest</label>
                <input 
                  type="text" 
                  placeholder="e.g. Maasai Mara Explorer"
                  value={formData.package}
                  onChange={(e) => setFormData({ ...formData, package: e.target.value })}
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

              {/* Form WhatsApp Divider & Button */}
              <div className="pt-3">
                <div className="relative flex items-center justify-center mb-4">
                  <div className="border-t border-[#2A1810]/10 w-full" />
                  <span className="bg-white px-3 text-[11px] uppercase tracking-widest text-[#2A1810]/50 font-semibold absolute">
                    or
                  </span>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm active:scale-95 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  Chat Directly on WhatsApp
                </a>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF2EB]" />}>
      <ContactFormContent />
    </Suspense>
  )
}