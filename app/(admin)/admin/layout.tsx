'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import AuthGuard from '@/components/auth/AuthGuard'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#1F1109] text-[#F5E3D2]">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link
              href="/admin/dashboard"
              className="whitespace-nowrap font-serif text-base font-bold tracking-wide sm:text-lg"
            >
              PembeAfricaSafaris: Admin
            </Link>
            <nav
              aria-label="Admin"
              className="flex items-center gap-1 overflow-x-auto sm:gap-2"
            >
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/admin-login' })}
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold text-[#F5E3D2]/80 transition-colors hover:bg-white/10 hover:text-[#FAF2EB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5A663] sm:text-sm"
              >
                Sign out
              </button>
            </nav>
          </div>
        </header>
        <main className="p-4 sm:p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}