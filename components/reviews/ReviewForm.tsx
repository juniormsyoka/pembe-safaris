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
  const [hoveredStar, setHoveredStar] = useState<number | null>(null)
  const [content, setContent] = useState('')
  const [displayName, setDisplayName] = useState(defaultDisplayName)
  const [publishConsent, setPublishConsent] = useState(false)
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [error, setError] = useState('')
  const [justAddedChip, setJustAddedChip] = useState<string | null>(null)

  const chips = RATING_PROMPTS[rating] ?? []
  const placeholder = RATING_PLACEHOLDERS[rating] ?? 'Tell us what you loved about your trip...'
  const previewRating = hoveredStar ?? rating

  const handleChipClick = (chip: string) => {
    setContent((prev) => {
      const trimmed = prev.trim()
      if (!trimmed) return `${chip}. `
      if (trimmed.endsWith('.')) return `${trimmed} ${chip}. `
      return `${trimmed}, ${chip.toLowerCase()}. `
    })
    setJustAddedChip(chip)
    window.setTimeout(() => setJustAddedChip(null), 600)
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
      <div className="relative overflow-hidden w-full max-w-md bg-gradient-to-b from-[#2E1B11]/90 to-[#180C06]/95 border border-[#FAF2EB]/10 rounded-[24px] p-10 text-center shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[220px] bg-[#C97A2B]/25 blur-[100px] rounded-full pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E5A663]/50 to-transparent"
          aria-hidden="true"
        />
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C97A2B] to-[#8C4F16] p-[2px] mx-auto mb-5 shadow-[0_0_30px_rgba(201,122,43,0.5)]">
            <div className="w-full h-full rounded-full bg-[#24140C] flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-[#E5A663]" aria-hidden="true" />
            </div>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#FAF2EB] mb-2">Asante sana!</h1>
          <p className="text-sm text-[#FAF2EB]/60 leading-relaxed">
            Your review has been submitted. We can&apos;t wait to share your story.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden w-full max-w-lg bg-gradient-to-b from-[#2E1B11]/90 to-[#180C06]/95 border border-[#FAF2EB]/10 rounded-[24px] p-6 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
      {/* Ambient amber glow top */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[220px] bg-[#C97A2B]/15 blur-[100px] rounded-full pointer-events-none"
        aria-hidden="true"
      />
      {/* Top rim light */}
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E5A663]/40 to-transparent"
        aria-hidden="true"
      />
      {/* Subtle grid mask */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#FAF2EB06_1px,transparent_1px),linear-gradient(to_bottom,#FAF2EB06_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-[#C97A2B] font-semibold tracking-[0.2em] uppercase text-[10px] block mb-2">
            Your Feedback
          </span>
          <h1 className="font-serif text-3xl sm:text-[2rem] font-bold text-[#FAF2EB] tracking-tight">
            How was your <em className="font-normal text-[#E5A663]">safari</em>?
          </h1>
          <p className="mt-3 text-sm text-[#FAF2EB]/60">
            Hi {defaultDisplayName.split(' ')[0]}, we&apos;d love to hear your story.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Stars */}
          <fieldset>
            <legend className="block text-[10px] font-semibold text-[#FAF2EB]/50 uppercase tracking-[0.2em] mb-3 text-center">
              Your rating
            </legend>
            <div
              className="flex justify-center gap-1 sm:gap-2"
              role="radiogroup"
              aria-label="Star rating"
              onMouseLeave={() => setHoveredStar(null)}
            >
              {[1, 2, 3, 4, 5].map((value) => {
                const active = value <= previewRating
                const committed = value <= rating
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
                      onMouseEnter={() => setHoveredStar(value)}
                      className={`block cursor-pointer rounded-lg p-1 transition-all duration-300 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#C97A2B] motion-reduce:transition-none ${
                        active
                          ? 'text-[#E5A663] scale-110 drop-shadow-[0_0_10px_rgba(229,166,99,0.7)]'
                          : 'text-[#FAF2EB]/20 hover:text-[#E5A663]/60 hover:scale-105'
                      }`}
                    >
                      <Star
                        className={`w-9 h-9 sm:w-10 sm:h-10 transition-transform duration-300 ${
                          active ? 'fill-current' : ''
                        } ${committed && active ? 'animate-[pulse_0.4s_ease-out]' : ''}`}
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
            <p className="text-center text-xs text-[#FAF2EB]/40 mt-2 h-4">
              {rating === 5 && 'Outstanding — we love to hear it!'}
              {rating === 4 && 'Great experience'}
              {rating === 3 && 'Good, but we can do better'}
              {rating === 2 && 'Below expectations'}
              {rating === 1 && 'We owe you an apology'}
            </p>
          </fieldset>

          {/* Display name */}
          <div>
            <label htmlFor="display-name" className="block text-[10px] font-semibold text-[#FAF2EB]/50 uppercase tracking-[0.2em] mb-2">
              Display name
            </label>
            <input
              id="display-name"
              type="text"
              required
              maxLength={60}
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="w-full px-4 py-3 border border-[#FAF2EB]/10 rounded-xl bg-[#FAF2EB]/5 text-[#FAF2EB] placeholder:text-[#FAF2EB]/30 focus:outline-none focus:border-[#C97A2B]/60 focus:ring-2 focus:ring-[#C97A2B]/30 transition"
            />
          </div>

          {/* Review body */}
          <div>
            <label htmlFor="review-content" className="block text-[10px] font-semibold text-[#FAF2EB]/50 uppercase tracking-[0.2em] mb-2">
              Your review
            </label>
            <textarea
              id="review-content"
              required
              minLength={10}
              maxLength={1000}
              rows={6}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="w-full p-4 border border-[#FAF2EB]/10 rounded-xl bg-[#FAF2EB]/5 text-[#FAF2EB] placeholder:text-[#FAF2EB]/30 focus:outline-none focus:border-[#C97A2B]/60 focus:ring-2 focus:ring-[#C97A2B]/30 transition resize-none"
              placeholder={placeholder}
            />
            <p className="mt-1.5 text-right text-[10px] text-[#FAF2EB]/40 tabular-nums">
              {content.length}/1000
            </p>
          </div>

          {/* Chips */}
          {chips.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3 h-3 text-[#C97A2B]" aria-hidden="true" />
                <p className="text-[10px] font-semibold text-[#FAF2EB]/50 uppercase tracking-[0.2em]">
                  Tap to add a highlight
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleChipClick(chip)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C97A2B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1F1109] ${
                      justAddedChip === chip
                        ? 'border-[#E5A663] bg-[#C97A2B]/30 text-[#E5A663] shadow-[0_0_16px_rgba(229,166,99,0.6)] scale-105'
                        : 'border-[#C97A2B]/30 bg-[#FAF2EB]/5 text-[#FAF2EB]/80 hover:border-[#C97A2B]/70 hover:bg-[#C97A2B]/10 hover:text-[#E5A663]'
                    }`}
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Consent */}
          <label className="flex items-start gap-3 text-sm text-[#FAF2EB]/75 cursor-pointer group">
            <input
              type="checkbox"
              checked={publishConsent}
              onChange={(event) => setPublishConsent(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[#FAF2EB]/20 bg-[#FAF2EB]/5 text-[#C97A2B] focus:ring-[#C97A2B] focus:ring-offset-[#1F1109]"
            />
            <span className="group-hover:text-[#FAF2EB] transition-colors">
              I agree this review may be shown on the website
            </span>
          </label>

          {/* Honeypot */}
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

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 text-rose-200 text-sm backdrop-blur-sm"
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="group relative w-full bg-[#C97A2B] text-[#FAF2EB] py-4 rounded-full font-semibold tracking-wide hover:bg-[#b56a21] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(201,122,43,0.35)] hover:shadow-[0_12px_35px_rgba(201,122,43,0.5)] active:scale-[0.98]"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                Submitting...
              </>
            ) : (
              <>
                Submit Review
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Keyframes for the "pop" when a star commits */}
      <style jsx global>{`
        @keyframes pulse {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}