// app/(public)/safaris/page.tsx
import { supabase } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Clock, Users, Star } from 'lucide-react'

async function getAllPackages() {
  const { data: packages, error } = await supabase
    .from('packages')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching packages:', error)
    return []
  }

  return packages || []
}

export default async function SafarisPage() {
  const allPackages = await getAllPackages()

  if (!allPackages || allPackages.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">No Safaris Found</h1>
          <p className="text-gray-600">Check back soon for amazing safari packages!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 to-transparent py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-4">
            Our <span className="text-primary">Safari Packages</span>
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            Discover authentic Kenyan safari experiences tailored just for you
          </p>
          <p className="text-center text-sm text-gray-500 mt-4">
            Showing {allPackages.length} amazing adventures
          </p>
        </div>
      </div>

      {/* Safari Grid - Shows ALL packages */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPackages.map((pkg) => (
            <div 
              key={pkg.id} 
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-gray-200">
                {pkg.main_image ? (
                  <Image
                    src={pkg.main_image}
                    alt={pkg.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
                
                {/* Badge if exists */}
                {pkg.badge && (
                  <span className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold z-10 shadow-md">
                    {pkg.badge}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                  {pkg.title}
                </h3>
                
                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm line-clamp-1">{pkg.location}</span>
                </div>

                {/* Duration & Group Size */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{pkg.group_size}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {pkg.description}
                </p>

                {/* Price & Rating */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      ${parseFloat(pkg.price).toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-sm"> per person</span>
                  </div>
                  
                  {parseFloat(pkg.rating) > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold">{pkg.rating}</span>
                      <span className="text-xs text-gray-400">({pkg.reviews_count})</span>
                    </div>
                  )}
                </div>

                {/* View Details Button */}
                <Link
                  href={`/safaris/${pkg.id}`}
                  className="block w-full text-center bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-300"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}