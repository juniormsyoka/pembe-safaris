import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import SessionProviderWrapper from '@/components/providers/SessionProviderWrapper'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Pembe Africa Safaris - Authentic Kenyan Safari Experiences',
  description: 'Discover the magic of Kenya with Pembe Africa Safaris. Expert-guided wildlife adventures, luxury camping, and cultural experiences in Africa\'s most stunning landscapes.',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
         <SessionProviderWrapper> 
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
             <WhatsAppButton />
         </SessionProviderWrapper> 
      </body>
    </html>
  )
}