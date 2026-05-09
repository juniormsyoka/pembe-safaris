'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import AuthGuard from '@/components/auth/AuthGuard'
import { supabaseAdmin, isAdminClientReady } from '@/lib/supabase/admin'
import { Package, Edit, Trash2, Plus, Check, X, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface SafariPackage {
  id: string
  title: string
  slug: string
  location: string
  duration: string
  group_size: string
  price: string
  rating: number
  reviews_count: number
  description: string
  main_image: string
  badge: string
  featured: boolean
  active: boolean
  created_at: string
}

function PackagesContent() {
  const { data: session } = useSession()
  const [packages, setPackages] = useState<SafariPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<SafariPackage>>({})

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!isAdminClientReady()) {
        setError('Supabase admin client is not configured')
        return
      }

      const { data, error: fetchError } = await supabaseAdmin
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setPackages(data || [])
    } catch (err) {
      console.error('Error fetching packages:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch packages')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
      return
    }

    setDeletingId(id)
    try {
      const { error } = await supabaseAdmin
        .from('packages')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Refresh the list
      await fetchPackages()
      alert('Package deleted successfully!')
    } catch (err) {
      console.error('Error deleting package:', err)
      alert('Failed to delete package')
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (pkg: SafariPackage) => {
    setEditingId(pkg.id)
    setEditForm({
      title: pkg.title,
      location: pkg.location,
      duration: pkg.duration,
      group_size: pkg.group_size,
      price: pkg.price,
      description: pkg.description,
      badge: pkg.badge,
      featured: pkg.featured,
      active: pkg.active,
    })
  }

  const handleUpdate = async (id: string) => {
    try {
      const { error } = await supabaseAdmin
        .from('packages')
        .update({
          title: editForm.title,
          location: editForm.location,
          duration: editForm.duration,
          group_size: editForm.group_size,
          price: parseFloat(editForm.price as string),
          description: editForm.description,
          badge: editForm.badge,
          featured: editForm.featured,
          active: editForm.active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error

      // Refresh the list
      await fetchPackages()
      setEditingId(null)
      setEditForm({})
      alert('Package updated successfully!')
    } catch (err) {
      console.error('Error updating package:', err)
      alert('Failed to update package')
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabaseAdmin
        .from('packages')
        .update({ active: !currentActive, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      // Refresh the list
      await fetchPackages()
    } catch (err) {
      console.error('Error toggling active status:', err)
      alert('Failed to update package status')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Packages</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchPackages}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">Manage Packages</h1>
          <p className="text-gray-600 mt-2">Create and manage your safari packages</p>
        </div>
        <Link
          href="/admin/packages/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Package
        </Link>
      </div>

      {packages.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No packages yet</h3>
          <p className="text-gray-500 mb-4">Create your first safari package</p>
          <Link
            href="/admin/packages/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Add Package
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4">Image</th>
                  <th className="text-left p-4">Title</th>
                  <th className="text-left p-4">Location</th>
                  <th className="text-left p-4">Duration</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        {pkg.main_image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={pkg.main_image}
                            alt={pkg.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      {editingId === pkg.id ? (
                        <input
                          type="text"
                          value={editForm.title || ''}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="px-2 py-1 border rounded"
                        />
                      ) : (
                        <div>
                          <div className="font-medium">{pkg.title}</div>
                          {pkg.badge && (
                            <span className="text-xs text-primary">{pkg.badge}</span>
                          )}
                        </div>
                      )}
                    </td>
                    
                    <td className="p-4">
                      {editingId === pkg.id ? (
                        <input
                          type="text"
                          value={editForm.location || ''}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          className="px-2 py-1 border rounded"
                        />
                      ) : (
                        pkg.location
                      )}
                    </td>
                    
                    <td className="p-4">
                      {editingId === pkg.id ? (
                        <input
                          type="text"
                          value={editForm.duration || ''}
                          onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                          className="px-2 py-1 border rounded"
                        />
                      ) : (
                        pkg.duration
                      )}
                    </td>
                    
                    <td className="p-4">
                      {editingId === pkg.id ? (
                        <input
                          type="number"
                          value={editForm.price || ''}
                          onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                          className="px-2 py-1 border rounded"
                        />
                      ) : (
                        <span className="font-semibold">${pkg.price}</span>
                      )}
                    </td>
                    
                    <td className="p-4">
                      {editingId === pkg.id ? (
                        <button
                          onClick={() => setEditForm({ ...editForm, active: !editForm.active })}
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            editForm.active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {editForm.active ? 'Active' : 'Draft'}
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleActive(pkg.id, pkg.active)}
                          className={`px-2 py-1 rounded-full text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity ${
                            pkg.active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {pkg.active ? 'Active' : 'Draft'}
                        </button>
                      )}
                    </td>
                    
                    <td className="p-4">
                      {editingId === pkg.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(pkg.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(pkg)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(pkg.id)}
                            disabled={deletingId === pkg.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId === pkg.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PackagesPage() {
  return (
    <AuthGuard>
      <PackagesContent />
    </AuthGuard>
  )
}