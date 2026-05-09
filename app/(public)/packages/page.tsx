import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Users, Clock } from 'lucide-react'

// This would normally come from your database
const specialPackages = [
  {
    id: 1,
    title: "Kilimanjaro Trekking & Tanzania Safari Experience",
    subtitle: "Trekking and Tanzania safari Experience",
    duration: "14 Days / 13 Nights",
    price: null,
    image: "/images/packages/kilimanjaro-safari.jpg",
    description: "Experience the ultimate adventure combining the majestic Mount Kilimanjaro trek with an unforgettable Tanzania safari.",
    highlights: ["Mountain trekking", "Wildlife safaris", "Local culture"],
    featured: true
  },
  {
    id: 2,
    title: "Zara Tanzania Charity with Adventure",
    subtitle: "Kilimanjaro Rongai Route Trekking",
    duration: "8 Days / 7 Nights",
    price: null,
    image: "/images/packages/zara-charity.jpg",
    description: "Combine charity work with adventure on this unique Kilimanjaro climbing experience.",
    highlights: ["Charity work", "Mountain climbing", "Community engagement"],
    featured: true
  },
  {
    id: 3,
    title: "Kilimanjaro climb with Zara Tanzania charity",
    subtitle: "Moshi to Rongai Gate | Simba Camp",
    duration: "7 Days / 6 Nights",
    price: null,
    image: "/images/packages/kilimanjaro-charity.jpg",
    description: "Join our charity climb and make a difference while conquering Africa's highest peak.",
    highlights: ["Charity climb", "Professional guides", "Camping experience"],
    featured: true
  },
  {
    id: 4,
    title: "Kilimanjaro International Womens Day March 2024",
    subtitle: "Celebrating Women in Adventure",
    duration: "9 Days / 8 Nights",
    price: "$1,777 | Per Person",
    image: "/images/packages/womens-day.jpg",
    description: "Special women's day celebration climb celebrating diversity and empowerment.",
    highlights: ["Women-led expedition", "Empowerment focus", "Special ceremonies"],
    featured: true
  }
]

export default function PackagesPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-gradient-to-r from-primary/20 to-accent/20">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex items-center justify-center text-center">
          <div className="px-4">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">
              Special Packages
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Curated adventures for the discerning traveler seeking extraordinary experiences
            </p>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialPackages.map((pkg) => (
            <div key={pkg.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {pkg.featured && (
                  <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {pkg.subtitle && (
                  <p className="text-primary text-sm font-semibold mb-2">
                    {pkg.subtitle}
                  </p>
                )}
                <h3 className="font-serif text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {pkg.title}
                </h3>
                
                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <Clock className="w-4 h-4 mr-2 text-primary" />
                  {pkg.duration}
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {pkg.description}
                </p>

                {pkg.price && (
                  <div className="text-2xl font-bold text-primary mb-4">
                    {pkg.price}
                  </div>
                )}

                <div className="flex gap-3">
                  <Link
                    href={`/packages/${pkg.id}`}
                    className="flex-1 text-center px-4 py-2 border border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
                  >
                    Read More
                  </Link>
                  <Link
                    href={`/book?package=${pkg.id}`}
                    className="flex-1 text-center px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}