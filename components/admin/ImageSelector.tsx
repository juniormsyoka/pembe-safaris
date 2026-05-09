'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Check, X, FolderOpen, ChevronLeft } from 'lucide-react'

interface ImageSelectorProps {
  onSelect: (imagePath: string) => void
  currentImage?: string
  onClose: () => void
}

export default function ImageSelector({ onSelect, currentImage, onClose }: ImageSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('safaris')
  const [selectedImage, setSelectedImage] = useState<string>(currentImage || '')
  const [images, setImages] = useState<string[]>([])

  // Predefined image categories and their actual paths
  const categories = [
    { id: 'safaris', name: 'Safari Packages', path: '/images/safaris/' },
    { id: 'destinations', name: 'Destinations', path: '/images/destinations/' },
    { id: 'gallery/wildlife', name: 'Wildlife', path: '/images/gallery/wildlife/' },
    { id: 'gallery/landscapes', name: 'Landscapes', path: '/images/gallery/landscapes/' },
    { id: 'gallery/cultural', name: 'Cultural', path: '/images/gallery/cultural/' },
    { id: 'gallery/accommodations', name: 'Accommodations', path: '/images/gallery/accommodations/' },
  ]

  // Find the current category object
  const currentCategory = categories.find(c => c.id === selectedCategory)

  // Available images (you can add more as you add images to your folders)
  const imageLists: Record<string, string[]> = {
    safaris: [
      'mara-migration.jpg',
      'amboseli.jpg',
      'tsavo.jpg',
      'samburu.jpg',
    ],
    destinations: [
      'maasai-mara.jpg',
      'amboseli.jpg',
      'tsavo.jpg',
      'samburu.jpg',
      'lake-nakuru.jpg',
      'diani-beach.jpg',
    ],
    'gallery/wildlife': [
      'lion.jpg',
      'elephant.jpg',
      'cheetah.jpg',
      'giraffe.jpg',
      'rhino.jpg',
    ],
    'gallery/landscapes': [
      'kilimanjaro.jpg',
      'sunset.jpg',
      'mara-river.jpg',
    ],
    'gallery/cultural': [
      'maasai.jpg',
      'village.jpg',
    ],
    'gallery/accommodations': [
      'lodge.jpg',
      'tent.jpg',
    ],
  }

  useEffect(() => {
    const imageList = imageLists[selectedCategory] || []
    setImages(imageList)
  }, [selectedCategory])

  const handleSelect = (imageName: string) => {
    if (currentCategory) {
      const fullPath = `${currentCategory.path}${imageName}`
      setSelectedImage(fullPath)
      onSelect(fullPath)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-serif font-bold">Select an Image</h2>
            <p className="text-gray-600 text-sm mt-1">Choose from your existing image library</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="p-4 border-b overflow-x-auto">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Image Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((imageName) => {
              const imagePath = currentCategory ? `${currentCategory.path}${imageName}` : ''
              const isSelected = selectedImage === imagePath

              return (
                <div
                  key={imageName}
                  onClick={() => handleSelect(imageName)}
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    isSelected ? 'border-primary shadow-lg' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={imagePath}
                    alt={imageName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 truncate">
                    {imageName}
                  </div>
                </div>
              )
            })}
          </div>

          {images.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No images found in this category</p>
              <p className="text-sm mt-1">
                Add images to /public{currentCategory?.path || '/images/'}
              </p>
            </div>
          )}
        </div>

        {/* Preview Current Selection */}
        {selectedImage && (
          <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded overflow-hidden">
                <Image
                  src={selectedImage}
                  alt="Selected preview"
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div>
                <p className="text-sm font-medium">Selected Image</p>
                <p className="text-xs text-gray-500">{selectedImage}</p>
              </div>
            </div>
            <button
              onClick={() => {
                onSelect(selectedImage)
                onClose()
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Confirm Selection
            </button>
          </div>
        )}
      </div>
    </div>
  )
}