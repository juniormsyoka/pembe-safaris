'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation' 
import { useEffect, useState, Suspense } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import Image from 'next/image'

function AdminLoginForm() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 1. Check for NextAuth errors on page load
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam === 'AccessDenied') {
      setError('Unauthorized. Only approved @pembesafaris email addresses can access this portal.')
    }
  }, [searchParams])

  // 2. Redirect if already logged in
  useEffect(() => {
    if (session) {
      router.push('/admin/dashboard')
    }
  }, [session, router])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      await signIn('google', { 
        callbackUrl: '/admin/dashboard',
        redirect: true 
      })
    } catch (err) {
      console.error('Sign in error:', err)
      setError('Authentication failed. Please check your connection and try again.')
      setIsLoading(false)
    }
  }

  // 3. Show loading while checking NextAuth session status
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF2EB]">
        <Loader2 className="w-10 h-10 text-[#C97A2B] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-[#FAF2EB]">
      
      {/* LEFT SIDE: Editorial Image (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#2A1810]">
        <Image
          src="/images/hero/maasai-mara.jpg"
          alt="Pembe Africa Safaris"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A1810] via-[#2A1810]/40 to-transparent" />
        
        <div className="absolute bottom-12 left-12 right-12 z-10">
          <h2 className="font-serif text-4xl font-bold text-[#FAF2EB] mb-4 leading-tight">
            Welcome back to <br />
            <em className="font-normal text-[#C97A2B]">Pembe Africa.</em>
          </h2>
          <p className="text-[#FAF2EB]/70 text-lg max-w-md">
            Manage your safaris, curate unforgettable experiences, and oversee your operations.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#2A1810] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-2xl font-serif font-bold text-[#FAF2EB]">PS</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-[#2A1810] mb-2">Admin Portal</h1>
            <p className="text-[#2A1810]/60">Sign in to access your dashboard</p>
          </div>

          {/* Dynamic Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-red-800">Access Restricted</h3>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border border-[#2A1810]/20 rounded-xl font-semibold text-[#2A1810] shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {/* Official Google G Logo SVG */}
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {isLoading ? 'Redirecting to Google...' : 'Continue with Google'}
          </button>

          {/* Info Box */}
          <div className="mt-8 bg-[#FAF2EB] border border-[#C97A2B]/30 rounded-xl p-5 text-sm">
            <div className="flex items-center gap-2 mb-2">
             
              <p className="font-semibold text-[#2A1810]">Secure Access Only</p>
            </div>
            <p className="text-[#2A1810]/60 text-xs leading-relaxed">
              Only authorized personnel with <strong>@pembesafaris.com</strong> email addresses can access the admin panel. If you believe you should have access, please contact the system administrator.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

// 4. Wrap the component in Suspense to satisfy Next.js useSearchParams requirements
export default function AdminLogin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAF2EB]">
        <Loader2 className="w-10 h-10 text-[#C97A2B] animate-spin" />
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  )
}