import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail } from 'lucide-react'

const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    // Changed bg to match the deeper brown of the site, and container to match max-w
    <footer className="bg-[#1F1109] text-[#F5E3D2] border-t border-[#2A1810]">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 py-10 md:py-14 lg:py-16">
        
        {/* Changed lg:grid-cols-4 to lg:grid-cols-3 since Quick Links is hidden */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
          
          {/* Company Info */}
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
                <span className="font-serif text-lg md:text-xl font-bold block text-[#F5E3D2]">
                  Pembe Africa
                </span>
                <span className="text-[#C97A2B] font-serif text-sm md:text-base font-semibold tracking-wider">
                  SAFARIS
                </span>
              </div>
            </div>
            <p className="text-[#F5E3D2]/80 text-sm leading-relaxed max-w-md mx-auto md:mx-0">
              Discover the magic of Kenya with Pembe Africa Safaris. We offer authentic safari experiences 
              that combine wildlife adventures with cultural immersion.
            </p>
          </div>

          {/* Support */}
          <div className="text-center md:text-left">
            <h3 className="font-serif text-base md:text-lg font-bold mb-4 md:mb-5 text-[#E5A663]">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/contact" 
                  className="inline-block text-[#F5E3D2]/80 hover:text-[#C97A2B] transition-colors text-sm py-2 active:text-[#C97A2B] active:scale-95 touch-manipulation"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/254729436767"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[#F5E3D2]/80 hover:text-[#C97A2B] transition-colors text-sm py-2 active:text-[#C97A2B] active:scale-95 touch-manipulation"
                >
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="font-serif text-base md:text-lg font-bold mb-4 md:mb-5 text-[#E5A663]">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start justify-center md:justify-start gap-3">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[#C97A2B] flex-shrink-0 mt-0.5" />
                <span className="text-[#F5E3D2]/80 text-sm">
                  Nairobi, Kenya<br />
                  Westlands, Peponi Road
                </span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <Phone className="w-4 h-4 md:w-5 md:h-5 text-[#C97A2B] flex-shrink-0" />
                <a href="tel:+254729436767" className="text-[#F5E3D2]/80 hover:text-[#C97A2B] text-sm transition-colors py-1">
                  +254 729 436 767
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-[#C97A2B] flex-shrink-0" />
                <a href="mailto:deniskamwathi@gmail.com" className="text-[#F5E3D2]/80 hover:text-[#C97A2B] text-sm transition-colors break-words py-1">
                  deniskamwathi@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#2A1810] mt-10 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[#F5E3D2]/70 text-xs md:text-sm">
          <p className="text-center md:text-left order-2 md:order-1">
            &copy; {currentYear} Pembe Africa Safaris. All rights reserved.
          </p>
          
          {/* Added flex-wrap to prevent overflow on tiny screens */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 order-1 md:order-2">
            <a
              href="https://wa.me/254729436767"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C97A2B] transition-colors py-2 px-1 active:text-[#C97A2B] active:scale-95 touch-manipulation"
            >
              WhatsApp
            </a>
            <a
              href="#"
              className="hover:text-[#C97A2B] transition-colors py-2 px-1 active:text-[#C97A2B] active:scale-95 touch-manipulation"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-[#C97A2B] transition-colors py-2 px-1 active:text-[#C97A2B] active:scale-95 touch-manipulation"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}