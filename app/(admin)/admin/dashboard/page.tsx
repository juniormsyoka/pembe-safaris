'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import AuthGuard from '@/components/auth/AuthGuard'
import { supabaseAdmin, isAdminClientReady } from '@/lib/supabase/admin'
import { Package, Plus, Eye, TrendingUp, Calendar, Users, LogOut, DollarSign, Activity } from 'lucide-react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

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

      const { data: packages, error: packagesError } = await supabaseAdmin
        .from('packages')
        .select('*')

      if (packagesError) throw packagesError

      const { data: bookings, error: bookingsError } = await supabaseAdmin
        .from('bookings')
        .select('*')

      if (bookingsError && !bookingsError.message.includes('does not exist')) {
        console.warn('Bookings table may not exist yet:', bookingsError)
      }

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

  const statCards = [
    {
      label: 'Total Packages',
      value: stats.totalPackages,
      subValue: `${stats.activePackages} active packages`,
      icon: Package,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Featured Packages',
      value: stats.featuredPackages,
      subValue: 'Featured on homepage',
      icon: TrendingUp,
      gradient: 'from-primary to-primary/80',
      bgGradient: 'from-primary/10 to-primary/5',
      textColor: 'text-primary',
      borderColor: 'border-primary/20'
    },
    {
      label: 'Total Bookings',
      value: stats.totalBookings,
      subValue: 'All time bookings',
      icon: Calendar,
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200'
    },
    {
      label: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      subValue: 'From all bookings',
      icon: DollarSign,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200'
    },
  ]

  const quickActions = [
    {
      title: 'Add New Package',
      description: 'Create a new special package',
      icon: Plus,
      href: '/admin/packages/new',
      gradient: 'from-primary to-primary/80',
    },
    {
      title: 'Manage Packages',
      description: 'Edit, publish or delete packages',
      icon: Package,
      href: '/admin/packages',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'View Bookings',
      description: 'Review and manage customer bookings',
      icon: Calendar,
      href: '/admin/bookings',
      gradient: 'from-emerald-500 to-emerald-600',
    },
    {
      title: 'View Website',
      description: 'See your live site',
      icon: Eye,
      href: '/',
      gradient: 'from-gray-600 to-gray-700',
    },
  ]

  if (loading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary animate-pulse" />
            </div>
          </div>
          <p className="text-gray-500 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-red-800 font-semibold text-lg mb-2">Error Loading Dashboard</h3>
        <p className="text-red-600 mb-6 max-w-md mx-auto">{error}</p>
        <button 
          onClick={fetchDashboardStats}
          className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                Administration Panel
              </h1>
              <p className="text-gray-300 text-lg">
                Welcome back, {session?.user?.name || session?.user?.email}
              </p>
            </div>
            {session?.user?.image && (
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <img 
                  src={session.user.image} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full ring-2 ring-white/20"
                />
                <div className="text-left">
                  <p className="text-white text-sm font-medium">{session.user.name}</p>
                  <p className="text-gray-300 text-xs">{session.user.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div 
              key={stat.label} 
              className={`group relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} border ${stat.borderColor} rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-3xl font-bold ${stat.textColor} mb-1`}>{stat.value}</h3>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                {stat.subValue && (
                  <p className="text-xs text-gray-400 mt-2">{stat.subValue}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your safari packages and view bookings</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link 
                key={action.title}
                href={action.href}
                className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-100 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className={`inline-flex p-2.5 rounded-lg bg-gradient-to-r ${action.gradient} shadow-md mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-500">{action.description}</p>
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Logout Section */}
      <div className="pt-4">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="group w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-700 rounded-xl transition-all duration-300 font-medium border border-red-200 hover:shadow-lg"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          <span>Logout from Administration Panel</span>
        </button>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DashboardContent />
        </div>
      </div>
    </AuthGuard>
  )
}