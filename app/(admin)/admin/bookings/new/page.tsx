// app/admin/bookings/new/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import AuthGuard from '@/components/auth/AuthGuard'
import { supabase } from '@/lib/supabase/client'
import { Calendar, Users, Phone, Mail, User, DollarSign, AlertCircle, CheckCircle, Package, Activity } from 'lucide-react'

interface PackageItem {
  id: string
  title: string
  price: number
  duration: string
}

function NewBookingContent() {
  const router = useRouter()
  const { status } = useSession()
  const [packages, setPackages] = useState<PackageItem[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    package_id: '',
    preferred_date: '',
    number_of_travelers: 1,
    special_requests: '',
    total_price: 0,
    status: 'confirmed'
  })

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPackages()
    }
  }, [status])

  const fetchPackages = async () => {
    const { data } = await supabase
      .from('packages')
      .select('id, title, price, duration')
      .eq('active', true)
      .order('title')
    
    if (data) setPackages(data)
  }

  const handlePackageChange = (packageId: string) => {
    const selectedPackage = packages.find(p => p.id === packageId)
    setFormData({
      ...formData,
      package_id: packageId,
      total_price: selectedPackage?.price || 0
    })
  }

  const generateBookingReference = () => {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0')
    return `PEM-${year}-${random}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const bookingReference = generateBookingReference()
      
      const { error: insertError } = await supabase
        .from('bookings')
        .insert({
          package_id: formData.package_id,
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          number_of_travelers: formData.number_of_travelers,
          preferred_date: formData.preferred_date,
          special_requests: formData.special_requests || null,
          total_price: formData.total_price,
          status: formData.status,
          booking_reference: bookingReference,
          created_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (insertError) throw insertError
      
      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/bookings')
      }, 2000)
      
    } catch (err: any) {
      console.error('Error creating booking:', err)
      setError(err.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="bg-white border border-[#2A1810]/10 rounded-[32px] p-8 sm:p-12 text-center shadow-xl max-w-md w-full">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#2A1810] mb-2">Booking Created</h2>
          <p className="text-[#2A1810]/75 text-sm">Booking has been successfully registered.</p>
          <p className="text-xs text-[#C97A2B] font-semibold mt-4">Redirecting to bookings list...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-[#1F1109] rounded-[32px] p-6 sm:p-8 text-[#FAF2EB] shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C97A2B]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <span className="text-[#C97A2B] font-semibold tracking-widest uppercase text-xs block mb-1">
            Reservations
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#FAF2EB]">Create New Booking</h1>
          <p className="text-[#FAF2EB]/70 text-sm mt-1">Fill in customer and safari details to manually register a booking</p>
        </div>
      </div>
      
      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-[32px] shadow-[0_10px_30px_rgba(42,24,16,0.05)] border border-[#2A1810]/5 overflow-hidden">
        
        {/* Customer Information */}
        <div className="p-6 sm:p-8 border-b border-[#2A1810]/5 space-y-6">
          <h2 className="text-lg font-serif font-bold text-[#2A1810] flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FAF2EB] text-[#C97A2B]">
              <User className="w-4 h-4" />
            </div>
            Customer Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A1810]/70 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.customer_name}
                onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                className="w-full px-4 py-3 bg-[#FAF2EB]/40 border border-[#2A1810]/10 rounded-2xl focus:ring-2 focus:ring-[#C97A2B] focus:outline-none text-sm text-[#2A1810]"
                placeholder="John Doe"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A1810]/70 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2A1810]/40" />
                  <input
                    type="email"
                    required
                    value={formData.customer_email}
                    onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 bg-[#FAF2EB]/40 border border-[#2A1810]/10 rounded-2xl focus:ring-2 focus:ring-[#C97A2B] focus:outline-none text-sm text-[#2A1810]"
                    placeholder="customer@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A1810]/70 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2A1810]/40" />
                  <input
                    type="tel"
                    required
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 bg-[#FAF2EB]/40 border border-[#2A1810]/10 rounded-2xl focus:ring-2 focus:ring-[#C97A2B] focus:outline-none text-sm text-[#2A1810]"
                    placeholder="+254 729 436 767"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Safari Details */}
        <div className="p-6 sm:p-8 border-b border-[#2A1810]/5 space-y-6">
          <h2 className="text-lg font-serif font-bold text-[#2A1810] flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FAF2EB] text-[#C97A2B]">
              <Package className="w-4 h-4" />
            </div>
            Safari Details
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A1810]/70 mb-2">
                Select Package *
              </label>
              <select
                required
                value={formData.package_id}
                onChange={(e) => handlePackageChange(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAF2EB]/40 border border-[#2A1810]/10 rounded-2xl focus:ring-2 focus:ring-[#C97A2B] focus:outline-none text-sm text-[#2A1810]"
              >
                <option value="">Choose a package...</option>
                {packages.map(pkg => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.title} - ${pkg.price} ({pkg.duration})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A1810]/70 mb-2">
                  Travel Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2A1810]/40" />
                  <input
                    type="date"
                    required
                    value={formData.preferred_date}
                    onChange={(e) => setFormData({...formData, preferred_date: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 bg-[#FAF2EB]/40 border border-[#2A1810]/10 rounded-2xl focus:ring-2 focus:ring-[#C97A2B] focus:outline-none text-sm text-[#2A1810]"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A1810]/70 mb-2">
                  Number of Travelers *
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2A1810]/40" />
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.number_of_travelers}
                    onChange={(e) => setFormData({...formData, number_of_travelers: parseInt(e.target.value)})}
                    className="w-full pl-11 pr-4 py-3 bg-[#FAF2EB]/40 border border-[#2A1810]/10 rounded-2xl focus:ring-2 focus:ring-[#C97A2B] focus:outline-none text-sm text-[#2A1810]"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A1810]/70 mb-2">
                Special Requests
              </label>
              <textarea
                rows={3}
                value={formData.special_requests}
                onChange={(e) => setFormData({...formData, special_requests: e.target.value})}
                className="w-full px-4 py-3 bg-[#FAF2EB]/40 border border-[#2A1810]/10 rounded-2xl focus:ring-2 focus:ring-[#C97A2B] focus:outline-none text-sm text-[#2A1810]"
                placeholder="Dietary restrictions, room preferences, etc."
              />
            </div>
          </div>
        </div>
        
        {/* Payment Information */}
        <div className="p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-serif font-bold text-[#2A1810] flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FAF2EB] text-[#C97A2B]">
              <DollarSign className="w-4 h-4" />
            </div>
            Payment & Status
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A1810]/70 mb-2">
                Total Price (USD) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2A1810]/40" />
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.total_price}
                  onChange={(e) => setFormData({...formData, total_price: parseFloat(e.target.value)})}
                  className="w-full pl-11 pr-4 py-3 bg-[#FAF2EB]/40 border border-[#2A1810]/10 rounded-2xl focus:ring-2 focus:ring-[#C97A2B] focus:outline-none text-sm text-[#2A1810]"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#2A1810]/70 mb-2">
                Booking Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-3 bg-[#FAF2EB]/40 border border-[#2A1810]/10 rounded-2xl focus:ring-2 focus:ring-[#C97A2B] focus:outline-none text-sm text-[#2A1810]"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending Payment</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Error Alert */}
        {error && (
          <div className="mx-8 mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {/* Form Actions */}
        <div className="px-6 sm:px-8 py-5 bg-[#FAF2EB]/50 border-t border-[#2A1810]/10 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/bookings')}
            className="px-6 py-3 text-[#2A1810] hover:bg-white rounded-2xl transition-all font-semibold text-sm border border-transparent hover:border-[#2A1810]/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-[#2A1810] hover:bg-[#C97A2B] text-[#FAF2EB] rounded-2xl font-semibold transition-all shadow-md text-sm disabled:opacity-50 active:scale-95"
          >
            {loading ? 'Creating...' : 'Create Booking'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function NewBooking() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#FAF2EB] text-[#2A1810]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <NewBookingContent />
        </div>
      </div>
    </AuthGuard>
  )
}