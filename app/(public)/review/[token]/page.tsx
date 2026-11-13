import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Clock } from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase/admin'
import ReviewForm from '@/components/reviews/ReviewForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Share your safari experience | Pembe Africa Safaris',
  robots: {
    index: false,
    follow: false,
  },
  referrer: 'no-referrer',
}

function getDefaultDisplayName(customerName: string): string {
  const parts = customerName.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) return 'Guest'
  if (parts.length === 1) return parts[0].slice(0, 60)

  return `${parts[0]} ${parts[parts.length - 1].charAt(0).toUpperCase()}.`.slice(0, 60)
}

function StateCard({
  icon,
  title,
  message,
  showHomeLink = false,
}: {
  icon: React.ReactNode
  title: string
  message: string
  showHomeLink?: boolean
}) {
  return (
    <div className="min-h-[70vh] bg-[#FAF2EB] flex items-center justify-center px-4 py-16">
      <div className="bg-white p-8 sm:p-10 rounded-[24px] shadow-[0_14px_34px_rgba(42,24,16,0.08)] border border-[#2A1810]/10 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">{icon}</div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1810] mb-2">{title}</h1>
        <p className="text-[#2A1810]/60">{message}</p>
        {showHomeLink && (
          <Link href="/" className="inline-block mt-6 text-[#C97A2B] font-semibold hover:underline">
            Return to homepage
          </Link>
        )}
      </div>
    </div>
  )
}

export default async function ReviewPage({ params }: { params: { token: string } }) {
  const { data: review } = await supabaseAdmin
    .from('reviews')
    .select('id, customer_name, display_name, token_expires_at, submitted_at')
    .eq('token', params.token)
    .maybeSingle()

  if (!review) {
    return (
      <StateCard
        icon={<Clock className="w-14 h-14 text-[#C97A2B]" aria-hidden="true" />}
        title="This link isn't valid"
        message="Please use the link from your review request or contact us for a new one."
        showHomeLink
      />
    )
  }

  if (review.submitted_at) {
    return (
      <StateCard
        icon={<CheckCircle className="w-14 h-14 text-[#C97A2B]" aria-hidden="true" />}
        title="Thank you!"
        message="Your review has already been submitted and is pending approval."
      />
    )
  }

  if (
    !review.token_expires_at ||
    new Date(review.token_expires_at).getTime() <= Date.now()
  ) {
    return (
      <StateCard
        icon={<Clock className="w-14 h-14 text-[#C97A2B]" aria-hidden="true" />}
        title="This link has expired"
        message="Please contact us if you would like a new review link."
        showHomeLink
      />
    )
  }

  const defaultDisplayName =
    review.display_name ||
    getDefaultDisplayName(review.customer_name || '')

  return (
    <div className="min-h-[70vh] bg-[#FAF2EB] flex items-center justify-center px-4 py-12 sm:py-16">
      <ReviewForm token={params.token} defaultDisplayName={defaultDisplayName} />
    </div>
  )
}
