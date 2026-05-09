// app/(routes)/safaris/[id]/page.tsx
import Image from 'next/image'
import { notFound } from 'next/navigation'

// This is a dynamic route for individual safari pages
export default function SafariPage({ params }: { params: { id: string } }) {
  // You would fetch safari data based on the ID
  // For now, we'll show a placeholder
  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold mb-4">
          Safari Details: {params.id}
        </h1>
        <p className="text-gray-600">
          This page is under construction. Check back soon for detailed safari information.
        </p>
      </div>
    </div>
  )
}