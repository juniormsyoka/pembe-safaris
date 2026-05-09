'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import AuthGuard from '@/components/auth/AuthGuard'
import { supabaseAdmin, isAdminClientReady } from '@/lib/supabase/admin'
import { Package, Plus, Eye, TrendingUp, Calendar, Users } from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalPackages: number
  activePackages: number
  featuredPackages: number
  totalBookings: number
  totalRevenue: number
}

function DashboardContent() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    totalPackages: 0,
    activePackages: 0,
    featuredPackages: 0,
    totalBookings: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!isAdminClientReady()) {
        setError('Supabase admin client is not configured')
        return
      }

      // Fetch packages stats
      const { data: packages, error: packagesError } = await supabaseAdmin
        .from('packages')
        .select('*')

      if (packagesError) throw packagesError

      // Fetch bookings stats
      const { data: bookings, error: bookingsError } = await supabaseAdmin
        .from('bookings')
        .select('*')

      if (bookingsError && !bookingsError.message.includes('does not exist')) {
        console.warn('Bookings table may not exist yet:', bookingsError)
      }

      // Calculate stats
      const activePackages = packages?.filter(p => p.active === true).length || 0
      const featuredPackages = packages?.filter(p => p.featured === true).length || 0
      const totalRevenue = bookings?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0

      setStats({
        totalPackages: packages?.length || 0,
        activePackages: activePackages,
        featuredPackages: featuredPackages,
        totalBookings: bookings?.length || 0,
        totalRevenue: totalRevenue,
      })
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch stats')
    } finally {
      setLoading(false)
    }
  }

  // Stat cards
  const statCards = [
    {
      label: 'Total Packages',
      value: stats.totalPackages,
      subValue: `${stats.activePackages} active`,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      label: 'Featured Packages',
      value: stats.featuredPackages,
      subValue: 'Highlighted on homepage',
      icon: TrendingUp,
      color: 'bg-primary',
    },
    {
      label: 'Total Bookings',
      value: stats.totalBookings,
      subValue: 'All time bookings',
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      label: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      subValue: 'From all bookings',
      icon: Users,
      color: 'bg-purple-500',
    },
  ]

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Dashboard</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchDashboardStats}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {session?.user?.name || session?.user?.email}
        </p>
        {session?.user?.image && (
          <div className="mt-2 flex items-center gap-2">
            <img 
              src={session.user.image} 
              alt="Profile" 
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm text-gray-600">{session.user.email}</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className={`${stat.color} p-3 rounded-lg w-fit mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
              {stat.subValue && (
                <p className="text-xs text-gray-400 mt-1">{stat.subValue}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link 
            href="/admin/packages/new"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-5 h-5 text-primary" />
            <div>
              <p className="font-semibold">Add New Package</p>
              <p className="text-sm text-gray-500">Create a new special package</p>
            </div>
          </Link>
          <Link 
            href="/admin/packages"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Package className="w-5 h-5 text-primary" />
            <div>
              <p className="font-semibold">Manage Packages</p>
              <p className="text-sm text-gray-500">Edit, publish or delete packages</p>
            </div>
          </Link>
          <Link 
            href="/"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Eye className="w-5 h-5 text-primary" />
            <div>
              <p className="font-semibold">View Website</p>
              <p className="text-sm text-gray-500">See your live site</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}