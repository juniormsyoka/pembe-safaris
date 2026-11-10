// app/(admin)/admin/packages/page.tsx
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

      await fetchPackages()
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
          description: editForm.description,
          badge: editForm.badge,
          featured: editForm.featured,
          active: editForm.active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error

      await fetchPackages()
      setEditingId(null)
      setEditForm({})
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
      await fetchPackages()
    } catch (err) {
      console.error('Error toggling active status:', err)
      alert('Failed to update package status')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C97A2B]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-2xl mx-auto mt-10">
        <h3 className="text-red-800 font-serif text-xl font-bold mb-2">Error Loading Packages</h3>
        <p className="text-red-600 mb-6">{error}</p>
        <button 
          onClick={fetchPackages}
          className="px-6 py-2.5 bg-[#2A1810] text-[#FAF2EB] rounded-full hover:bg-[#C97A2B] transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#2A1810]">Manage Packages</h1>
          <p className="text-[#2A1810]/60 mt-1">Create and manage your safari packages</p>
        </div>
        <Link
          href="/admin/packages/new"
          className="flex items-center gap-2 px-6 py-2.5 bg-[#2A1810] text-[#FAF2EB] rounded-full font-semibold hover:bg-[#C97A2B] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Package
        </Link>
      </div>

      {packages.length === 0 ? (
        <div className="bg-white rounded-[24px] border border-[#2A1810]/10 shadow-sm p-12 text-center">
          <Package className="w-16 h-16 text-[#2A1810]/20 mx-auto mb-4" />
          <h3 className="text-xl font-serif font-bold text-[#2A1810] mb-2">No packages yet</h3>
          <p className="text-[#2A1810]/60 mb-6">Create your first safari package to get started</p>
          <Link
            href="/admin/packages/new"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2A1810] text-[#FAF2EB] rounded-full font-semibold hover:bg-[#C97A2B] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Package
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-[24px] border border-[#2A1810]/10 shadow-[0_8px_30px_rgba(42,24,16,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#FAF2EB]/50 border-b border-[#2A1810]/10 text-[#2A1810]/60 uppercase tracking-wider text-xs">
                <tr>
                  <th className="text-left p-4 font-semibold">Image</th>
                  <th className="text-left p-4 font-semibold">Title</th>
                  <th className="text-left p-4 font-semibold">Location</th>
                  <th className="text-left p-4 font-semibold">Duration</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A1810]/5">
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-[#FAF2EB]/30 transition-colors">
                    <td className="p-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden border border-[#2A1810]/10">
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
                    
                    <td className="p-4 max-w-[200px]">
                      {editingId === pkg.id ? (
                        <input
                          type="text"
                          value={editForm.title || ''}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full px-2 py-1 bg-[#FAF2EB] border border-[#2A1810]/20 rounded focus:outline-none focus:ring-1 focus:ring-[#C97A2B] text-[#2A1810]"
                        />
                      ) : (
                        <div>
                          <div className="font-semibold text-[#2A1810] truncate">{pkg.title}</div>
                          {pkg.badge && (
                            <span className="text-[10px] uppercase tracking-wide text-[#C97A2B] font-bold mt-1 inline-block">
                              {pkg.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    
                    <td className="p-4 text-[#2A1810]/80">
                      {editingId === pkg.id ? (
                        <input
                          type="text"
                          value={editForm.location || ''}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          className="w-full px-2 py-1 bg-[#FAF2EB] border border-[#2A1810]/20 rounded focus:outline-none focus:ring-1 focus:ring-[#C97A2B] text-[#2A1810]"
                        />
                      ) : (
                        pkg.location
                      )}
                    </td>
                    
                    <td className="p-4 text-[#2A1810]/80">
                      {editingId === pkg.id ? (
                        <input
                          type="text"
                          value={editForm.duration || ''}
                          onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                          className="w-full px-2 py-1 bg-[#FAF2EB] border border-[#2A1810]/20 rounded focus:outline-none focus:ring-1 focus:ring-[#C97A2B] text-[#2A1810]"
                        />
                      ) : (
                        pkg.duration
                      )}
                    </td>
                    
                    <td className="p-4">
                      {editingId === pkg.id ? (
                        <button
                          onClick={() => setEditForm({ ...editForm, active: !editForm.active })}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            editForm.active
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {editForm.active ? 'Active' : 'Draft'}
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleActive(pkg.id, pkg.active)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-opacity hover:opacity-80 ${
                            pkg.active
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {pkg.active ? 'Active' : 'Draft'}
                        </button>
                      )}
                    </td>
                    
                    <td className="p-4 text-right">
                      {editingId === pkg.id ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleUpdate(pkg.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-200"
                            title="Save changes"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 text-[#2A1810]/60 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(pkg)}
                            className="p-2 text-[#C97A2B] hover:bg-[#C97A2B]/10 rounded-lg transition-colors border border-transparent hover:border-[#C97A2B]/20"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(pkg.id)}
                            disabled={deletingId === pkg.id}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 disabled:opacity-50"
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
      <div className="min-h-screen bg-[#FAF2EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <PackagesContent />
        </div>
      </div>
    </AuthGuard>
  )
}