// components/Navbar.tsx - With class-based background
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  const destinations = ['Maasai Mara', 'Amboseli', 'Tsavo', 'Samburu', 'Lake Nakuru']

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-lg border-b border-gray-100 py-2 md:py-3' 
          : 'bg-gradient-to-r from-black/30 to-transparent backdrop-blur-sm py-3 md:py-5'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="relative z-10 active:scale-95 transition-transform">
              <div className="flex items-center space-x-1.5 md:space-x-2">
                <div className="relative w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12">
                  <Image
                    src="/logo.svg"
                    alt="Pembe Africa Safaris"
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 32px, 48px"
                  />
                </div>
                <span className={`font-serif font-bold transition-colors leading-tight ${
                  scrolled ? 'text-gray-900' : 'text-white'
                }`}>
                  <div className="text-sm md:text-base lg:text-xl">Pembe</div>
                  <div className="text-primary text-[10px] md:text-xs lg:text-sm">Africa Safaris</div>
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {['Safaris', 'About', 'Gallery', 'Contact'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className={`font-medium transition-colors hover:text-primary group relative py-2 ${
                    scrolled ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  {item}
                  <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                </Link>
              ))}
              
              {/* Destinations Dropdown - Desktop */}
              <div className="relative group">
                <button className={`flex items-center space-x-1 font-medium py-2 ${
                  scrolled ? 'text-gray-700' : 'text-white'
                }`}>
                  <span>Destinations</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  {destinations.map((dest) => (
                    <Link
                      key={dest}
                      href={`/destinations/${dest.toLowerCase().replace(' ', '-')}`}
                      className="block px-4 py-2.5 text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors text-sm"
                    >
                      {dest}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/book-now"
                className="btn-primary !py-2.5 !px-5 text-sm"
              >
                Book Your Safari
              </Link>
            </div>

            {/* Mobile Menu Button - Larger touch area */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden relative z-50 p-2.5 -mr-2 rounded-lg transition-colors active:scale-95 touch-manipulation ${
                scrolled ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Slide from right */}
      <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
        isOpen ? 'visible' : 'invisible pointer-events-none'
      }`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Menu Panel - Using CSS class with !important */}
        <div className={`absolute right-0 top-0 h-full w-full max-w-sm shadow-2xl transition-transform duration-300 ease-out mobile-menu-panel ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Force background with inline style as backup */}
          <div 
            className="absolute inset-0 -z-10"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #fff5eb 100%)',
              backgroundColor: '#ffffff',
            }}
          />
          
          <div className="relative flex flex-col h-full pt-20 pb-6 px-5 overflow-y-auto">
            {/* Menu Items - Larger touch targets */}
            <div className="flex flex-col space-y-1">
              {['Safaris', 'About', 'Gallery', 'Contact'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="block px-4 py-3.5 text-gray-800 text-base font-medium hover:text-primary hover:bg-primary/5 rounded-lg transition-colors active:bg-primary/10"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              ))}
              
              {/* Destinations Dropdown - Mobile */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => toggleDropdown('destinations')}
                  className="flex items-center justify-between w-full px-4 py-3.5 text-gray-800 text-base font-medium hover:text-primary hover:bg-primary/5 rounded-lg transition-colors active:bg-primary/10"
                >
                  <span>Destinations</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    openDropdown === 'destinations' ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {openDropdown === 'destinations' && (
                  <div className="ml-4 pl-2 border-l-2 border-primary/20 space-y-0.5">
                    {destinations.map((dest) => (
                      <Link
                        key={dest}
                        href={`/destinations/${dest.toLowerCase().replace(' ', '-')}`}
                        className="block px-4 py-3 text-gray-600 text-sm hover:text-primary hover:bg-primary/5 rounded-lg transition-colors active:bg-primary/10"
                        onClick={() => setIsOpen(false)}
                      >
                        {dest}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Book Now Button */}
            <div className="mt-auto pt-6 border-t border-gray-200">
              <Link
                href="/book-now"
                className="block w-full btn-primary text-center py-3.5 text-base active:scale-95 transition-transform"
                onClick={() => setIsOpen(false)}
              >
                Book Your Safari
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar