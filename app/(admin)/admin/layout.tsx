'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import AuthGuard from '@/components/auth/AuthGuard'

const ADMIN_LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/packages', label: 'Packages' },
  { href: '/admin/reviews', label: 'Reviews' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#1F1109] text-[#F5E3D2]">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link
              href="/admin/dashboard"
              className="whitespace-nowrap font-serif text-base font-bold tracking-wide sm:text-lg"
            >
              Pembe Admin
            </Link>
            <nav
              aria-label="Admin"
              className="flex items-center gap-1 overflow-x-auto sm:gap-2"
            >
              {ADMIN_LINKS.map((link) => {
                const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5A663] sm:text-sm ${
                      active
                        ? 'bg-[#C97A2B] text-[#FAF2EB]'
                        : 'text-[#F5E3D2]/80 hover:bg-white/10 hover:text-[#FAF2EB]'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
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