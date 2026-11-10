// app/admin/packages/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Link as LinkIcon } from 'lucide-react'

export default function AddPackagePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imageInputMode, setImageInputMode] = useState<'library' | 'url'>('library')
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    duration: '',
    description: '',
    highlights: [''],
    main_image: '',
    badge: '',
    location: '',
    group_size: '',
    featured: true, // Hardcoded to true as requested
    price: null, // Optional field, can be null
  })

  // --- FILE UPLOAD HANDLER ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 1. Validation Check (Size)
    if (file.size > 5 * 1024 * 1024) {
      console.error('[File Upload] Error: File exceeds 5MB limit.', file.name)
      alert('File is too large. Please select an image under 5MB.')
      e.target.value = '' // Reset input
      return
    }

    // 2. Show a temporary preview immediately
    const tempUrl = URL.createObjectURL(file)
    setFormData((prev) => ({ ...prev, main_image: tempUrl }))
    setIsUploading(true)

    try {
      console.log(`[File Upload] Starting upload for: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`)
      
      // 3. TODO: Replace this with your actual Supabase Storage upload logic
      // Example:
      // const { data, error } = await supabase.storage
      //   .from('packages')
      //   .upload(`public/${Date.now()}-${file.name}`, file)
      // if (error) throw error
      // const { data: { publicUrl } } = supabase.storage.from('packages').getPublicUrl(data.path)
      // setFormData((prev) => ({ ...prev, main_image: publicUrl }))
      
      // Simulating network delay for the sake of the UI
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      console.log('[File Upload] Success: Mock upload complete. In production, the public URL replaces the temp URL.')
      
    } catch (error) {
      console.error('[File Upload] Error during upload:', error)
      alert('Failed to upload image. Please check the console for details.')
      // Revert to empty if upload fails
      setFormData((prev) => ({ ...prev, main_image: '' }))
    } finally {
      setIsUploading(false)
    }
  }

  // --- FORM SUBMISSION HANDLER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation: Ensure image is provided
    if (!formData.main_image) {
      alert('Please select or provide an image for the package.')
      return
    }

    // Prevent submission if a file is still uploading
    if (isUploading) {
      alert('Please wait for the image upload to complete.')
      return
    }

    setLoading(true)
    console.log('[Form Submit] Initiating package creation...', formData)

    try {
      const response = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          group_size: formData.group_size,
          featured: true, // Ensure it's explicitly sent as true
        })
      })

      if (!response.ok) {
        // Attempt to parse error message from API
        let errorMessage = 'Failed to save package'
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch {
          // Fallback if response isn't JSON
        }
        throw new Error(errorMessage)
      }

      console.log('[Form Submit] Success: Package created.')
      router.push('/admin/packages')
      
    } catch (error) {
      console.error('[Form Submit] Error saving package:', error)
      alert(error instanceof Error ? error.message : 'An unexpected error occurred while saving.')
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
        </div>

        {/* Image Selection with Local File Upload & URL Input Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Main Image *
            </label>
            <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setImageInputMode('library')}
                className={`px-3 py-1 rounded-md transition-all ${
                  imageInputMode === 'library' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Upload from Device
              </button>
              <button
                type="button"
                onClick={() => setImageInputMode('url')}
                className={`px-3 py-1 rounded-md transition-all ${
                  imageInputMode === 'url' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Direct Image URL
              </button>
            </div>
          </div>

          <div className="flex items-start gap-4">
            {/* Preview Thumbnail */}
            {formData.main_image && (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.main_image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('[Image Preview] Failed to load image URL:', formData.main_image)
                    ;(e.target as HTMLElement).style.display = 'none'
                  }}
                />
              </div>
            )}
            
            <div className="flex-1 space-y-2">
              {imageInputMode === 'library' ? (
                <div>
                  <label className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg transition-colors text-sm font-medium cursor-pointer w-max ${isUploading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50'}`}>
                    <Upload className="w-4 h-4 text-primary" />
                    <span>{isUploading ? 'Uploading...' : 'Choose File from Device'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isUploading}
                      onChange={handleFileUpload}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1.5">
                    Select a JPG, PNG, or WebP file from your computer (Max 5MB).
                  </p>
                </div>
              ) : (
                <div>
                  <div className="relative flex items-center">
                    <LinkIcon className="absolute left-3 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.main_image}
                      onChange={(e) => setFormData({ ...formData, main_image: e.target.value })}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">
                    Paste an external image link or absolute asset URL.
                  </p>
                </div>
              )}

              {formData.main_image && (
                <p className="text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded border border-gray-100 truncate max-w-full">
                  <span className="font-semibold text-gray-400">Current:</span> {formData.main_image}
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

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading || isUploading}
            className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? 'Saving...' : isUploading ? 'Waiting for image...' : 'Save Package'}
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
    </div>
  )
}