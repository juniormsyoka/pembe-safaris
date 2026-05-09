'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Upload, Image as ImageIcon } from 'lucide-react'
import ImageSelector from '@/components/admin/ImageSelector'

export default function AddPackagePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showImageSelector, setShowImageSelector] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    duration: '',
    price: '',
    description: '',
    highlights: [''],
    main_image: '',
    badge: '',
    location: '',
    group_size: '',
    featured: false,
  })

  const handleImageSelect = (imagePath: string) => {
    setFormData({ ...formData, main_image: imagePath })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          group_size: formData.group_size,
        })
      })

      if (response.ok) {
        router.push('/admin/packages')
      } else {
        console.error('Failed to save package')
      }
    } catch (error) {
      console.error('Error adding package:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold">Add New Package</h1>
        <p className="text-gray-600 mt-2">Create a new special package for your customers</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Package Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle / Badge
            </label>
            <input
              type="text"
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Best Seller, Photography"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration *
            </label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
              placeholder="e.g., 7 Days"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Size
            </label>
            <input
              type="text"
              value={formData.group_size}
              onChange={(e) => setFormData({ ...formData, group_size: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., 2-8 people"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (USD)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="2850"
            />
          </div>
        </div>

        {/* Image Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Main Image *
          </label>
          <div className="flex items-start gap-4">
            {formData.main_image && (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={formData.main_image}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <button
                type="button"
                onClick={() => setShowImageSelector(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
                Browse Images
              </button>
              {formData.main_image && (
                <p className="text-xs text-gray-500 mt-2 truncate">
                  {formData.main_image}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4 text-primary rounded"
          />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700">
            Feature this package on homepage
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Package'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Image Selector Modal */}
      {showImageSelector && (
        <ImageSelector
          onSelect={handleImageSelect}
          currentImage={formData.main_image}
          onClose={() => setShowImageSelector(false)}
        />
      )}
    </div>
  )
}