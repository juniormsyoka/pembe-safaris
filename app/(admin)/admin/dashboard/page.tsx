'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import AuthGuard from '@/components/auth/AuthGuard'
import {
  Package,
  Plus,
  Eye,
  LogOut,
  Activity,
  CheckCircle,
  Clock,
  MessageSquare,
  Star,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

interface DashboardStats {
  totalPackages: number
  activePackages: number
}

interface Review {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  submitted_at: string | null
}

function DashboardContent() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    totalPackages: 0,
    activePackages: 0,
  })
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [packagesResponse, reviewsResponse] = await Promise.all([
        fetch('/api/admin/packages', { cache: 'no-store' }),
        fetch('/api/admin/reviews', { cache: 'no-store' }),
      ])

      if (!packagesResponse.ok) {
        throw new Error('Failed to fetch packages')
      }

      const packages = await packagesResponse.json()
      const reviewsData = reviewsResponse.ok ? await reviewsResponse.json() : []

      const activePackages = packages?.filter((p: any) => p.active === true).length || 0

      setStats({
        totalPackages: packages?.length || 0,
        activePackages,
      })
      setReviews(Array.isArray(reviewsData) ? reviewsData : [])
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const awaitingCount = reviews.filter((review) => !review.submitted_at).length
  const toModerateCount = reviews.filter(
    (review) => review.submitted_at && review.status === 'pending'
  ).length
  const approvedCount = reviews.filter((review) => review.status === 'approved').length

  const statCards = [
    {
      label: 'Total Packages',
      value: stats.totalPackages,
      subValue: 'All safari packages',
      icon: Package,
      color: 'text-[#2A1810]',
      bg: 'bg-[#2A1810]/5',
    },
    {
      label: 'Active Packages',
      value: stats.activePackages,
      subValue: 'Live on the website',
      icon: CheckCircle,
      color: 'text-[#C97A2B]',
      bg: 'bg-[#C97A2B]/10',
    },
  ]

  const quickActions = [
    {
      title: 'Add New Package',
      description: 'Create a new special package',
      icon: Plus,
      href: '/admin/packages/new',
      accent: 'text-[#C97A2B]',
      bg: 'bg-[#C97A2B]/10',
    },
    {
      title: 'Manage Packages',
      description: 'Edit, publish or delete packages',
      icon: Package,
      href: '/admin/packages',
      accent: 'text-[#2A1810]',
      bg: 'bg-[#2A1810]/5',
    },
    {
      title: 'Manage Reviews',
      description: 'Request links and moderate submissions',
      icon: Star,
      href: '/admin/reviews',
      accent: 'text-[#C97A2B]',
      bg: 'bg-[#C97A2B]/10',
    },
    {
      title: 'View Website',
      description: 'See your live site',
      icon: Eye,
      href: '/',
      accent: 'text-gray-500',
      bg: 'bg-gray-100',
    },
  ]

  if (loading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#C97A2B]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="w-6 h-6 text-[#C97A2B] animate-pulse" />
            </div>
          </div>
          <p className="text-[#2A1810]/60 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-2xl mx-auto mt-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-red-800 font-serif text-xl font-bold mb-2">Error Loading Dashboard</h3>
        <p className="text-red-600 mb-6">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-6 py-2.5 bg-[#2A1810] text-[#FAF2EB] rounded-full hover:bg-[#C97A2B] transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-[#2A1810] rounded-[24px] p-8 sm:p-10 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C97A2B]/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#FAF2EB] mb-2 tracking-tight">
                Administration Panel
              </h1>
              <p className="text-[#FAF2EB]/70 text-base md:text-lg">
                Welcome back, {session?.user?.name || session?.user?.email}
              </p>
            </div>

            {session?.user && (
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5">
                <div className="w-10 h-10 rounded-full bg-[#C97A2B] flex items-center justify-center shadow-inner">
                  <span className="text-[#FAF2EB] font-bold text-sm">
                    {session.user.name
                      ? session.user.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)
                      : session.user.email?.[0].toUpperCase() || '?'}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-[#FAF2EB] text-sm font-semibold">{session.user.name}</p>
                  <p className="text-[#FAF2EB]/60 text-xs">{session.user.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="group relative overflow-hidden bg-white border border-[#2A1810]/10 rounded-[24px] p-6 sm:p-8 hover:shadow-[0_14px_34px_rgba(42,24,16,0.08)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className={`text-4xl font-serif font-bold ${stat.color} mb-1`}>{stat.value}</h3>
                  <p className="text-[#2A1810] font-semibold text-sm">{stat.label}</p>
                  <p className="text-[#2A1810]/50 text-xs mt-1">{stat.subValue}</p>
                </div>
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Reviews */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col justify-between rounded-[24px] border border-[#2A1810]/10 bg-white p-5 shadow-[0_8px_30px_rgba(42,24,16,0.04)] sm:p-6 lg:col-span-2">
          <div>
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-[#C97A2B]/10 p-3 text-[#C97A2B]">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-[#2A1810]">Request a review</h2>
                <p className="mt-1 text-sm text-[#2A1810]/60">
                  Create a standalone review link for a customer without a booking.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/admin/reviews?request=1"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#C97A2B] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#b06922] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              Request a review
            </Link>
            <Link
              href="/admin/reviews"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#2A1810]/10 bg-white px-5 py-2.5 text-sm font-semibold text-[#2A1810] transition-all hover:border-[#C97A2B]/40 hover:text-[#C97A2B]"
            >
              Go to reviews
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#2A1810]/10 bg-white p-5 shadow-[0_8px_30px_rgba(42,24,16,0.04)] sm:p-6">
          <h2 className="text-xl font-serif font-bold text-[#2A1810]">Review status</h2>
          <p className="mt-1 text-sm text-[#2A1810]/60">Current review pipeline.</p>

          <div className="mt-5 space-y-2">
            <div className="flex min-h-11 items-center justify-between gap-3 rounded-xl bg-[#FAF2EB] px-4 py-3">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-[#2A1810]">
                <Clock className="h-4 w-4 text-amber-600" />
                Awaiting
              </span>
              <span className="text-xl font-serif font-bold text-[#2A1810]">{awaitingCount}</span>
            </div>
            <div className="flex min-h-11 items-center justify-between gap-3 rounded-xl bg-[#FAF2EB] px-4 py-3">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-[#2A1810]">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                To moderate
              </span>
              <span className="text-xl font-serif font-bold text-[#2A1810]">{toModerateCount}</span>
            </div>
            <div className="flex min-h-11 items-center justify-between gap-3 rounded-xl bg-[#FAF2EB] px-4 py-3">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-[#2A1810]">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Approved
              </span>
              <span className="text-xl font-serif font-bold text-[#2A1810]">{approvedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgba(42,24,16,0.04)] overflow-hidden border border-[#2A1810]/10">
        <div className="bg-[#FAF2EB]/50 px-6 sm:px-8 py-6 border-b border-[#2A1810]/10">
          <h2 className="text-xl font-serif font-bold text-[#2A1810]">Quick Actions</h2>
          <p className="text-[#2A1810]/60 text-sm mt-1">Manage your safari packages and reviews</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 sm:p-8">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group relative flex items-start gap-4 bg-white border border-[#2A1810]/10 rounded-2xl p-5 hover:border-[#C97A2B]/50 hover:shadow-[0_8px_20px_rgba(201,122,43,0.08)] transition-all duration-300"
              >
                <div className={`p-3 rounded-xl ${action.bg} ${action.accent} flex-shrink-0 transition-transform group-hover:scale-110`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#2A1810] mb-1 group-hover:text-[#C97A2B] transition-colors">{action.title}</h3>
                  <p className="text-sm text-[#2A1810]/60 leading-snug">{action.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Logout Section */}
      <div className="pt-4 flex justify-center">
        <button
          onClick={() => signOut({ callbackUrl: '/admin-login' })}
          className="group flex items-center justify-center gap-2 px-6 py-3 bg-transparent hover:bg-red-50 text-red-600 rounded-full transition-all duration-300 font-semibold border border-transparent hover:border-red-200"
        >
          <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Logout from Administration Panel</span>
        </button>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#FAF2EB]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <DashboardContent />
        </div>
      </div>
    </AuthGuard>
  )
}
