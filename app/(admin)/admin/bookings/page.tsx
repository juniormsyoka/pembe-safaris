// app/admin/bookings/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import AuthGuard from '@/components/auth/AuthGuard'
import Link from 'next/link'
import { Plus, Search, Calendar, Users, ChevronRight, Package, Activity } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface Booking {
  id: string
  booking_reference: string
  customer_name: string
  customer_email: string
  customer_phone: string
  number_of_travelers: number
  preferred_date: string
  status: string
  created_at: string
  package_id: string
}

function BookingsContent() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (status === 'authenticated') {
      fetchBookings()
    }
  }, [status])

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBookings = bookings.filter(booking =>
    booking.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    booking.booking_reference?.toLowerCase().includes(search.toLowerCase()) ||
    booking.customer_email?.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
      pending: 'bg-amber-50 text-amber-700 border border-amber-200/60',
      cancelled: 'bg-rose-50 text-rose-700 border border-rose-200/60',
      completed: 'bg-blue-50 text-blue-700 border border-blue-200/60'
    }
    return styles[status] || 'bg-gray-100 text-gray-700 border border-gray-200'
  }

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-[#FAF2EB]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#C97A2B]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="w-6 h-6 text-[#C97A2B] animate-pulse" />
            </div>
          </div>
          <p className="text-[#2A1810]/70 font-medium text-sm">Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1F1109] rounded-[32px] p-6 sm:p-8 text-[#FAF2EB] shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C97A2B]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <span className="text-[#C97A2B] font-semibold tracking-widest uppercase text-xs block mb-1">
            Reservations
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#FAF2EB]">Bookings Management</h1>
          <p className="text-[#FAF2EB]/70 text-sm mt-1">Review, track, and manage all client safari bookings</p>
        </div>
        <Link
          href="/admin/bookings/new"
          className="relative z-10 flex items-center gap-2 bg-[#C97A2B] hover:bg-[#b06922] text-[#FAF2EB] px-6 py-3 rounded-2xl font-semibold transition-all shadow-md text-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          New Booking
        </Link>
      </div>
      
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2A1810]/40" />
        <input
          type="text"
          placeholder="Search by name, reference, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-[#2A1810]/10 rounded-2xl focus:ring-2 focus:ring-[#C97A2B] focus:outline-none text-sm text-[#2A1810] shadow-sm"
        />
      </div>
      
      {/* Bookings Table */}
      <div className="bg-white rounded-[32px] shadow-[0_10px_30px_rgba(42,24,16,0.05)] border border-[#2A1810]/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#FAF2EB]/60 border-b border-[#2A1810]/10 text-xs font-semibold text-[#2A1810]/70 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Travelers</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1810]/5 text-sm">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-[#FAF2EB]/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono font-semibold text-[#C97A2B] bg-[#C97A2B]/10 px-2.5 py-1 rounded-lg text-xs">
                      {booking.booking_reference}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-[#2A1810]">{booking.customer_name}</p>
                      <p className="text-xs text-[#2A1810]/60">{booking.customer_email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-[#2A1810]/80 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#C97A2B]" />
                      {new Date(booking.preferred_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-[#2A1810]/80 font-medium">
                      <Users className="w-3.5 h-3.5 text-[#C97A2B]" />
                      {booking.number_of_travelers}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/track/${booking.booking_reference}`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#FAF2EB] text-[#2A1810] hover:bg-[#C97A2B] hover:text-white transition-all shadow-sm"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredBookings.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-[#2A1810]/20 mx-auto mb-3" />
            <p className="text-[#2A1810]/60 font-medium">No bookings found</p>
          </div>
        )}
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-[28px] p-6 border border-[#2A1810]/5 shadow-[0_10px_30px_rgba(42,24,16,0.05)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[#2A1810]/60 uppercase tracking-wider font-medium mb-1">Total Bookings</p>
            <p className="text-3xl font-serif font-bold text-[#2A1810]">{bookings.length}</p>
          </div>
          <div className="p-3 rounded-2xl bg-[#FAF2EB] text-[#C97A2B]">
            <Package className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white rounded-[28px] p-6 border border-[#2A1810]/5 shadow-[0_10px_30px_rgba(42,24,16,0.05)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[#2A1810]/60 uppercase tracking-wider font-medium mb-1">Confirmed</p>
            <p className="text-3xl font-serif font-bold text-emerald-600">
              {bookings.filter(b => b.status === 'confirmed').length}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white rounded-[28px] p-6 border border-[#2A1810]/5 shadow-[0_10px_30px_rgba(42,24,16,0.05)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[#2A1810]/60 uppercase tracking-wider font-medium mb-1">Pending</p>
            <p className="text-3xl font-serif font-bold text-amber-600">
              {bookings.filter(b => b.status === 'pending').length}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookingsList() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#FAF2EB] text-[#2A1810]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <BookingsContent />
        </div>
      </div>
    </AuthGuard>
  )
}