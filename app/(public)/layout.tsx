import type { ReactNode } from 'react'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import ContactDock from '@/components/ui/ContactDock'

export default function PublicLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        {/* Keeps the floating contact dock clear of footer links */}
        <div aria-hidden="true" className="h-24 bg-[#1F1109]" />
      </div>
      <ContactDock />
    </>
  )
}