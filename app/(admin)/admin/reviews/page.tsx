'use client'

import { useEffect, useState } from 'react'
import {
  Calendar,
  CheckCircle,
  CheckCircle2,
  Clock,
  Copy,
  Loader2,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShieldX,
  Star,
  Trash2,
  X,
  XCircle,
} from 'lucide-react'
import AuthGuard from '@/components/auth/AuthGuard'
import { getReviewRequestWhatsAppLink } from '@/lib/contact'

type ReviewStatus = 'pending' | 'approved' | 'rejected'
type ReviewTab = 'awaiting' | 'moderate' | 'approved' | 'rejected'

interface Review {
  id: string
  booking_id: string | null
  package_id: string | null
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  display_name: string | null
  rating: number
  content: string | null
  status: ReviewStatus
  publish_consent: boolean
  submitted_at: string | null
  created_at: string
  token_expires_at: string | null
  trip_date: string | null
  reviewLink: string | null
}

interface PackageOption {
  id: string
  title: string
  active?: boolean
}

interface RequestFormState {
  customer_name: string
  customer_phone: string
  customer_email: string
  package_id: string
  trip_date: string
}

interface ToastState {
  show: boolean
  message: string
  type: 'success' | 'error'
}

const EMPTY_FORM: RequestFormState = {
  customer_name: '',
  customer_phone: '',
  customer_email: '',
  package_id: '',
  trip_date: '',
}

const REVIEW_TABS: { key: ReviewTab; label: string }[] = [
  { key: 'awaiting', label: 'Awaiting' },
  { key: 'moderate', label: 'To moderate' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
]

const INPUT_CLASS =
  'min-h-11 w-full rounded-xl border border-[#2A1810]/15 bg-white px-4 py-2.5 text-sm text-[#2A1810] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C97A2B]'

function formatDate(value?: string | null): string | null {
  if (!value) return null

  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value)

  if (Number.isNaN(date.getTime())) return null

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getReviewTab(review: Review): ReviewTab {
  if (!review.submitted_at) return 'awaiting'
  if (review.status === 'approved') return 'approved'
  if (review.status === 'rejected') return 'rejected'
  return 'moderate'
}

function ReviewsContent() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [packages, setPackages] = useState<PackageOption[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<ReviewTab>('awaiting')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)
  const [form, setForm] = useState<RequestFormState>(EMPTY_FORM)
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success',
  })

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type })
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('request') === '1') {
      setSheetOpen(true)
    }
  }, [])

  useEffect(() => {
    if (!toast.show) return
    const timer = setTimeout(
      () => setToast((current) => ({ ...current, show: false })),
      4000
    )
    return () => clearTimeout(timer)
  }, [toast.show])

  useEffect(() => {
    if (!sheetOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSheetOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [sheetOpen])

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true)

    try {
      const [reviewsResponse, packagesResponse] = await Promise.all([
        fetch('/api/admin/reviews', { cache: 'no-store' }),
        fetch('/api/admin/packages', { cache: 'no-store' }),
      ])

      if (!reviewsResponse.ok) {
        throw new Error('Failed to fetch reviews')
      }

      const reviewsData = await reviewsResponse.json()
      setReviews(Array.isArray(reviewsData) ? reviewsData : [])

      if (packagesResponse.ok) {
        const packagesData = await packagesResponse.json()
        setPackages(Array.isArray(packagesData) ? packagesData : [])
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to load reviews.', 'error')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  const copyLink = async (reviewLink: string | null) => {
    if (!reviewLink) {
      showToast('No review link is available. Resend to generate one.', 'error')
      return
    }

    try {
      await navigator.clipboard.writeText(reviewLink)
      showToast('Link copied', 'success')
    } catch {
      showToast('Could not copy the link.', 'error')
    }
  }

  const resendReview = async (review: Review) => {
    setActionId(review.id)

    try {
      const response = await fetch(`/api/admin/reviews/${review.id}/resend`, {
        method: 'POST',
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || 'Failed to resend review request')
      }

      await fetchData(true)
      showToast('New review link generated.', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to resend.', 'error')
    } finally {
      setActionId(null)
    }
  }

  const updateStatus = async (review: Review, status: 'approved' | 'rejected') => {
    setActionId(review.id)

    try {
      const response = await fetch(`/api/admin/reviews/${review.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || 'Failed to update review')
      }

      await fetchData(true)
      showToast(`Review ${status}.`, 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update review.', 'error')
    } finally {
      setActionId(null)
    }
  }

  const deleteReview = async (review: Review) => {
    if (!window.confirm('Delete this review permanently?')) return

    setActionId(review.id)

    try {
      const response = await fetch(`/api/admin/reviews/${review.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || 'Failed to delete review')
      }

      await fetchData(true)
      showToast('Review deleted.', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete review.', 'error')
    } finally {
      setActionId(null)
    }
  }

  const submitRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.customer_name,
          customer_phone: form.customer_phone,
          customer_email: form.customer_email,
          package_id: form.package_id || null,
          trip_date: form.trip_date || null,
        }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || 'Failed to create review request')
      }

      setSheetOpen(false)
      setForm(EMPTY_FORM)
      setActiveTab('awaiting')
      await fetchData(true)
      showToast('Review request created.', 'success')
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to create review request.',
        'error'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const activePackages = packages.filter((pkg) => pkg.active === true)
  const packageTitleById = new Map(packages.map((pkg) => [pkg.id, pkg.title]))

  const tabCounts: Record<ReviewTab, number> = {
    awaiting: 0,
    moderate: 0,
    approved: 0,
    rejected: 0,
  }

  for (const review of reviews) {
    tabCounts[getReviewTab(review)] += 1
  }

  const visibleReviews = reviews
    .filter((review) => getReviewTab(review) === activeTab)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#C97A2B] animate-spin" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {toast.show && (
        <div
          role="status"
          className={`fixed bottom-6 left-4 right-4 z-[60] flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-[0_14px_34px_rgba(42,24,16,0.15)] sm:bottom-auto sm:left-auto sm:right-6 sm:top-6 sm:max-w-sm ${
            toast.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-rose-200 bg-rose-50 text-rose-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-600" />
          )}
          <p className="text-sm font-semibold">{toast.message}</p>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#2A1810]">Manage Reviews</h1>
          <p className="mt-1 text-[#2A1810]/60">
            Request standalone reviews, send links, and moderate submissions.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#C97A2B] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#b06922] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Request a review
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {REVIEW_TABS.map((tab) => {
          const active = activeTab === tab.key

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex min-h-11 items-center justify-between gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                active
                  ? 'border-[#C97A2B] bg-[#C97A2B] text-white'
                  : 'border-[#2A1810]/10 bg-white text-[#2A1810]/70 hover:border-[#C97A2B]/40 hover:text-[#C97A2B]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  active ? 'bg-white/20 text-white' : 'bg-[#FAF2EB] text-[#2A1810]/60'
                }`}
              >
                {tabCounts[tab.key]}
              </span>
            </button>
          )
        })}
      </div>

      {visibleReviews.length === 0 && (
        <div className="rounded-2xl border border-[#2A1810]/10 bg-white p-10 text-center text-[#2A1810]/60">
          <MessageSquare className="mx-auto mb-3 h-10 w-10 text-[#2A1810]/20" />
          No reviews in this tab.
        </div>
      )}

      <div className="space-y-4">
        {visibleReviews.map((review) => {
          const tab = getReviewTab(review)
          const packageTitle = review.package_id
            ? packageTitleById.get(review.package_id) || 'Unknown package'
            : 'No package'
          const requestedAt = formatDate(review.created_at)
          const expiresAt = formatDate(review.token_expires_at)
          const tripDate = formatDate(review.trip_date)
          const isWorking = actionId === review.id
          const canApprove = Boolean(review.submitted_at) && review.publish_consent
          const whatsappLink =
            review.reviewLink && review.customer_phone
              ? getReviewRequestWhatsAppLink(
                  review.customer_phone,
                  review.reviewLink,
                  review.display_name || review.customer_name
                )
              : null

          if (tab === 'awaiting') {
            return (
              <article
                key={review.id}
                className="rounded-2xl border border-[#2A1810]/10 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="truncate font-bold text-[#2A1810]">
                      {review.customer_name || 'Unnamed customer'}
                    </h2>
                    <p className="text-sm text-[#2A1810]/60">{packageTitle}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#2A1810]/55">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#C97A2B]" />
                        Requested {requestedAt || '—'}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C97A2B]" />
                        Expires {expiresAt || '—'}
                      </span>
                      {tripDate && (
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#C97A2B]" />
                          Trip {tripDate}
                        </span>
                      )}
                    </div>
                    {(review.customer_email || review.customer_phone) && (
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#2A1810]/55">
                        {review.customer_email && (
                          <span className="inline-flex items-center gap-1.5 break-all">
                            <Mail className="w-3.5 h-3.5" />
                            {review.customer_email}
                          </span>
                        )}
                        {review.customer_phone && (
                          <span className="inline-flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" />
                            {review.customer_phone}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="inline-flex w-fit items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    Awaiting
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => copyLink(review.reviewLink)}
                    disabled={!review.reviewLink}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#FAF2EB] px-4 py-2.5 text-sm font-semibold text-[#2A1810] transition-colors hover:bg-[#2A1810] hover:text-[#FAF2EB] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Copy className="w-4 h-4" />
                    Copy link
                  </button>

                  {whatsappLink ? (
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Send via WhatsApp
                    </a>
                  ) : (
                    <span className="inline-flex min-h-11 items-center rounded-xl bg-[#FAF2EB] px-4 py-2.5 text-sm font-medium text-[#2A1810]/55">
                      No phone number on this request
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => resendReview(review)}
                    disabled={isWorking}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#2A1810]/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#2A1810]/70 transition-colors hover:border-[#C97A2B]/40 hover:text-[#C97A2B] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isWorking ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    Resend (new link)
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteReview(review)}
                    disabled={isWorking}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#2A1810]/5 px-4 py-2.5 text-sm font-semibold text-[#2A1810]/70 transition-colors hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>

                {!review.reviewLink && (
                  <p className="mt-3 text-xs font-medium text-amber-700">
                    No active link is stored. Use Resend to generate a new one.
                  </p>
                )}
              </article>
            )
          }

          return (
            <article
              key={review.id}
              className="rounded-2xl border border-[#2A1810]/10 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="truncate font-bold text-[#2A1810]">
                    {review.display_name || review.customer_name || 'Anonymous'}
                  </h2>
                  <p className="text-sm text-[#2A1810]/60">{packageTitle}</p>
                  <p className="mt-1 text-xs text-[#2A1810]/50">
                    Requested {requestedAt || '—'}
                    {tripDate ? ` · Trip ${tripDate}` : ''}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`h-4 w-4 ${
                          index < review.rating
                            ? 'fill-current text-[#C97A2B]'
                            : 'text-gray-200'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                      review.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : review.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {review.status}
                  </span>
                </div>
              </div>

              <p className="mt-4 italic leading-relaxed text-[#2A1810]">
                {review.content || 'No review content provided.'}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                    review.publish_consent
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-[#2A1810]/5 text-[#2A1810]/60'
                  }`}
                >
                  {review.publish_consent ? (
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <ShieldX className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {review.publish_consent ? 'Consent given' : 'No consent'}
                </span>
                {review.customer_email && (
                  <span className="inline-flex items-center gap-1 break-all text-xs text-[#2A1810]/55">
                    <Mail className="h-3.5 w-3.5" />
                    {review.customer_email}
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {review.status !== 'approved' && (
                  <button
                    type="button"
                    onClick={() => updateStatus(review, 'approved')}
                    disabled={!canApprove || isWorking}
                    title={
                      !review.submitted_at
                        ? 'The customer has not submitted this review yet'
                        : !review.publish_consent
                          ? 'The customer did not consent to publish this review'
                          : undefined
                    }
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 transition-colors hover:bg-green-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isWorking ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    Approve
                  </button>
                )}
                {review.status !== 'rejected' && review.submitted_at && (
                  <button
                    type="button"
                    onClick={() => updateStatus(review, 'rejected')}
                    disabled={isWorking}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isWorking ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    Reject
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => deleteReview(review)}
                  disabled={isWorking}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#2A1810]/5 px-4 py-2.5 text-sm font-semibold text-[#2A1810]/70 transition-colors hover:bg-rose-50 hover:text-rose-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </article>
          )
        })}
      </div>

      {sheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-stretch md:justify-end">
          <button
            type="button"
            aria-label="Close review request form"
            onClick={() => setSheetOpen(false)}
            className="absolute inset-0 bg-[#2A1810]/40 backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-request-title"
            className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl md:h-full md:max-h-none md:w-[440px] md:rounded-none md:rounded-l-3xl md:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="review-request-title" className="text-xl font-serif font-bold text-[#2A1810]">
                  Request a review
                </h2>
                <p className="mt-1 text-sm text-[#2A1810]/60">
                  Create a standalone review link and send it to your customer.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                aria-label="Close"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-[#FAF2EB] text-[#2A1810]/70 transition-colors hover:bg-[#2A1810] hover:text-[#FAF2EB]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={submitRequest} className="mt-5 space-y-4">
              <div>
                <label htmlFor="review-customer-name" className="mb-1.5 block text-sm font-semibold text-[#2A1810]">
                  Customer name <span className="text-[#C97A2B]">*</span>
                </label>
                <input
                  id="review-customer-name"
                  type="text"
                  required
                  maxLength={80}
                  autoFocus
                  value={form.customer_name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, customer_name: event.target.value }))
                  }
                  className={INPUT_CLASS}
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <label htmlFor="review-customer-phone" className="mb-1.5 block text-sm font-semibold text-[#2A1810]">
                  Phone
                </label>
                <input
                  id="review-customer-phone"
                  type="tel"
                  inputMode="tel"
                  value={form.customer_phone}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, customer_phone: event.target.value }))
                  }
                  className={INPUT_CLASS}
                  placeholder="+254729436767"
                />
              </div>

              <div>
                <label htmlFor="review-customer-email" className="mb-1.5 block text-sm font-semibold text-[#2A1810]">
                  Email
                </label>
                <input
                  id="review-customer-email"
                  type="email"
                  value={form.customer_email}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, customer_email: event.target.value }))
                  }
                  className={INPUT_CLASS}
                  placeholder="jane@example.com"
                />
              </div>

              <div>
                <label htmlFor="review-package" className="mb-1.5 block text-sm font-semibold text-[#2A1810]">
                  Package
                </label>
                <select
                  id="review-package"
                  value={form.package_id}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, package_id: event.target.value }))
                  }
                  className={INPUT_CLASS}
                >
                  <option value="">No package</option>
                  {activePackages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="review-trip-date" className="mb-1.5 block text-sm font-semibold text-[#2A1810]">
                  Trip date
                </label>
                <input
                  id="review-trip-date"
                  type="date"
                  value={form.trip_date}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, trip_date: event.target.value }))
                  }
                  className={INPUT_CLASS}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#C97A2B] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#b06922] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Create review request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminReviewsPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#FAF2EB]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <ReviewsContent />
        </div>
      </div>
    </AuthGuard>
  )
}
