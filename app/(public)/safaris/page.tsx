// app/(public)/safaris/page.tsx
//import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/admin'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Clock, Users, Star } from 'lucide-react'
import { getContactUrl, getWhatsAppEnquiryLink } from '@/lib/contact'

async function getAllPackages() {
  const { data: packages, error } = await supabaseAdmin
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
      <div className="min-h-screen pt-32 pb-20 bg-[#FAF2EB] text-[#2A1810] flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-3xl font-serif font-bold mb-4">No Safaris Found</h1>
          <p className="text-[#2A1810]/70">Check back soon for amazing safari packages!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#FAF2EB] text-[#2A1810]">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-[#F5E3D2]/60 to-transparent py-12 md:py-16 mb-8">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6 text-center">
          <span className="text-[#C97A2B] font-semibold tracking-widest uppercase text-xs md:text-sm block mb-2">
            Explore Kenya
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 leading-[1.1]">
            Our <em className="font-normal text-[#C97A2B]">Safari Packages</em>
          </h1>
          <p className="text-[#2A1810]/75 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover authentic Kenyan safari experiences tailored just for you
          </p>
          <p className="text-xs md:text-sm text-[#2A1810]/55 mt-4 font-medium">
            Showing {allPackages.length} amazing adventures
          </p>
        </div>
      </div>

      {/* Safari Grid */}
      <div className="max-w-[1240px] mx-auto px-4 md:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPackages.map((pkg) => (
            <div 
              key={pkg.id} 
              className="group bg-white rounded-[26px] overflow-hidden shadow-[0_10px_30px_rgba(42,24,16,0.08)] hover:shadow-[0_20px_45px_rgba(42,24,16,0.18)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-[#E5A663]">
                {pkg.main_image ? (
                  <Image
                    src={pkg.main_image}
                    alt={pkg.title}
                    fill
                    className="object-cover group-hover:scale-107 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#F5E3D2]">
                    <span className="text-[#2A1810]/50 text-sm">No image</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(42,24,16,0.55)] via-transparent to-transparent" />
                
                {/* Badge if exists */}
                {pkg.badge && (
                  <span className="absolute top-4 left-4 bg-[#C97A2B] text-[#FAF2EB] px-3 py-1 rounded-full text-xs font-semibold z-10 shadow-md tracking-wide">
                    {pkg.badge}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-serif text-xl font-bold text-[#2A1810] mb-2 group-hover:text-[#C97A2B] transition-colors line-clamp-1">
                  {pkg.title}
                </h3>
                
                {/* Location */}
                <div className="flex items-center gap-2 text-[#2A1810]/70 mb-3 text-sm">
                  <MapPin className="w-4 h-4 text-[#C97A2B] flex-shrink-0" />
                  <span className="line-clamp-1">{pkg.location}</span>
                </div>

                {/* Duration & Group Size */}
                <div className="flex flex-wrap gap-4 mb-4 text-xs sm:text-sm text-[#2A1810]/60">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#C97A2B]" />
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#C97A2B]" />
                    <span>{pkg.group_size}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[#2A1810]/75 text-sm mb-5 line-clamp-2 leading-relaxed">
                  {pkg.description}
                </p>

                {/* Quote & Rating */}
                <div className="flex items-center justify-between mb-4 pt-4 border-t border-[#2A1810]/10 mt-auto">
                  <span className="text-sm font-semibold text-[#2A1810]/70">Tailored quote</span>
                  
                  {parseFloat(pkg.rating) > 0 && (
                    <div className="flex items-center gap-1 bg-[#FAF2EB] px-2.5 py-1 rounded-full text-xs font-semibold text-[#2A1810]">
                      <Star className="w-3.5 h-3.5 text-[#C97A2B] fill-current" />
                      <span>{pkg.rating}</span>
                      <span className="text-[#2A1810]/50">({pkg.reviews_count})</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <a
                    href={getWhatsAppEnquiryLink(pkg.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-[#C97A2B] text-[#FAF2EB] py-3 rounded-2xl font-semibold hover:bg-[#b06521] transition-colors duration-300 text-sm tracking-wide"
                  >
                    Enquire on WhatsApp
                  </a>
                  <div className="flex gap-2">
                    <Link
                      href={`/safaris/${pkg.id}`}
                      className="flex-1 text-center border border-[#2A1810]/20 text-[#2A1810] py-2.5 rounded-2xl font-semibold hover:bg-[#2A1810] hover:text-[#FAF2EB] transition-colors duration-300 text-xs sm:text-sm"
                    >
                      View Details
                    </Link>
                    <Link
                      href={getContactUrl(pkg.slug || pkg.id)}
                      className="flex-1 text-center border border-[#2A1810]/20 text-[#2A1810] py-2.5 rounded-2xl font-semibold hover:bg-[#FAF2EB] transition-colors duration-300 text-xs sm:text-sm"
                    >
                      Send a message
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}