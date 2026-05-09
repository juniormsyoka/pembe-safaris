// components/FeaturedSafaris.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, MapPin, Star } from 'lucide-react';

interface SafariPackage {
  id: string;
  title: string;
  location: string;
  duration: string;
  group_size: string;
  price: number;
  rating: number;
  reviews_count: number;
  main_image: string;
  badge: string;
  slug: string;
}

export default function FeaturedSafaris({ packages }: { packages: SafariPackage[] }) {
  if (!packages || packages.length === 0) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <p>No safari packages available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold tracking-wider uppercase">
            Choose Your Adventure
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured <span className="text-primary">Safari Packages</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Handcrafted itineraries that showcase the best of Kenya's wildlife and landscapes
          </p>
        </div>

        {/* Safari Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map((safari) => (
            <div key={safari.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={safari.main_image}
                  alt={safari.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Badge */}
                {safari.badge && (
                  <span className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                    {safari.badge}
                  </span>
                )}

                {/* Rating */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 z-10">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>{safari.rating}</span>
                  <span className="text-gray-500">({safari.reviews_count})</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {safari.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                    <span className="line-clamp-1">{safari.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock className="w-4 h-4 mr-2 text-primary" />
                    {safari.duration}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Users className="w-4 h-4 mr-2 text-primary" />
                    {safari.group_size}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-2xl font-bold text-primary">${safari.price}</span>
                    <span className="text-gray-500 text-sm">/ person</span>
                  </div>
                  <Link
                    href={`/safaris/${safari.id}`}
                    className="text-primary font-semibold hover:text-primary/80 transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/safaris" className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors">
            View All Safaris
          </Link>
        </div>
      </div>
    </section>
  );
}