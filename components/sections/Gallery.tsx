// components/sections/Gallery.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Maximize2, Heart, Camera, Filter } from 'lucide-react'

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [likedImages, setLikedImages] = useState<number[]>([])

  const galleryImages = [
    {
      id: 1,
      src: '/images/gallery/wildlife/lion.jpg',
      alt: 'Lion in Maasai Mara',
      category: 'wildlife',
      title: 'King of the Savannah',
      location: 'Maasai Mara',
      photographer: 'James Wilson',
      likes: 234,
    },
    {
      id: 2,
      src: '/images/gallery/wildlife/elephant.jpg',
      alt: 'Elephant family in Amboseli',
      category: 'wildlife',
      title: 'Gentle Giants',
      location: 'Amboseli',
      photographer: 'Sarah Kimani',
      likes: 189,
    },
    {
      id: 3,
      src: '/images/gallery/landscapes/kilimanjaro.jpg',
      alt: 'Mount Kilimanjaro view',
      category: 'landscapes',
      title: 'Snows of Kilimanjaro',
      location: 'Amboseli',
      photographer: 'Michael Chen',
      likes: 156,
    },
    {
      id: 4,
      src: '/images/gallery/cultural/maasai.jpg',
      alt: 'Maasai warriors',
      category: 'cultural',
      title: 'Traditional Maasai Dance',
      location: 'Maasai Mara',
      photographer: 'Anna Müller',
      likes: 278,
    },
    {
      id: 5,
      src: '/images/gallery/wildlife/cheetah.jpg',
      alt: 'Cheetah hunting',
      category: 'wildlife',
      title: 'Speed in Motion',
      location: 'Serengeti',
      photographer: 'David Ochieng',
      likes: 345,
    },
    {
      id: 6,
      src: '/images/gallery/landscapes/sunset.jpg',
      alt: 'African sunset',
      category: 'landscapes',
      title: 'Golden Hour',
      location: 'Tsavo',
      photographer: 'Emma Watson',
      likes: 421,
    },
    {
      id: 7,
      src: '/images/gallery/accommodations/lodge.jpg',
      alt: 'Luxury safari lodge',
      category: 'accommodations',
      title: 'Wilderness Comfort',
      location: 'Laikipia',
      photographer: 'John Kamau',
      likes: 167,
    },
    {
      id: 8,
      src: '/images/gallery/cultural/village.jpg',
      alt: 'Traditional village life',
      category: 'cultural',
      title: 'Daily Life',
      location: 'Samburu',
      photographer: 'Grace Mwangi',
      likes: 198,
    },
    {
      id: 9,
      src: '/images/gallery/wildlife/giraffe.jpg',
      alt: 'Giraffe at sunset',
      category: 'wildlife',
      title: 'Towering Beauty',
      location: 'Nairobi National Park',
      photographer: 'Peter Njoroge',
      likes: 276,
    },
    {
      id: 10,
      src: '/images/gallery/landscapes/mara-river.jpg',
      alt: 'Mara River crossing',
      category: 'landscapes',
      title: 'The Great Crossing',
      location: 'Maasai Mara',
      photographer: 'Robert Lang',
      likes: 567,
    },
    {
      id: 11,
      src: '/images/gallery/accommodations/tent.jpg',
      alt: 'Luxury tented camp',
      category: 'accommodations',
      title: 'Under Canvas',
      location: 'Mara North',
      photographer: 'Lisa Anderson',
      likes: 145,
    },
    {
      id: 12,
      src: '/images/gallery/wildlife/rhino.jpg',
      alt: 'White rhino',
      category: 'wildlife',
      title: 'Ancient Warrior',
      location: 'Lake Nakuru',
      photographer: 'Samuel Omondi',
      likes: 223,
    },
  ]

  const categories = [
    { id: 'all', label: 'All Photos', count: galleryImages.length },
    { id: 'wildlife', label: 'Wildlife', count: galleryImages.filter(img => img.category === 'wildlife').length },
    { id: 'landscapes', label: 'Landscapes', count: galleryImages.filter(img => img.category === 'landscapes').length },
    { id: 'cultural', label: 'Cultural', count: galleryImages.filter(img => img.category === 'cultural').length },
    { id: 'accommodations', label: 'Accommodations', count: galleryImages.filter(img => img.category === 'accommodations').length },
  ]

  const filteredImages = activeFilter === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeFilter)

  const handlePrevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? filteredImages.length - 1 : selectedImage - 1)
    }
  }

  const handleNextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === filteredImages.length - 1 ? 0 : selectedImage + 1)
    }
  }

  const handleLike = (id: number) => {
    setLikedImages(prev => 
      prev.includes(id) ? prev.filter(imgId => imgId !== id) : [...prev, id]
    )
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold tracking-wider uppercase">
            Visual Stories
          </span>
          <h2 className="section-title">
            Safari <span className="gradient-text">Gallery</span>
          </h2>
          <p className="section-subtitle">
            Immerse yourself in the beauty of Kenya through our collection of stunning photographs
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                activeFilter === category.id
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{category.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeFilter === category.id
                  ? 'bg-white text-primary'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer"
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-serif text-xl font-bold mb-1">{image.title}</h3>
                  <p className="text-sm text-gray-200 mb-2">{image.location}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">by {image.photographer}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLike(image.id)
                      }}
                      className="flex items-center space-x-1 text-white hover:text-primary transition-colors"
                    >
                      <Heart className={`w-5 h-5 ${likedImages.includes(image.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      <span className="text-sm">{image.likes + (likedImages.includes(image.id) ? 1 : 0)}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Category Badge */}
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs capitalize">
                {image.category}
              </div>

              {/* Expand Button */}
              <button 
                className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImage(index)
                }}
              >
                <Maximize2 className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {filteredImages.length > 12 && (
          <div className="text-center mt-12">
            <button className="btn-secondary !border-primary !text-primary hover:!bg-primary hover:!text-white">
              Load More Photos
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePrevImage()
            }}
            className="absolute left-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNextImage()
            }}
            className="absolute right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Image Container */}
          <div 
            className="relative max-w-7xl max-h-[90vh] w-full h-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={filteredImages[selectedImage].src}
                alt={filteredImages[selectedImage].alt}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
              <div className="text-white">
                <h3 className="font-serif text-3xl font-bold mb-2">
                  {filteredImages[selectedImage].title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-gray-200">
                  <span>📍 {filteredImages[selectedImage].location}</span>
                  <span>📷 {filteredImages[selectedImage].photographer}</span>
                  <button 
                    onClick={() => handleLike(filteredImages[selectedImage].id)}
                    className="flex items-center space-x-1 hover:text-primary transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${likedImages.includes(filteredImages[selectedImage].id) ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{filteredImages[selectedImage].likes + (likedImages.includes(filteredImages[selectedImage].id) ? 1 : 0)} likes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 text-white bg-black/50 px-4 py-2 rounded-full text-sm">
            {selectedImage + 1} / {filteredImages.length}
          </div>
        </div>
      )}
    </section>
  )
}

export default Gallery