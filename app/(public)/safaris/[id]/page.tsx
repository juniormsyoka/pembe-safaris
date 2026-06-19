import { supabaseAdmin } from '@/lib/supabase/admin'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Calendar, Users, Star, Clock, CheckCircle, ArrowLeft} from 'lucide-react'

// Helper function to get package by ID
async function getPackageById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('packages')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function SafariDetailPage({ params }: { params: { id: string } }) {
  // Await params before accessing
  const { id } = await params

  const safari = await getPackageById(id)

  if (!safari) {
    notFound()
  }

  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <div className="relative h-[50vh] overflow-hidden">
        <Image
          src={safari.main_image || '/images/placeholder.jpg'}
          alt={safari.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <div className="max-w-3xl">
              {safari.badge && (
                <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  {safari.badge}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                {safari.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{safari.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{safari.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{safari.group_size}</span>
                </div>
                {safari.rating > 0 && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{safari.rating}</span>
                    <span className="text-white/70">({safari.reviews_count} reviews)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Back Button */}
            <Link
              href="/safaris"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Safaris
            </Link>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-bold mb-4">Overview</h2>
              <p className="text-gray-600 leading-relaxed">{safari.description}</p>
            </div>

            {/* Itinerary */}
            {safari.itinerary && safari.itinerary.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-serif font-bold mb-4">Itinerary</h2>
                <div className="space-y-4">
                  {safari.itinerary.map((day: any, index: number) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800">
                        Day {day.day}: {day.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">{day.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions & Exclusions */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {safari.includes && safari.includes.length > 0 && (
                <div>
                  <h3 className="font-semibold text-green-700 mb-3">✅ Included</h3>
                  <ul className="space-y-2">
                    {safari.includes.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {safari.excludes && safari.excludes.length > 0 && (
                <div>
                  <h3 className="font-semibold text-red-700 mb-3">❌ Excluded</h3>
                  <ul className="space-y-2">
                    {safari.excludes.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-red-400">✕</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Gallery */}
            {safari.images && safari.images.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-serif font-bold mb-4">Gallery</h2>
                <div className="grid grid-cols-3 gap-2">
                  {safari.images.map((image: string, index: number) => (
                    <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary">${safari.price}</div>
                <div className="text-sm text-gray-500">per person</div>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{safari.duration}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Group Size</span>
                  <span className="font-medium">{safari.group_size}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">{safari.location}</span>
                </div>
                {safari.rating > 0 && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-medium flex items-center gap-1">
                      {safari.rating} <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    </span>
                  </div>
                )}
              </div>

              <Link
                href={`/book-now?package=${safari.id}`}
                className="block w-full bg-primary text-white text-center py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors mb-3"
              >
                Book This Safari
              </Link>

              <Link
                href="/contact"
                className="block w-full border border-gray-300 text-gray-700 text-center py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Ask a Question
              </Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}