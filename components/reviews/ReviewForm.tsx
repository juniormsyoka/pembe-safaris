'use client'

import { useState } from 'react'
import { CheckCircle, Loader2, Star } from 'lucide-react'

interface ReviewFormProps {
  token: string
  defaultDisplayName: string
}

export default function ReviewForm({ token, defaultDisplayName }: ReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [displayName, setDisplayName] = useState(defaultDisplayName)
  const [publishConsent, setPublishConsent] = useState(false)
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [error, setError] = useState('')

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
      <div className="bg-white p-8 sm:p-10 rounded-[24px] shadow-[0_14px_34px_rgba(42,24,16,0.08)] border border-[#2A1810]/10 max-w-md w-full text-center">
        <CheckCircle className="w-16 h-16 text-[#C97A2B] mx-auto mb-4" aria-hidden="true" />
        <h1 className="font-serif text-3xl font-bold text-[#2A1810] mb-2">Thank You!</h1>
        <p className="text-[#2A1810]/60">
          Your review has been submitted and is pending approval.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg bg-white p-6 sm:p-10 rounded-[24px] shadow-[0_14px_34px_rgba(42,24,16,0.08)] border border-[#2A1810]/10">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl font-bold text-[#2A1810] mb-2">How was your safari?</h1>
        <p className="text-[#2A1810]/60 text-sm">
          Hi {defaultDisplayName.split(' ')[0]}, we would love to hear about your experience.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset>
          <legend className="block text-sm font-semibold text-[#2A1810] mb-3 text-center">
            Your rating
          </legend>
          <div className="flex justify-center gap-1 sm:gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
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
                  className="block cursor-pointer rounded-lg p-1 text-gray-300 transition-colors hover:text-[#C97A2B] peer-checked:text-[#C97A2B] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#C97A2B] motion-reduce:transition-none"
                >
                  <Star
                    className={`w-9 h-9 sm:w-10 sm:h-10 ${value <= rating ? 'fill-current' : ''}`}
                    aria-hidden="true"
                  />
                  <span className="sr-only">
                    {value} star{value === 1 ? '' : 's'}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="display-name" className="block text-sm font-semibold text-[#2A1810] mb-2">
            Display name
          </label>
          <input
            id="display-name"
            type="text"
            required
            maxLength={60}
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className="w-full px-4 py-3 border border-[#2A1810]/20 rounded-xl bg-[#FAF2EB]/50 focus:outline-none focus:ring-2 focus:ring-[#C97A2B] text-[#2A1810]"
          />
        </div>

        <div>
          <label htmlFor="review-content" className="block text-sm font-semibold text-[#2A1810] mb-2">
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
            className="w-full p-4 border border-[#2A1810]/20 rounded-xl bg-[#FAF2EB]/50 focus:outline-none focus:ring-2 focus:ring-[#C97A2B] text-[#2A1810]"
            placeholder="Tell us what you loved about your trip..."
          />
          <p className="mt-1 text-right text-xs text-[#2A1810]/50">{content.length}/1000</p>
        </div>

        <label className="flex items-start gap-3 text-sm text-[#2A1810]/80">
          <input
            type="checkbox"
            checked={publishConsent}
            onChange={(event) => setPublishConsent(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[#2A1810]/30 text-[#C97A2B] focus:ring-[#C97A2B]"
          />
          <span>I agree this review may be shown on the website</span>
        </label>

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
          <div role="alert" className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-700 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-[#C97A2B] text-[#FAF2EB] py-4 rounded-full font-bold hover:bg-[#b06521] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              Submitting...
            </>
          ) : (
            'Submit Review'
          )}
        </button>
      </form>
    </div>
  )
}
