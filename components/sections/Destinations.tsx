// components/sections/Destinations.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Calendar, Camera, ChevronRight, Star, Compass } from 'lucide-react'

const Destinations = () => {
  const [activeFilter, setActiveFilter] = useState('all')

  const destinations = [
    {
      id: 1,
      name: 'Maasai Mara',
      location: 'Southwest Kenya',
      description: 'Witness the Great Migration and the Big Five in Africa\'s most famous reserve.',
      image: '/images/destinations/maasai-mara.jpg',
      rating: 4.9,
      reviews: 256,
      bestTime: 'July - October',
      wildlife: ['Lions', 'Cheetahs', 'Wildebeest', 'Zebras', 'Elephants'],
      category: 'wildlife',
      featured: true,
    },
    {
      id: 2,
      name: 'Amboseli',
      location: 'Southern Kenya',
      description: 'Iconic views of Mount Kilimanjaro and large herds of elephants.',
      image: '/images/destinations/amboseli.jpg',
      rating: 4.8,
      reviews: 189,
      bestTime: 'June - October',
      wildlife: ['Elephants', 'Buffalos', 'Hippos', 'Giraffes', 'Zebras'],
      category: 'wildlife',
      featured: true,
    },
    {
      id: 3,
      name: 'Tsavo National Park',
      location: 'Coastal Kenya',
      description: 'Kenya\'s largest park, known for the man-eating lions and red elephants.',
      image: '/images/destinations/tsavo.jpg',
      rating: 4.7,
      reviews: 145,
      bestTime: 'May - September',
      wildlife: ['Red Elephants', 'Lions', 'Leopards', 'Giraffes', 'Zebras'],
      category: 'wildlife',
      featured: false,
    },
    {
      id: 4,
      name: 'Samburu',
      location: 'Northern Kenya',
      description: 'Unique wildlife species found only in this arid region.',
      image: '/images/destinations/samburu.jpg',
      rating: 4.8,
      reviews: 112,
      bestTime: 'June - October',
      wildlife: ['Grevy\'s Zebra', 'Reticulated Giraffe', 'Somali Ostrich', 'Beisa Oryx'],
      category: 'wildlife',
      featured: true,
    },
    {
      id: 5,
      name: 'Lake Nakuru',
      location: 'Great Rift Valley',
      description: 'Famous for flamingos and rhino sanctuary.',
      image: '/images/destinations/lake-nakuru.jpg',
      rating: 4.6,
      reviews: 98,
      bestTime: 'November - April',
      wildlife: ['Flamingos', 'Rhinos', 'Lions', 'Leopards', 'Waterbucks'],
      category: 'lake',
      featured: false,
    },
    {
      id: 6,
      name: 'Diani Beach',
      location: 'Coast Province',
      description: 'Pristine white sand beaches and turquoise Indian Ocean.',
      image: '/images/destinations/diani.jpg',
      rating: 4.9,
      reviews: 234,
      bestTime: 'December - March',
      wildlife: ['Marine Life', 'Dolphins', 'Sea Turtles', 'Whale Sharks'],
      category: 'beach',
      featured: true,
    },
  ]

  const filters = [
    { id: 'all', label: 'All Destinations', icon: Compass },
    { id: 'wildlife', label: 'Wildlife Parks', icon: Camera },
    { id: 'beach', label: 'Beach Resorts', icon: MapPin },
    { id: 'lake', label: 'Lakes', icon: Calendar },
  ]

  const filteredDestinations = activeFilter === 'all' 
    ? destinations 
    : destinations.filter(dest => dest.category === activeFilter)

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <span className="text-primary font-semibold tracking-wider uppercase text-xs md:text-sm">
            Explore Kenya
          </span>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-3 md:mb-4">
            Popular <span className="gradient-text">Destinations</span>
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4">
            From world-famous game reserves to pristine beaches, discover Kenya's most breathtaking locations
          </p>
        </div>

        {/* Filter Buttons - Horizontal scroll on mobile */}
        <div className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-x-visible justify-start md:justify-center gap-2 md:gap-3 lg:gap-4 mb-8 md:mb-12 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
          {filters.map((filter) => {
            const Icon = filter.icon
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center space-x-1.5 md:space-x-2 px-4 md:px-5 lg:px-6 py-2.5 md:py-3 rounded-full transition-all duration-300 active:scale-95 touch-manipulation whitespace-nowrap ${
                  activeFilter === filter.id
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="text-sm md:text-base">{filter.label}</span>
              </button>
            )
          })}
        </div>

        {/* Destinations Grid - Mobile first: 1 column, then 2, then 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
          {filteredDestinations.map((destination, index) => (
            <div
              key={destination.id}
              className="group relative bg-white rounded-2xl md:rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Featured Badge */}
                {destination.featured && (
                  <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-primary text-white px-2.5 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-semibold flex items-center space-x-1 z-10">
                    <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                    <span>Featured</span>
                  </div>
                )}

                {/* Rating */}
                <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-white/90 backdrop-blur-sm px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-semibold flex items-center space-x-1 z-10">
                  <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-current" />
                  <span>{destination.rating}</span>
                  <span className="text-gray-500 hidden sm:inline">({destination.reviews})</span>
                </div>

                {/* Location Badge */}
                <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 flex items-center space-x-1.5 text-white">
                  <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="text-xs md:text-sm">{destination.location}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-5 lg:p-6">
                <h3 className="font-serif text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {destination.name}
                </h3>
                
                <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4 line-clamp-2">
                  {destination.description}
                </p>

                {/* Best Time to Visit */}
                <div className="flex items-center space-x-1.5 text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
                  <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                  <span>Best time: {destination.bestTime}</span>
                </div>

                {/* Wildlife Tags */}
                <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-5 lg:mb-6">
                  {destination.wildlife.slice(0, 3).map((animal, idx) => (
                    <span
                      key={idx}
                      className="px-2 md:px-3 py-0.5 md:py-1 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      {animal}
                    </span>
                  ))}
                  {destination.wildlife.length > 3 && (
                    <span className="px-2 md:px-3 py-0.5 md:py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{destination.wildlife.length - 3}
                    </span>
                  )}
                </div>

                {/* View Details Link */}
               {/* <Link
                  href={`/destinations/${destination.name.toLowerCase().replace(' ', '-')}`}
                  className="inline-flex items-center space-x-1.5 text-primary font-semibold text-sm md:text-base group/link"
                >
                  <span>Explore Destination</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>*/}
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8 md:mt-10 lg:mt-12">
          <Link href="/destinations" className="btn-primary inline-flex items-center space-x-2">
            <span>View All Destinations</span>
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Destinations