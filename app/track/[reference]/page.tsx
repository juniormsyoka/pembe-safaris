// app/track/[reference]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Mail, 
  Phone, 
  User, 
  Package, 
  Clock, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import StatusUpdater from '@/components/admin/StatusUpdater'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: {
    reference: string
  }
}

async function getBookingByReference(reference: string) {
  const { data: booking, error } = await supabase
    .from('bookings')
    .select(`
      *,
      packages (
        id,
        title,
        duration,
        location,
        description
      )
    `)
    .eq('booking_reference', reference)
    .single()

  if (error || !booking) {
    return null
  }

  return booking
}

function getStatusConfig(status: string) {
  const configs: Record<string, { icon: any; color: string; bgColor: string; label: string }> = {
    confirmed: {
      icon: CheckCircle,
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      label: 'Confirmed'
    },
    pending: {
      icon: AlertCircle,
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-100',
      label: 'Pending Payment'
    },
    cancelled: {
      icon: XCircle,
      color: 'text-red-700',
      bgColor: 'bg-red-100',
      label: 'Cancelled'
    },
    completed: {
      icon: CheckCircle,
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      label: 'Completed'
    }
  }
  return configs[status] || configs.pending
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export default async function TrackBookingPage({ params }: PageProps) {
  const booking = await getBookingByReference(params.reference)

  if (!booking) {
    notFound()
  }

  const statusConfig = getStatusConfig(booking.status)
  const StatusIcon = statusConfig.icon

  // Available status options for dropdown
  const statusOptions = [
    { value: 'pending', label: 'Pending Payment', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
    { value: 'confirmed', label: 'Confirmed', color: 'text-green-700', bgColor: 'bg-green-100' },
    { value: 'completed', label: 'Completed', color: 'text-blue-700', bgColor: 'bg-blue-100' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-red-700', bgColor: 'bg-red-100' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 md:py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Bookings</span>
        </Link>

        {/* Booking Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 md:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Booking Reference</p>
                <h1 className="text-2xl md:text-3xl font-mono font-bold text-white tracking-wider">
                  {booking.booking_reference}
                </h1>
              </div>
            {/*}  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bgColor}`}>
                <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                <span className={`text-sm font-semibold ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>*/}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8 space-y-8">
            {/* Status Update Section */}
            <section className="bg-amber-50 border border-amber-200 rounded-lg p-4 md:p-6">
              <div className="flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Update Booking Status</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Change the status of this booking. The customer will not be notified automatically.
                  </p>
                  <StatusUpdater 
                    bookingId={booking.id} 
                    currentStatus={booking.status}
                    statusOptions={statusOptions}
                  />
                </div>
              </div>
            </section>

            {/* Customer Information */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                <User className="w-5 h-5 text-primary" />
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">{booking.customer_name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <a href={`mailto:${booking.customer_email}`} className="font-medium text-primary hover:underline">
                      {booking.customer_email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <a href={`tel:${booking.customer_phone}`} className="font-medium text-gray-900 hover:text-primary">
                      {booking.customer_phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Booking Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Safari Details */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                <Package className="w-5 h-5 text-primary" />
                Safari Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Package</p>
                    <p className="font-medium text-gray-900">
                      {booking.packages?.title || 'Custom Package'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Travel Date</p>
                    <p className="font-medium text-gray-900">{formatDate(booking.preferred_date)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Number of Travelers</p>
                    <p className="font-medium text-gray-900">
                      {booking.number_of_travelers} {booking.number_of_travelers === 1 ? 'person' : 'people'}
                    </p>
                  </div>
                </div>
                {booking.packages?.duration && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium text-gray-900">{booking.packages.duration}</p>
                    </div>
                  </div>
                )}
                {booking.packages?.location && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">{booking.packages.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Special Requests */}
            {booking.special_requests && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Special Requests
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{booking.special_requests}</p>
                </div>
              </section>
            )}

            {/* Payment Summary */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Payment Summary
              </h2>
              <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-lg p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-3xl font-bold text-primary">
                      {formatCurrency(booking.total_price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Price per traveler</p>
                    <p className="text-lg font-semibold text-gray-700">
                      {formatCurrency(booking.total_price / booking.number_of_travelers)}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Help Section */}
            <section className="bg-gray-50 rounded-lg p-4 md:p-6">
              <div className="text-center">
                <p className="text-gray-700 mb-3 font-medium">Need assistance with this booking?</p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <a
                    href={`mailto:${booking.customer_email}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:border-primary hover:text-primary transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Customer</span>
                  </a>
                  <a
                    href={`https://wa.me/${booking.customer_phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>WhatsApp Customer</span>
                  </a>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 md:px-8 py-4 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              Booking created on {new Date(booking.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}