import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Send } from 'lucide-react'

const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2 mb-4 md:mb-6">
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <Image
                  src="/logo.svg"
                  alt="Pembe Africa Safaris"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-serif text-lg md:text-xl lg:text-2xl font-bold">
                Pembe <br className="hidden sm:block" />
                <span className="text-primary"> Africa Safaris</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm md:text-base mb-4 md:mb-6 leading-relaxed max-w-md mx-auto sm:mx-0">
              Discover the magic of Kenya with Pembe Africa Safaris. We offer authentic safari experiences 
              that combine wildlife adventures with cultural immersion.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="font-serif text-base md:text-lg font-bold mb-3 md:mb-4">Quick Links</h3>
            <ul className="space-y-2 md:space-y-3">
              {['About Us', 'Safaris', 'Destinations', 'Gallery'].map((link) => (
                <li key={link}>
                  <Link
                    href={`/${link.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-400 hover:text-primary transition-colors text-sm md:text-base active:text-primary"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="text-center sm:text-left">
            <h3 className="font-serif text-base md:text-lg font-bold mb-3 md:mb-4">Support</h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary transition-colors text-sm md:text-base active:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/254729436767"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors text-sm md:text-base active:text-primary"
                >
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center sm:text-left">
            <h3 className="font-serif text-base md:text-lg font-bold mb-3 md:mb-4">Contact Us</h3>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start justify-center sm:justify-start space-x-2 md:space-x-3">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm md:text-base">
                  Nairobi, Kenya<br />
                  Westlands, Peponi Road
                </span>
              </li>
              <li className="flex items-center justify-center sm:justify-start space-x-2 md:space-x-3">
                <Phone className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                <span className="text-gray-400 text-sm md:text-base">+254 729 436 767</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start space-x-2 md:space-x-3">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                <span className="text-gray-400 text-sm md:text-base break-all">deniskamwathi@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 md:mt-10 lg:mt-12 pt-6 md:pt-8 flex flex-col sm:flex-row justify-between items-center text-gray-400 text-xs md:text-sm gap-3 md:gap-0">
          <p className="text-center sm:text-left">&copy; {currentYear} Pembe Safaris Africa. All rights reserved.</p>
          <div className="flex space-x-4 md:space-x-6">
            <a
              href="https://wa.me/254729436767"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors active:text-primary"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}