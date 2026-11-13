const whatsappNumber = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254729436767'
).replace(/\D/g, '')

const phoneNumber = process.env.NEXT_PUBLIC_PHONE || '+254729436767'
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@pembeafricasafaris.com'

export function getWhatsAppEnquiryLink(packageTitle?: string): string {
  const message = packageTitle
    ? `Hi Pembe Africa Safaris, I'm interested in ${packageTitle}. Could you share details and a quote?`
    : `Hi Pembe Africa Safaris, I'm interested in planning a safari. Could you share details and a quote?`

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
}

export function getCallLink(): string {
  return `tel:${phoneNumber.replace(/[^\d+]/g, '')}`
}

export function getEmailLink(): string {
  const subject = 'Safari Inquiry - Pembe Africa Safaris'
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}`
}

export function getReviewRequestWhatsAppLink(
  phone: string | null | undefined,
  reviewLink: string,
  customerName?: string | null
): string | null {
  const digits = (phone ?? '').replace(/\D/g, '')
  if (!digits) return null

  const firstName = customerName?.trim().split(/\s+/)[0]
  const greeting = firstName ? `Hi ${firstName}, ` : 'Hi, '
  const message = `${greeting}thank you for travelling with Pembe Africa Safaris! We'd love to hear about your safari. Please share a quick review here: ${reviewLink}`

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export function getContactUrl(packageSlug?: string): string {
  return packageSlug ? `/contact?package=${encodeURIComponent(packageSlug)}` : '/contact'
}
