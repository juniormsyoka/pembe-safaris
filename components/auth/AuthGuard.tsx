'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
  allowedEmails?: string[] // Optional: restrict to specific emails
}

export default function AuthGuard({ children, allowedEmails }: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin-login')
    }
    
    if (status === 'authenticated' && allowedEmails) {
      const userEmail = session?.user?.email
      if (userEmail && !allowedEmails.includes(userEmail)) {
        router.push('/admin/unauthorized')
      }
    }
  }, [status, router, session, allowedEmails])

  if (status === 'loading') {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (status === 'authenticated') {
    return <>{children}</>
  }

  return null
}