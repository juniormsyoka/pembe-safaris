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
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  // 1. Define the Organization Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Pembe Africa Safaris",
    "url": "https://pembeafricasafaris.com",
    // IMPORTANT: Update this URL to your actual logo path (e.g., /logo.png or /images/logo.png)
    "logo": "https://pembeafricasafaris.com/icon.png", 
    "description": "Discover the magic of Kenya with Pembe Africa Safaris. Expert-guided wildlife adventures, luxury camping, and cultural experiences in Africa's most stunning landscapes.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+254-705-531116", // I changed the country code to +254 (Kenya) based on your metadata
      "contactType": "customer service"
    }
  };

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {/* 2. Inject the Schema into the HTML */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
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
