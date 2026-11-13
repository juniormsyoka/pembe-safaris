'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Mail, MessageCircle, Phone, X } from 'lucide-react'
import { getCallLink, getEmailLink, getWhatsAppEnquiryLink } from '@/lib/contact'
import { supabase } from '@/lib/supabase/client'

const ACTION_CLASS =
  'flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform duration-200 motion-reduce:transition-none motion-safe:hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

export default function ContactDock() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [packageTitle, setPackageTitle] = useState<string | undefined>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const match = pathname?.match(/^\/safaris\/([^/]+)\/?$/)
    if (!match) {
      setPackageTitle(undefined)
      return
    }

    let active = true
    const id = decodeURIComponent(match[1])

    supabase
      .from('packages')
      .select('title')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setPackageTitle(data?.title ?? undefined)
      })

    return () => {
      active = false
    }
  }, [pathname])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }

    const onPointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <div
      ref={containerRef}
      className="fixed z-50 flex flex-col items-end gap-3"
      style={{
        right: 'max(1rem, env(safe-area-inset-right))',
        bottom: 'max(1rem, env(safe-area-inset-bottom))',
      }}
    >
      <div
        id="contact-dock-actions"
        aria-hidden={!open}
        className={`flex origin-bottom-right flex-col items-end gap-2 transition-all duration-200 motion-reduce:transition-none ${
          open
            ? 'translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none translate-y-2 scale-95 opacity-0'
        }`}
      >
        <a
          href={getWhatsAppEnquiryLink(packageTitle)}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={open ? 0 : -1}
          aria-label="Chat with Pembe Africa Safaris on WhatsApp"
          className={`${ACTION_CLASS} bg-[#25D366] hover:bg-[#1ebe5b] focus-visible:outline-[#128C7E]`}
        >
          <MessageCircle className="h-4 w-4 fill-current" aria-hidden="true" />
          <span>WhatsApp</span>
        </a>

        <a
          href={getCallLink()}
          tabIndex={open ? 0 : -1}
          aria-label="Call Pembe Africa Safaris"
          className={`${ACTION_CLASS} bg-[#C97A2B] hover:bg-[#b06521] focus-visible:outline-[#C97A2B]`}
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          <span>Call</span>
        </a>

        <a
          href={getEmailLink()}
          tabIndex={open ? 0 : -1}
          aria-label="Email Pembe Africa Safaris"
          className={`${ACTION_CLASS} bg-[#2A1810] hover:bg-[#3d2419] focus-visible:outline-[#E5A663]`}
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          <span>Email</span>
        </a>
      </div>

      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="contact-dock-actions"
        aria-label={open ? 'Close contact options' : 'Open contact options'}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1F1109] text-[#FAF2EB] shadow-xl transition-all duration-200 hover:bg-[#2A1810] motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5A663] active:scale-95"
      >
        {open ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
