// app/(admin)/admin/packages/page.tsx
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import AuthGuard from '@/components/auth/AuthGuard'
import {
  Package,
  Pencil,
  Trash2,
  Plus,
  Check,
  X,
  Loader2,
  MoreVertical,
  MapPin,
  Clock,
  Users,
  Star,
  Search,
  LayoutGrid,
  List,
} from 'lucide-react'

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

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

type EditForm = Pick<
  SafariPackage,
  'title' | 'location' | 'duration' | 'group_size' | 'badge' | 'description' | 'featured' | 'active'
>

type Filter = 'all' | 'active' | 'draft'
type View = 'grid' | 'table'
type Toast = { message: string; tone: 'ok' | 'error' } | null

const toForm = (p: SafariPackage): EditForm => ({
  title: p.title ?? '',
  location: p.location ?? '',
  duration: p.duration ?? '',
  group_size: p.group_size ?? '',
  badge: p.badge ?? '',
  description: p.description ?? '',
  featured: !!p.featured,
  active: !!p.active,
})

const inputCls =
  'w-full min-h-12 rounded-xl border border-[#2A1810]/15 bg-[#FAF2EB]/50 px-3.5 text-base text-[#2A1810] placeholder:text-[#2A1810]/30 focus:border-[#C97A2B] focus:outline-none focus:ring-2 focus:ring-[#C97A2B]/25'

/* -------------------------------------------------------------------------- */
/*  Small building blocks                                                      */
/* -------------------------------------------------------------------------- */

function Thumb({ pkg, className = '' }: { pkg: SafariPackage; className?: string }) {
  return (
    <div
      className={`shrink-0 overflow-hidden bg-[#2A1810]/5 border border-[#2A1810]/10 flex items-center justify-center ${className}`}
    >
      {pkg.main_image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={pkg.main_image} alt={pkg.title} className="h-full w-full object-cover" />
      ) : (
        <Package className="h-1/3 w-1/3 text-[#2A1810]/25" />
      )}
    </div>
  )
}

/** Accessible on/off switch with a text label so status is never colour-only. */
function StatusSwitch({
  active,
  busy,
  onToggle,
}: {
  active: boolean
  busy?: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={active ? 'Active, tap to set as draft' : 'Draft, tap to set as active'}
      disabled={busy}
      onClick={onToggle}
      className="group inline-flex min-h-10 items-center gap-2.5 rounded-full pr-1 disabled:opacity-60"
    >
      <span
        className={`relative h-6 w-11 rounded-full transition-colors ${
          active ? 'bg-green-600' : 'bg-[#2A1810]/20'
        }`}
      >
        <span
          className={`absolute top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow transition-all ${
            active ? 'left-[22px]' : 'left-0.5'
          }`}
        >
          {busy && <Loader2 className="h-3 w-3 animate-spin text-[#2A1810]/60" />}
        </span>
      </span>
      <span className={`text-sm font-medium ${active ? 'text-green-700' : 'text-[#2A1810]/60'}`}>
        {active ? 'Active' : 'Draft'}
      </span>
    </button>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[#2A1810]/80">{label}</span>
      {children}
    </label>
  )
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full min-h-14 items-center justify-between gap-4 rounded-xl border border-[#2A1810]/10 bg-[#FAF2EB]/40 px-3.5 py-2.5 text-left"
    >
      <span>
        <span className="block text-sm font-medium text-[#2A1810]">{label}</span>
        <span className="block text-xs text-[#2A1810]/55">{hint}</span>
      </span>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-green-600' : 'bg-[#2A1810]/20'}`}>
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </span>
    </button>
  )
}

/**
 * One panel, two behaviours:
 *  - phones: bottom sheet that slides up (thumb-reachable, keyboard friendly)
 *  - md and up: right-hand drawer, so the list stays visible behind it
 */
function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <style>{`
        @keyframes pk-fade{from{opacity:0}to{opacity:1}}
        @keyframes pk-up{from{transform:translateY(100%)}to{transform:none}}
        @keyframes pk-left{from{transform:translateX(100%)}to{transform:none}}
        .pk-fade{animation:pk-fade .18s ease-out}
        .pk-panel{animation:pk-up .26s cubic-bezier(.2,.8,.2,1)}
        @media(min-width:768px){.pk-panel{animation-name:pk-left}}
        @media(prefers-reduced-motion:reduce){.pk-fade,.pk-panel{animation:none}}
      `}</style>
      <div className="pk-fade absolute inset-0 bg-[#2A1810]/50" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="pk-panel absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col rounded-t-[28px] bg-white shadow-2xl md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[480px] md:rounded-none md:rounded-l-[28px]"
      >
        <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-[#2A1810]/15 md:hidden" />
        <div className="flex items-center justify-between px-5 pb-2 pt-4 md:pt-6">
          <h2 className="font-serif text-xl font-bold text-[#2A1810]">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#2A1810]/60 hover:bg-[#2A1810]/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-4">{children}</div>
        {footer && (
          <div className="border-t border-[#2A1810]/10 bg-white px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] md:rounded-bl-[28px]">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Page content                                                               */
/* -------------------------------------------------------------------------- */

function PackagesContent() {
  const [packages, setPackages] = useState<SafariPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // list controls
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [view, setView] = useState<View>('grid')

  // interaction state
  const [actionsFor, setActionsFor] = useState<SafariPackage | null>(null) // mobile action sheet
  const [editing, setEditing] = useState<SafariPackage | null>(null)
  const [form, setForm] = useState<EditForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<SafariPackage | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [toast, setToast] = useState<Toast>(null)

  const notify = useCallback((message: string, tone: 'ok' | 'error' = 'ok') => {
    setToast({ message, tone })
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  /* ------------------------------- data ---------------------------------- */

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/packages', { cache: 'no-store' })

      if (!response.ok) {
        throw new Error('Failed to fetch packages')
      }

      const data = await response.json()
      setPackages(data || [])
    } catch (err) {
      console.error('Error fetching packages:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch packages')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPackages()
  }, [fetchPackages])

  /** Update one row, then patch local state so the list doesn't flash/reload. */
  const patchPackage = async (id: string, patch: Partial<SafariPackage>) => {
    const response = await fetch(`/api/admin/packages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })

    if (!response.ok) {
      const body = await response.json().catch(() => null)
      throw new Error(body?.error || 'Failed to update package')
    }

    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  const toggleActive = async (pkg: SafariPackage) => {
    setBusyId(pkg.id)
    setActionsFor(null)
    try {
      await patchPackage(pkg.id, { active: !pkg.active })
      notify(pkg.active ? 'Moved to draft' : 'Package is now active')
    } catch (err) {
      console.error('Error toggling active status:', err)
      notify('Could not update status. Try again.', 'error')
    } finally {
      setBusyId(null)
    }
  }

  const openEdit = (pkg: SafariPackage) => {
    setActionsFor(null)
    setEditing(pkg)
    setForm(toForm(pkg))
  }

  const closeEdit = useCallback(() => {
    if (saving) return
    setEditing(null)
    setForm(null)
  }, [saving])

  const saveEdit = async () => {
    if (!editing || !form) return
    if (!form.title.trim()) {
      notify('Title can’t be empty', 'error')
      return
    }
    setSaving(true)
    try {
      await patchPackage(editing.id, { ...form, title: form.title.trim() })
      setEditing(null)
      setForm(null)
      notify('Changes saved')
    } catch (err) {
      console.error('Error updating package:', err)
      notify('Could not save changes. Try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const runDelete = async () => {
    if (!confirmDelete) return
    const target = confirmDelete
    setBusyId(target.id)
    try {
      const response = await fetch(`/api/admin/packages/${target.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || 'Failed to delete package')
      }

      setPackages((prev) => prev.filter((p) => p.id !== target.id))
      notify('Package deleted')
    } catch (err) {
      console.error('Error deleting package:', err)
      notify('Could not delete package. Try again.', 'error')
    } finally {
      setBusyId(null)
      setConfirmDelete(null)
    }
  }

  /* ------------------------------ derived -------------------------------- */

  const counts = useMemo(
    () => ({
      all: packages.length,
      active: packages.filter((p) => p.active).length,
      draft: packages.filter((p) => !p.active).length,
    }),
    [packages]
  )

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return packages.filter((p) => {
      if (filter === 'active' && !p.active) return false
      if (filter === 'draft' && p.active) return false
      if (!q) return true
      return [p.title, p.location, p.badge].some((v) => v?.toLowerCase().includes(q))
    })
  }, [packages, query, filter])

  /* ------------------------------ states --------------------------------- */

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#C97A2B]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <h3 className="mb-2 font-serif text-xl font-bold text-red-800">Error Loading Packages</h3>
        <p className="mb-6 text-red-600">{error}</p>
        <button
          onClick={fetchPackages}
          className="rounded-full bg-[#2A1810] px-6 py-2.5 font-medium text-[#FAF2EB] transition-colors hover:bg-[#C97A2B]"
        >
          Try again
        </button>
      </div>
    )
  }

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'draft', label: 'Drafts' },
  ]

  /* ------------------------------ render --------------------------------- */

  return (
    <div className="pb-24 md:pb-0">
      {/* Header */}
      <div className="mb-5 flex items-end justify-between gap-4 md:mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2A1810] md:text-3xl">Manage packages</h1>
          <p className="mt-1 text-sm text-[#2A1810]/60 md:text-base">
            {counts.all} total · {counts.active} live on the site
          </p>
        </div>
        <Link
          href="/admin/packages/new"
          className="hidden items-center gap-2 rounded-full bg-[#2A1810] px-6 py-2.5 font-semibold text-[#FAF2EB] transition-colors hover:bg-[#C97A2B] md:flex"
        >
          <Plus className="h-4 w-4" />
          Add package
        </Link>
      </div>

      {packages.length === 0 ? (
        <div className="rounded-[24px] border border-[#2A1810]/10 bg-white p-12 text-center shadow-sm">
          <Package className="mx-auto mb-4 h-16 w-16 text-[#2A1810]/20" />
          <h3 className="mb-2 font-serif text-xl font-bold text-[#2A1810]">No packages yet</h3>
          <p className="mb-6 text-[#2A1810]/60">Add your first safari package to get started.</p>
          <Link
            href="/admin/packages/new"
            className="inline-flex items-center gap-2 rounded-full bg-[#2A1810] px-6 py-2.5 font-semibold text-[#FAF2EB] transition-colors hover:bg-[#C97A2B]"
          >
            <Plus className="h-4 w-4" />
            Add package
          </Link>
        </div>
      ) : (
        <>
          {/* Toolbar */}
          <div className="sticky top-0 z-10 -mx-4 mb-4 space-y-3 bg-[#FAF2EB]/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:mb-6 md:flex md:items-center md:gap-3 md:space-y-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
            <div className="relative md:max-w-sm md:flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2A1810]/40" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, location or badge"
                className="h-12 w-full rounded-full border border-[#2A1810]/10 bg-white pl-10 pr-4 text-base text-[#2A1810] placeholder:text-[#2A1810]/35 focus:border-[#C97A2B] focus:outline-none focus:ring-2 focus:ring-[#C97A2B]/25 md:h-11 md:text-sm"
              />
            </div>

            <div className="flex items-center gap-3">
              <div role="tablist" aria-label="Filter by status" className="flex flex-1 rounded-full bg-[#2A1810]/[0.06] p-1 md:flex-none">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    role="tab"
                    aria-selected={filter === f.key}
                    onClick={() => setFilter(f.key)}
                    className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors md:flex-none ${
                      filter === f.key
                        ? 'bg-white text-[#2A1810] shadow-sm'
                        : 'text-[#2A1810]/60 hover:text-[#2A1810]'
                    }`}
                  >
                    {f.label}
                    <span className="ml-1.5 text-xs text-[#2A1810]/40">{counts[f.key]}</span>
                  </button>
                ))}
              </div>

              <div className="hidden rounded-full bg-[#2A1810]/[0.06] p-1 md:flex" role="group" aria-label="Layout">
                {(
                  [
                    { key: 'grid', icon: LayoutGrid, label: 'Grid view' },
                    { key: 'table', icon: List, label: 'Table view' },
                  ] as const
                ).map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    aria-label={label}
                    aria-pressed={view === key}
                    onClick={() => setView(key)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                      view === key ? 'bg-white text-[#2A1810] shadow-sm' : 'text-[#2A1810]/50 hover:text-[#2A1810]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-[#2A1810]/20 bg-white/60 p-10 text-center">
              <p className="font-medium text-[#2A1810]">No packages match</p>
              <p className="mt-1 text-sm text-[#2A1810]/60">Try a different search or switch the filter.</p>
              <button
                onClick={() => {
                  setQuery('')
                  setFilter('all')
                }}
                className="mt-4 rounded-full border border-[#2A1810]/15 px-4 py-2 text-sm font-medium text-[#2A1810] hover:bg-white"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {/* ============================ MOBILE LIST ============================ */}
              <ul className="space-y-3 md:hidden">
                {visible.map((pkg) => (
                  <li key={pkg.id}>
                    <article className="rounded-2xl border border-[#2A1810]/10 bg-white p-3 shadow-[0_2px_12px_rgba(42,24,16,0.04)]">
                      <div className="flex items-start gap-1">
                        <button
                          onClick={() => setActionsFor(pkg)}
                          className="flex min-w-0 flex-1 items-center gap-3 text-left"
                        >
                          <Thumb pkg={pkg} className="h-20 w-20 rounded-xl" />
                          <div className="min-w-0 flex-1">
                            {pkg.badge && (
                              <span className="mb-0.5 inline-block text-[11px] font-bold text-[#C97A2B]">
                                {pkg.badge}
                              </span>
                            )}
                            <h3 className="line-clamp-2 text-base font-semibold leading-snug text-[#2A1810]">
                              {pkg.title}
                            </h3>
                            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#2A1810]/65">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-[#C97A2B]" />
                                {pkg.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-[#C97A2B]" />
                                {pkg.duration}
                              </span>
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => setActionsFor(pkg)}
                          aria-label={`Actions for ${pkg.title}`}
                          className="-mr-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#2A1810]/55 active:bg-[#2A1810]/5"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between border-t border-[#2A1810]/8 pt-2">
                        <StatusSwitch
                          active={pkg.active}
                          busy={busyId === pkg.id}
                          onToggle={() => toggleActive(pkg)}
                        />
                        {pkg.featured && (
                          <span className="flex items-center gap-1 text-xs font-medium text-[#C97A2B]">
                            <Star className="h-3.5 w-3.5 fill-current" /> Featured
                          </span>
                        )}
                      </div>
                    </article>
                  </li>
                ))}
              </ul>

              {/* ============================ DESKTOP GRID =========================== */}
              {view === 'grid' && (
                <ul className="hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-3">
                  {visible.map((pkg) => (
                    <li key={pkg.id}>
                      <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#2A1810]/10 bg-white shadow-[0_8px_30px_rgba(42,24,16,0.04)] transition-shadow hover:shadow-[0_12px_36px_rgba(42,24,16,0.10)]">
                        <div className="relative">
                          <Thumb pkg={pkg} className="aspect-[16/10] w-full" />
                          {pkg.badge && (
                            <span className="absolute left-3 top-3 rounded-full bg-[#2A1810]/85 px-2.5 py-1 text-xs font-semibold text-[#FAF2EB]">
                              {pkg.badge}
                            </span>
                          )}
                          {pkg.featured && (
                            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-[#C97A2B]">
                              <Star className="h-3.5 w-3.5 fill-current" /> Featured
                            </span>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col p-4">
                          <h3 className="line-clamp-2 font-serif text-lg font-bold leading-snug text-[#2A1810]">
                            {pkg.title}
                          </h3>
                          <div className="mb-4 mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#2A1810]/70">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 text-[#C97A2B]" />
                              {pkg.location}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-[#C97A2B]" />
                              {pkg.duration}
                            </span>
                            {pkg.group_size && (
                              <span className="flex items-center gap-1.5">
                                <Users className="h-4 w-4 text-[#C97A2B]" />
                                {pkg.group_size}
                              </span>
                            )}
                          </div>

                          <div className="mt-auto flex items-center justify-between border-t border-[#2A1810]/8 pt-3">
                            <StatusSwitch
                              active={pkg.active}
                              busy={busyId === pkg.id}
                              onToggle={() => toggleActive(pkg)}
                            />
                            <div className="flex gap-1">
                              <button
                                onClick={() => openEdit(pkg)}
                                title="Edit"
                                aria-label={`Edit ${pkg.title}`}
                                className="rounded-lg p-2 text-[#C97A2B] transition-colors hover:bg-[#C97A2B]/10"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setConfirmDelete(pkg)}
                                title="Delete"
                                aria-label={`Delete ${pkg.title}`}
                                className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>
              )}

              {/* ============================ DESKTOP TABLE ========================== */}
              {view === 'table' && (
                <div className="hidden overflow-hidden rounded-[24px] border border-[#2A1810]/10 bg-white shadow-[0_8px_30px_rgba(42,24,16,0.04)] md:block">
                  <table className="w-full text-sm">
                    <thead className="border-b border-[#2A1810]/10 bg-[#FAF2EB]/50 text-xs text-[#2A1810]/60">
                      <tr>
                        <th className="p-4 text-left font-semibold">Package</th>
                        <th className="p-4 text-left font-semibold">Location</th>
                        <th className="p-4 text-left font-semibold">Duration</th>
                        <th className="p-4 text-left font-semibold">Status</th>
                        <th className="p-4 text-right font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A1810]/5">
                      {visible.map((pkg) => (
                        <tr key={pkg.id} className="transition-colors hover:bg-[#FAF2EB]/30">
                          <td className="max-w-[280px] p-4">
                            <div className="flex items-center gap-3">
                              <Thumb pkg={pkg} className="h-12 w-12 rounded-xl" />
                              <div className="min-w-0">
                                <div className="truncate font-semibold text-[#2A1810]">{pkg.title}</div>
                                <div className="mt-0.5 flex items-center gap-2 text-xs">
                                  {pkg.badge && <span className="font-bold text-[#C97A2B]">{pkg.badge}</span>}
                                  {pkg.featured && (
                                    <span className="flex items-center gap-1 text-[#2A1810]/55">
                                      <Star className="h-3 w-3 fill-current text-[#C97A2B]" /> Featured
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-[#2A1810]/80">{pkg.location}</td>
                          <td className="p-4 text-[#2A1810]/80">{pkg.duration}</td>
                          <td className="p-4">
                            <StatusSwitch
                              active={pkg.active}
                              busy={busyId === pkg.id}
                              onToggle={() => toggleActive(pkg)}
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={() => openEdit(pkg)}
                                title="Edit"
                                aria-label={`Edit ${pkg.title}`}
                                className="rounded-lg p-2 text-[#C97A2B] transition-colors hover:bg-[#C97A2B]/10"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setConfirmDelete(pkg)}
                                title="Delete"
                                aria-label={`Delete ${pkg.title}`}
                                className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Mobile floating add button */}
      <Link
        href="/admin/packages/new"
        aria-label="Add package"
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-20 flex h-14 items-center gap-2 rounded-full bg-[#2A1810] px-5 font-semibold text-[#FAF2EB] shadow-[0_10px_30px_rgba(42,24,16,0.35)] active:scale-95 md:hidden"
      >
        <Plus className="h-5 w-5" />
        Add
      </Link>

      {/* ===================== Mobile action sheet ===================== */}
      <Sheet open={!!actionsFor} onClose={() => setActionsFor(null)} title="Package actions">
        {actionsFor && (
          <div className="pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-[#FAF2EB]/60 p-3">
              <Thumb pkg={actionsFor} className="h-14 w-14 rounded-xl" />
              <div className="min-w-0">
                <p className="truncate font-semibold text-[#2A1810]">{actionsFor.title}</p>
                <p className="truncate text-xs text-[#2A1810]/60">
                  {actionsFor.location} · {actionsFor.duration}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => openEdit(actionsFor)}
                className="flex min-h-14 w-full items-center gap-3 rounded-2xl border border-[#2A1810]/10 px-4 text-left font-medium text-[#2A1810] active:bg-[#FAF2EB]"
              >
                <Pencil className="h-5 w-5 text-[#C97A2B]" /> Edit details
              </button>
              <button
                onClick={() => toggleActive(actionsFor)}
                className="flex min-h-14 w-full items-center gap-3 rounded-2xl border border-[#2A1810]/10 px-4 text-left font-medium text-[#2A1810] active:bg-[#FAF2EB]"
              >
                <span
                  className={`mx-1.5 h-2.5 w-2.5 rounded-full ${actionsFor.active ? 'bg-amber-500' : 'bg-green-600'}`}
                />
                {actionsFor.active ? 'Move to draft' : 'Make active'}
              </button>
              <button
                onClick={() => {
                  setConfirmDelete(actionsFor)
                  setActionsFor(null)
                }}
                className="flex min-h-14 w-full items-center gap-3 rounded-2xl border border-red-100 px-4 text-left font-medium text-red-600 active:bg-red-50"
              >
                <Trash2 className="h-5 w-5" /> Delete package
              </button>
            </div>
          </div>
        )}
      </Sheet>

      {/* ===================== Edit sheet / drawer ===================== */}
      <Sheet
        open={!!editing && !!form}
        onClose={closeEdit}
        title="Edit package"
        footer={
          <div className="flex gap-3">
            <button
              onClick={closeEdit}
              disabled={saving}
              className="min-h-12 flex-1 rounded-full border border-[#2A1810]/15 font-semibold text-[#2A1810] hover:bg-[#FAF2EB] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={saveEdit}
              disabled={saving}
              className="flex min-h-12 flex-[1.4] items-center justify-center gap-2 rounded-full bg-[#2A1810] font-semibold text-[#FAF2EB] transition-colors hover:bg-[#C97A2B] disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Save changes
            </button>
          </div>
        }
      >
        {editing && form && (
          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-3">
              <Thumb pkg={editing} className="h-16 w-16 rounded-xl" />
              <p className="text-sm text-[#2A1810]/60">
                Images and itinerary are edited on the full package page.
              </p>
            </div>

            <Field label="Title">
              <input
                className={inputCls}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Location">
                <input
                  className={inputCls}
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </Field>
              <Field label="Duration">
                <input
                  className={inputCls}
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </Field>
              <Field label="Group size">
                <input
                  className={inputCls}
                  value={form.group_size}
                  onChange={(e) => setForm({ ...form, group_size: e.target.value })}
                />
              </Field>
              <Field label="Badge">
                <input
                  className={inputCls}
                  value={form.badge}
                  placeholder="e.g. Best seller"
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                />
              </Field>
            </div>

            <Field label="Description">
              <textarea
                rows={5}
                className={`${inputCls} py-3 leading-relaxed`}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>

            <div className="space-y-2">
              <ToggleRow
                label="Active"
                hint="Visible to visitors on the site"
                checked={form.active}
                onChange={(v) => setForm({ ...form, active: v })}
              />
              <ToggleRow
                label="Featured"
                hint="Highlighted on the homepage"
                checked={form.featured}
                onChange={(v) => setForm({ ...form, featured: v })}
              />
            </div>
          </div>
        )}
      </Sheet>

      {/* ===================== Delete confirmation ===================== */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 md:items-center">
          <div className="absolute inset-0 bg-[#2A1810]/50" onClick={() => setConfirmDelete(null)} aria-hidden />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-label="Delete package"
            className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#2A1810]">Delete this package?</h3>
            <p className="mt-1 text-sm text-[#2A1810]/65">
              “{confirmDelete.title}” will be removed permanently. This can’t be undone.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="min-h-12 flex-1 rounded-full border border-[#2A1810]/15 font-semibold text-[#2A1810] hover:bg-[#FAF2EB]"
              >
                Keep it
              </button>
              <button
                onClick={runDelete}
                disabled={busyId === confirmDelete.id}
                className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-red-600 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {busyId === confirmDelete.id && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== Toast ===================== */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-24 left-1/2 z-[70] -translate-x-1/2 rounded-full px-5 py-3 text-sm font-medium text-white shadow-xl md:bottom-6 md:left-auto md:right-6 md:translate-x-0 ${
            toast.tone === 'error' ? 'bg-red-600' : 'bg-[#2A1810]'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}

export default function PackagesPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#FAF2EB]">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:py-10 lg:px-8">
          <PackagesContent />
        </div>
      </div>
    </AuthGuard>
  )
}
