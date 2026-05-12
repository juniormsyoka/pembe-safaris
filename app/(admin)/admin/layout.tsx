'use client'

import AuthGuard from '@/components/auth/AuthGuard'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Package, Plus, LayoutDashboard, LogOut } from 'lucide-react'

function AdminNav() {
  const pathname = usePathname()
  
  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/packages', label: 'All Packages', icon: Package },
    { href: '/admin/packages/new', label: 'Add Package', icon: Plus },
  ]

  return (
    <div className="fixed left-0 top-0 w-64 h-full bg-white shadow-xl z-50 overflow-y-auto">
      <div className="p-6 border-b">
        <h2 className="text-xl font-serif font-bold">
          Pembe  <span className="text-primary">Africa Safaris</span><span className="text-primary">Admin</span>
        </h2>
        <p className="text-xs text-gray-500 mt-1">Administration Panel</p>
      </div>
      
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <AdminNav />
        <main className="ml-64 min-h-screen p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}