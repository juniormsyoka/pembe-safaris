// components/reviews/ReviewForm.tsx
'use client'

import { useState } from 'react'
import { CheckCircle, Loader2, Star, Sparkles } from 'lucide-react'

interface ReviewFormProps {
  token: string
  defaultDisplayName: string
}

const RATING_PROMPTS: Record<number, string[]> = {
  1: ["The guide was friendly", "The booking process was smooth", "I liked the vehicle"],
  2: ["Good value for money", "The views were nice", "Staff were helpful"],
  3: ["The safari was enjoyable", "Our guide was knowledgeable", "Good photo opportunities"],
  4: ["Amazing wildlife sightings", "Our guide went above and beyond", "The lodge was superb", "Perfect pacing of the trip"],
  5: ["Absolutely life-changing experience", "The big five in one day!", "Our guide was a walking encyclopedia", "Every detail was perfect", "A dream come true"],
}

const RATING_PLACEHOLDERS: Record<number, string> = {
  1: "We're sorry it wasn't perfect. What could we have done better?",
  2: "Tell us what would have made your trip more enjoyable...",
  3: "What did you enjoy most about your safari?",
  4: "We'd love to hear what made your trip memorable...",
  5: "We're thrilled! Tell us about your favorite moment...",
}

export default function ReviewForm({ token, defaultDisplayName }: ReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [content, setContent] = useState('')
  const [displayName, setDisplayName] = useState(defaultDisplayName)
  const [publishConsent, setPublishConsent] = useState(true)
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [error, setError] = useState('')

  const activeDisplayRating = hoverRating || rating
  const chips = RATING_PROMPTS[activeDisplayRating] ?? []
  const placeholder = RATING_PLACEHOLDERS[activeDisplayRating] ?? "Tell us what you loved about your trip..."

  const handleChipClick = (chip: string) => {
    setContent((prev) => {
      const trimmed = prev.trim()
      if (!trimmed) return `${chip}. `
      if (trimmed.endsWith('.')) return `${trimmed} ${chip}. `
      return `${trimmed}, ${chip.toLowerCase()}. `
    })
    document.getElementById('review-content')?.focus()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('submitting')
    setError('')

    try {
      const response = await fetch(`/api/reviews/${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          content,
          display_name: displayName,
          publish_consent: publishConsent,
          website,
        }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setError(data?.error || 'Unable to submit this review. Please try again.')
        setStatus('idle')
        return
      }

      setStatus('success')
    } catch {
      setError('Unable to submit this review. Please try again.')
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <div className="w-full max-w-lg bg-gradient-to-b from-[#2E1B11]/90 to-[#180C06]/95 p-10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#FAF2EB]/10 text-center relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E5A663]/40 to-transparent" />
        <div className="w-16 h-16 bg-[#C97A2B]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#C97A2B]/40 text-[#E5A663]">
          <CheckCircle className="w-8 h-8" aria-hidden="true" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#FAF2EB] mb-3">Thank You!</h1>
        <p className="text-[#FAF2EB]/70 text-sm leading-relaxed">
          Your review has been submitted and is pending approval.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-xl bg-gradient-to-b from-[#2E1B11]/95 to-[#180C06]/98 p-8 sm:p-12 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-[#FAF2EB]/15 relative overflow-hidden">
      {/* Architectural Glow Effect */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E5A663]/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-32 bg-[#C97A2B]/20 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 text-center mb-10">
        <span className="text-[#C97A2B] font-semibold tracking-[0.2em] uppercase text-xs block mb-2">
          Pembe Safari Experience
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#FAF2EB] mb-2">
          How was your safari?
        </h1>
        <p className="text-[#FAF2EB]/70 text-sm">
          Jambo <span className="text-[#E5A663] font-medium">{defaultDisplayName.split(' ')[0]}</span>, we would love to hear reflections on your journey.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7 relative z-10">
        
        {/* Star Rating with Cumulative Glow */}
        <fieldset className="bg-[#FAF2EB]/5 p-5 rounded-2xl border border-[#FAF2EB]/10 text-center">
          <legend className="block text-xs font-semibold uppercase tracking-wider text-[#FAF2EB]/80 mb-3">
            Your Rating
          </legend>
          <div 
            className="flex justify-center gap-2"
            onMouseLeave={() => setHoverRating(0)}
            role="radiogroup" 
            aria-label="Star rating"
          >
            {[1, 2, 3, 4, 5].map((value) => {
              const active = value <= activeDisplayRating
              return (
                <div key={value}>
                  <input
                    type="radio"
                    id={`rating-${value}`}
                    name="rating"
                    value={value}
                    checked={rating === value}
                    onChange={() => setRating(value)}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={`rating-${value}`}
                    onMouseEnter={() => setHoverRating(value)}
                    className="block cursor-pointer p-1 transition-transform duration-200 hover:scale-110 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#C97A2B]"
                  >
                    <Star
                      className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors duration-200 ${
                        active
                          ? 'text-[#E5A663] fill-[#E5A663] drop-shadow-[0_0_12px_rgba(229,166,99,0.5)]'
                          : 'text-[#FAF2EB]/20'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="sr-only">
                      {value} star{value === 1 ? '' : 's'}
                    </span>
                  </label>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-[#E5A663] font-medium mt-2">
            {activeDisplayRating === 5 ? '★ Exceptional Safari Experience' : 
             activeDisplayRating === 4 ? '★ Wonderful Journey' : 
             activeDisplayRating === 3 ? '★ Good Experience' : 
             activeDisplayRating === 2 ? '★ Fair' : '★ Needs Improvement'}
          </p>
        </fieldset>

        {/* Display Name */}
        <div>
          <label htmlFor="display-name" className="block text-xs font-semibold uppercase tracking-wider text-[#FAF2EB]/80 mb-2">
            Display Name
          </label>
          <input
            id="display-name"
            type="text"
            required
            maxLength={60}
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className="w-full px-5 py-3.5 bg-[#FAF2EB]/5 border border-[#FAF2EB]/15 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C97A2B] text-[#FAF2EB] text-sm placeholder-[#FAF2EB]/30 transition-all shadow-inner"
          />
        </div>

        {/* Review Content */}
        <div>
          <label htmlFor="review-content" className="block text-xs font-semibold uppercase tracking-wider text-[#FAF2EB]/80 mb-2">
            Your Review *
          </label>
          <textarea
            id="review-content"
            required
            minLength={10}
            maxLength={1000}
            rows={5}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="w-full p-4 bg-[#FAF2EB]/5 border border-[#FAF2EB]/15 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C97A2B] text-[#FAF2EB] text-sm placeholder-[#FAF2EB]/35 transition-all shadow-inner leading-relaxed"
            placeholder={placeholder}
          />
          <div className="flex justify-between items-center mt-1.5 px-1">
            <span className="text-[11px] text-[#FAF2EB]/40">Tap prompt chips below or type freely</span>
            <span className="text-xs text-[#FAF2EB]/50 font-mono">{content.length}/1000</span>
          </div>
        </div>

        {/* Rating-Based Highlight Chips */}
        {chips.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#E5A663] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quick Highlights (Tap to add)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#FAF2EB]/5 hover:bg-[#C97A2B]/20 text-[#FAF2EB]/80 hover:text-[#E5A663] border border-[#FAF2EB]/10 transition-all active:scale-95"
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Consent Checkbox */}
        <label className="flex items-start gap-3 text-xs sm:text-sm text-[#FAF2EB]/80 cursor-pointer select-none">
          <input
            type="checkbox"
            required
            checked={publishConsent}
            onChange={(event) => setPublishConsent(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[#FAF2EB]/30 bg-transparent text-[#C97A2B] focus:ring-[#C97A2B] accent-[#C97A2B]"
          />
          <span>I agree this review and my initials may be featured on the Pembe Africa Safaris website</span>
        </label>

        {/* Honeypot anti-spam */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </div>

        {error && (
          <div role="alert" className="bg-rose-950/60 border border-rose-500/40 rounded-2xl p-4 text-rose-200 text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-[#C97A2B] hover:bg-[#b56a21] text-[#FAF2EB] py-4 rounded-full font-bold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(201,122,43,0.35)] active:scale-95 text-sm tracking-wide uppercase"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              Submitting Review...
            </>
          ) : (
            'Submit Safari Review'
          )}
        </button>
      </form>
    </div>
  )
}