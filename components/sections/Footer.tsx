import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Send } from 'lucide-react'

const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
          
          {/* Company Info - Full width on mobile, spans 2 cols on tablet */}
          <div className="md:col-span-2 lg:col-span-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4 md:mb-6">
              <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                <Image
                  src="/logo.svg"
                  alt="Pembe Africa Safaris"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-left">
                <span className="font-serif text-lg md:text-xl font-bold block">
                  Pembe Africa
                </span>
                <span className="text-primary font-serif text-sm md:text-base">
                  Safaris
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto md:mx-0">
              Discover the magic of Kenya with Pembe Africa Safaris. We offer authentic safari experiences 
              that combine wildlife adventures with cultural immersion.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="font-serif text-base md:text-lg font-bold mb-4 md:mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {['WhyChooseUs', 'Safaris', 'Destinations', 'Gallery'].map((link) => (
                <li key={link}>
                  <Link
                    href={`/${link.toLowerCase().replace(' ', '-')}`}
                    className="inline-block text-gray-400 hover:text-primary transition-colors text-sm py-1 active:text-primary active:scale-95 touch-manipulation"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="text-center md:text-left">
            <h3 className="font-serif text-base md:text-lg font-bold mb-4 md:mb-5">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/contact" 
                  className="inline-block text-gray-400 hover:text-primary transition-colors text-sm py-1 active:text-primary active:scale-95 touch-manipulation"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/254729436767"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-gray-400 hover:text-primary transition-colors text-sm py-1 active:text-primary active:scale-95 touch-manipulation"
                >
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="font-serif text-base md:text-lg font-bold mb-4 md:mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start justify-center md:justify-start gap-3">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  Nairobi, Kenya<br />
                  Westlands, Peponi Road
                </span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <Phone className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                <a href="tel:+254729436767" className="text-gray-400 hover:text-primary text-sm transition-colors">
                  +254 729 436 767
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                <a href="mailto:deniskamwathi@gmail.com" className="text-gray-400 hover:text-primary text-sm transition-colors break-words">
                  deniskamwathi@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Mobile: column, Tablet: row */}
        <div className="border-t border-gray-800 mt-10 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-xs md:text-sm">
          <p className="text-center md:text-left order-2 md:order-1">
            &copy; {currentYear} Pembe Africa Safaris. All rights reserved.
          </p>
          <div className="flex gap-6 order-1 md:order-2">
            <a
              href="https://wa.me/254729436767"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors py-2 px-1 active:text-primary active:scale-95 touch-manipulation"
            >
              WhatsApp
            </a>
            <a
              href="#"
              className="hover:text-primary transition-colors py-2 px-1 active:text-primary active:scale-95 touch-manipulation"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-primary transition-colors py-2 px-1 active:text-primary active:scale-95 touch-manipulation"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}