import Link from 'next/link'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <Compass className="w-24 h-24 text-primary mx-auto mb-6" />
        <h1 className="text-6xl font-serif text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Looks like you've ventured off the safari path. Let's get you back on track.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Return to Home
        </Link>
      </div>
    </div>
  )
}