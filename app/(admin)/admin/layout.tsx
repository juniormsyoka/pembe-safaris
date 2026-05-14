'use client'

import AuthGuard from '@/components/auth/AuthGuard'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      {/* Add top padding to account for fixed/sticky navbar */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16 md:pt-20 lg:pt-24">
        <main className="p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}