// app/(routes)/safaris/page.tsx
import { supabase } from '@/lib/supabase/client'
import FeaturedSafaris from '@/components/sections/FeaturedSafaris'

async function getAllPackages() {
  const { data: packages, error } = await supabase
    .from('packages')
    .select('*')
    .eq('active', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching packages:', error)
    return []
  }

  return packages || []
}

export default async function SafarisPage() {
  const allPackages = await getAllPackages()

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-serif font-bold text-center mb-4">
          Our <span className="text-primary">Safari Packages</span>
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Choose from our carefully curated selection of safari experiences
        </p>
      </div>
      <FeaturedSafaris packages={allPackages} />
    </div>
  )
}