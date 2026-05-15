import type { ReactNode } from 'react'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'

export default function PublicLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}