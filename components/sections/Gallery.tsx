// components/Gallery.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Sparkles, X } from 'lucide-react'

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedImage, setSelectedImage] = useState<any | null>(null)

  const galleryItems = [
    {
      id: 1,
      title: 'Group Photo at Kimana Gate',
      category: 'ontour',
      src: '/images/gallery/Group Photo at Kimana Gate.png',
      span: 'col-span-1 md:col-span-1 row-span-2',
      description: 'Our happy guests and local guides arriving at Kimana Gate, Amboseli.',
    },
    {
      id: 2,
      title: 'Wildlife Crossing',
      category: 'wildlife',
      src: '/images/gallery/elephants.jpg',
      span: 'col-span-1 md:col-span-2 row-span-1',
      description: 'Elephants traversing the sweeping savannah plains.',
    },
    {
      id: 3,
      title: 'Zebra Grazing at Sunset',
      category: 'wildlife',
      src: '/images/gallery/zebras.jpg',
      span: 'col-span-1 md:col-span-1 row-span-1',
      description: 'Zebras grazing under a golden Kenyan sunset backdrop.',
    },
    {
      id: 4,
      title: 'Safari Cruiser Experience',
      category: 'ontour',
      src: '/images/gallery/tours1.jpg',
      span: 'col-span-1 md:col-span-1 row-span-2',
      description: 'Immersive safari game drive in our custom 4x4 cruiser.',
    },
    {
      id: 5,
      title: 'Lion Pride Rest',
      category: 'wildlife',
      src: '/images/gallery/lions.jpg',
      span: 'col-span-1 md:col-span-1 row-span-1',
      description: 'A peaceful moment with lions resting in the tall grass.',
    },
    {
      id: 6,
      title: 'Amboseli Elephants',
      category: 'wildlife',
      src: '/images/gallery/elephants3.jpg',
      span: 'col-span-1 md:col-span-1 row-span-2',
      description: 'Majestic elephants wandering against open skies.',
    },
    {
      id: 7,
      title: 'Guide with Cruiser',
      category: 'ontour',
      src: '/images/gallery/tours2.jpg',
      span: 'col-span-1 md:col-span-1 row-span-1',
      description: 'Our expert local guide ready for the next adventure.',
    },
    {
      id: 8,
      title: 'Zebra Herd Dynamics',
      category: 'wildlife',
      src: '/images/gallery/zebras again.jpg',
      span: 'col-span-1 md:col-span-2 row-span-1',
      description: 'Striking patterns of zebras across the plains.',
    },
  ]

  const filters = [
    { id: 'all', label: 'All Moments' },
    { id: 'wildlife', label: 'Wildlife & Nature' },
    { id: 'ontour', label: 'On Tour & Guests' },
  ]

  const filteredItems = activeFilter === 'all'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeFilter)

  return (
    <section className="py-16 md:py-24 bg-white text-[#2A1810]" id="gallery">
      <div className="max-w-[1240px] mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#C97A2B] font-semibold tracking-widest uppercase text-xs md:text-sm block mb-3">
            Savannah Moments
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Real Stories from the <span className="text-[#C97A2B]">Field</span>
          </h2>
          <p className="text-[#2A1810]/70 text-sm md:text-base">
            Glimpse into authentic safari experiences, guest memories, and breathtaking wildlife captured across Kenya.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-12 flex-wrap" role="group" aria-label="Gallery filters">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              aria-pressed={activeFilter === filter.id}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-[#2A1810] text-[#FAF2EB] shadow-lg scale-105'
                  : 'bg-[#FAF2EB] text-[#2A1810] hover:bg-[#F5E3D2]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Masonry / Asymmetric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[280px] gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className={`group relative rounded-[28px] overflow-hidden shadow-md bg-[#2A1810]/5 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 ${item.span}`}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F1109]/90 via-[#1F1109]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-semibold tracking-wider text-[#E5A663] uppercase mb-1">
                  {item.category === 'wildlife' ? 'Wildlife Moment' : 'Guest Experience'}
                </span>
                <h3 className="font-serif text-xl font-bold mb-1">{item.title}</h3>
                <p className="text-xs text-[#F5E3D2]/80 line-clamp-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-[#1F1109]/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-[#FAF2EB] rounded-[32px] overflow-hidden shadow-2xl border border-white/20 p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-[#2A1810] text-white flex items-center justify-center transition-transform hover:scale-110"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative w-full h-[50vh] sm:h-[60vh] rounded-[20px] overflow-hidden mb-4">
              <Image
                src={selectedImage.src}
                alt={selectedImage.title}
                fill
                className="object-contain bg-[#1F1109]"
              />
            </div>

            <div className="px-2">
              <span className="text-xs font-semibold tracking-wider text-[#C97A2B] uppercase">
                {selectedImage.category === 'wildlife' ? 'Wildlife & Nature' : 'On Tour'}
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#2A1810] mt-1 mb-2">
                {selectedImage.title}
              </h3>
              <p className="text-[#2A1810]/75 text-sm sm:text-base">
                {selectedImage.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Gallery