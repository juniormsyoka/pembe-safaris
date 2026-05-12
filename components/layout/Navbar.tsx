// components/Navbar.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <div className="flex items-center space-x-2">
              <div className="relative w-12 h-12">
                <Image
                  src="/logo.svg"
                  alt="Pembe Africa Safaris"
                  fill
                  className="object-contain"
                />
              </div>
              <span className={`font-serif text-2xl font-bold transition-colors ${
                scrolled ? 'text-gray-900' : 'text-white'
              }`}>
                <div>
                  <div>Pembe</div>
                  <div className="text-primary">Africa Safaris</div>
                </div>

              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {['Safaris', 'Destinations', 'About', 'Gallery', 'Contact'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className={`font-medium transition-colors hover:text-primary group relative ${
                  scrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
            ))}
            
            {/* Destinations Dropdown */}
            <div className="relative group">
              <button className={`flex items-center space-x-1 font-medium ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`}>
                <span>Destinations</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                {['Maasai Mara', 'Amboseli', 'Tsavo', 'Samburu', 'Lake Nakuru'].map((dest) => (
                  <Link
                    key={dest}
                    href={`/destinations/${dest.toLowerCase().replace(' ', '-')}`}
                    className="block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    {dest}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/book-now"
              className="btn-primary !py-3 !px-6"
            >
              Book Your Safari
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden relative z-10 p-2 ${
              scrolled ? 'text-gray-900' : 'text-white'
            }`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden fixed inset-0 bg-black/95 backdrop-blur-lg transition-all duration-500 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}>
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {['Safaris', 'Destinations', 'About', 'Gallery', 'Contact'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-white text-2xl font-serif hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}
            <Link
              href="/book-now"
              className="btn-primary !px-10 !py-4 text-lg"
              onClick={() => setIsOpen(false)}
            >
              Book Your Safari
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar