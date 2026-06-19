// components/sections/Gallery.tsx
'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Maximize2, Heart } from 'lucide-react'
import { useSwipeable } from 'react-swipeable'

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
      photographer: 'Photography',
    //  likes: 234,
    },
    {
      id: 2,
      src: '/images/gallery/wildlife/elephant.jpg',
      alt: 'Elephant family in Amboseli',
      category: 'wildlife',
      title: 'Gentle Giants',
      location: 'Amboseli',
      photographer: 'Photography',
      likes: 189,
    },
    {
      id: 3,
      src: '/images/gallery/landscapes/kilimanjaro.jpg',
      alt: 'Mount Kilimanjaro view',
      category: 'landscapes',
      title: 'Snows of Kilimanjaro',
      location: 'Amboseli',
      photographer: 'Photography',
      likes: 156,
    },
    {
      id: 4,
      src: '/images/gallery/cultural/maasai.jpg',
      alt: 'Maasai warriors',
      category: 'cultural',
      title: 'Traditional Maasai Dance',
      location: 'Maasai Mara',
      photographer: 'Photography',
      likes: 278,
    },
    {
      id: 5,
      src: '/images/gallery/wildlife/cheetah.jpg',
      alt: 'Cheetah hunting',
      category: 'wildlife',
      title: 'Speed in Motion',
      location: 'Serengeti',
      photographer: 'Photography',
      likes: 345,
    },
    {
      id: 6,
      src: '/images/gallery/landscapes/sunset.jpg',
      alt: 'African sunset',
      category: 'landscapes',
      title: 'Golden Hour',
      location: 'Tsavo',
      photographer: 'Photography',
      likes: 421,
    },
    {
      id: 7,
      src: '/images/gallery/accommodations/lodge.jpg',
      alt: 'Luxury safari lodge',
      category: 'accommodations',
      title: 'Wilderness Comfort',
      location: 'Laikipia',
      photographer: 'Photography',
      likes: 167,
    },
    {
      id: 8,
      src: '/images/gallery/cultural/village.jpg',
      alt: 'Traditional village life',
      category: 'cultural',
      title: 'Daily Life',
      location: 'Samburu',
      photographer: 'Photography',
      likes: 198,
    },
    {
      id: 9,
      src: '/images/gallery/wildlife/giraffe.jpg',
      alt: 'Giraffe at sunset',
      category: 'wildlife',
      title: 'Towering Beauty',
      location: 'Nairobi National Park',
      photographer: 'Photography',
      likes: 276,
    },
    {
      id: 10,
      src: '/images/gallery/landscapes/mara-river.jpg',
      alt: 'Mara River crossing',
      category: 'landscapes',
      title: 'The Great Crossing',
      location: 'Maasai Mara',
      photographer: 'Photography',
      likes: 567,
    },
    {
      id: 11,
      src: '/images/gallery/accommodations/tent.jpg',
      alt: 'Luxury tented camp',
      category: 'accommodations',
      title: 'Under Canvas',
      location: 'Mara North',
      photographer: 'Photography',
      likes: 145,
    },
    {
      id: 12,
      src: '/images/gallery/wildlife/rhino.jpg',
      alt: 'White rhino',
      category: 'wildlife',
      title: 'Ancient Warrior',
      location: 'Lake Nakuru',
      photographer: 'Photography',
      likes: 223,
    },
  ]

  const categories = [
    { id: 'all', label: 'All ' },
    { id: 'wildlife', label: 'Wild'},
    { id: 'landscapes', label: 'Land' },
    { id: 'cultural', label: 'Cultural' },
    { id: 'accommodations', label: 'Stays' },
  ]

  // Memoized filtered images to prevent unnecessary recalculations
  const filteredImages = useMemo(() => {
    return activeFilter === 'all'
      ? galleryImages
      : galleryImages.filter(img => img.category === activeFilter)
  }, [activeFilter])

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

  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNextImage(),
    onSwipedRight: () => handlePrevImage(),
    trackMouse: false,
  })

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <span className="text-primary font-semibold tracking-wider uppercase text-xs md:text-sm">
            Visual Stories
          </span>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-3 md:mb-4">
            Safari <span className="gradient-text">Gallery</span>
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Immerse yourself in the beauty of Kenya through our collection of stunning photographs
          </p>
        </div>

        {/* Category Filters - Horizontal scroll on mobile */}
       <div className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-x-visible justify-start md:justify-center gap-2 md:gap-3 lg:gap-4 mb-8 md:mb-12 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`
                px-4 md:px-5 lg:px-6 py-2.5 md:py-3 
                rounded-full transition-all duration-300 
                active:scale-95 touch-manipulation whitespace-nowrap
                text-sm md:text-base font-medium
                flex items-center justify-center
                ${activeFilter === category.id
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid - Mobile first: 2 columns on mobile, then 3, then 4 */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-xl md:rounded-2xl cursor-pointer active:scale-95 transition-transform"
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 lg:p-6 text-white">
                  <h3 className="font-serif text-sm md:text-base lg:text-xl font-bold mb-0.5 md:mb-1 line-clamp-1">
                    {image.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-200 mb-1 md:mb-2 hidden sm:block">
                    {image.location}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs hidden md:inline">by {image.photographer}</span>
                    
                  </div>
                </div>
              </div>

              {/* Category Badge */}
              <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-black/50 backdrop-blur-sm text-white px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-[10px] md:text-xs capitalize">
                {image.category}
              </div>

              {/* Expand Button */}
              <button 
                className="absolute top-2 right-2 md:top-3 md:right-3 bg-black/50 backdrop-blur-sm p-1.5 md:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImage(index)
                }}
              >
                <Maximize2 className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
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
            className="absolute top-2 right-2 md:top-4 md:right-4 z-50 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors active:scale-90 touch-manipulation"
          >
            <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePrevImage()
            }}
            className="absolute left-2 md:left-4 z-50 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors active:scale-90 touch-manipulation"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNextImage()
            }}
            className="absolute right-2 md:right-4 z-50 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors active:scale-90 touch-manipulation"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>

          {/* Image Container with Swipe Support */}
          <div 
            className="relative max-w-7xl max-h-[90vh] w-full h-full mx-4"
            onClick={(e) => e.stopPropagation()}
            {...swipeHandlers}
          >
            <div className="relative w-full h-full">
              <Image
                src={filteredImages[selectedImage].src}
                alt={filteredImages[selectedImage].alt}
                fill
                className="object-contain"
                priority
                sizes="90vw"
              />
            </div>

            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8 bg-gradient-to-t from-black/80 to-transparent">
              <div className="text-white">
                <h3 className="font-serif text-lg md:text-2xl lg:text-3xl font-bold mb-1 md:mb-2">
                  {filteredImages[selectedImage].title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-200">
                  <span> {filteredImages[selectedImage].location}</span>
                  <span>📷 {filteredImages[selectedImage].photographer}</span>
                  
                </div>
              </div>
            </div>
          </div>

          {/* Image Counter */}
          <div className="absolute top-2 left-2 md:top-4 md:left-4 text-white bg-black/50 px-2 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm">
            {selectedImage + 1} / {filteredImages.length}
          </div>
        </div>
      )}
    </section>
  )
}

export default Gallery