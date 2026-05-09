'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-serif text-primary mb-4">Oops!</h1>
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-8">We're working on fixing this issue.</p>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="btn-primary inline-block"
          >
            Try again
          </button>
          <Link href="/" className="btn-secondary inline-block">
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}