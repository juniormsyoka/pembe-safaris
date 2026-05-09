// app/(routes)/destinations/[slug]/page.tsx
import Image from 'next/image'
import { notFound } from 'next/navigation'

// This would typically fetch data based on the slug
export default function DestinationDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  
  // You can add logic here to fetch destination data
  // For now, we'll show a placeholder
  
  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-serif font-bold mb-8 capitalize">
          {slug.replace(/-/g, ' ')}
        </h1>
        <p className="text-gray-600">
         page under construction. Check back soon for detailed information about this destination.
        </p>
      </div>
    </div>
  )
}