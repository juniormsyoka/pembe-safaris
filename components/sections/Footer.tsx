import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail } from 'lucide-react'
import { getWhatsAppEnquiryLink } from '@/lib/contact'

const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="bg-[#1F1109] text-[#F5E3D2] border-t border-[#2A1810]">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 py-8 md:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Brand + blurb */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-3">
              <div className="relative w-8 h-8 md:w-9 md:h-9 flex-shrink-0">
                <Image
                  src="/logo.svg"
                  alt="Pembe Africa Safaris"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-left">
                <span className="font-serif text-base md:text-lg font-bold block leading-tight">
                  Pembe Africa
                </span>
                <span className="text-[#C97A2B] font-serif text-xs md:text-sm font-semibold tracking-wider leading-tight">
                  SAFARIS
                </span>
              </div>
            </div>
            <p className="text-[#F5E3D2]/75 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto sm:mx-0 text-center sm:text-left">
              Discover the magic of Kenya with authentic safari experiences that
              combine wildlife adventures with cultural immersion.
            </p>
          </div>

          {/* Support */}
          <div className="text-center sm:text-left">
            <h3 className="font-serif text-sm font-bold mb-2.5 text-[#E5A663]">
              Support
            </h3>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/contact"
                  className="inline-block text-[#F5E3D2]/75 hover:text-[#C97A2B] transition-colors text-xs sm:text-sm py-1"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href={getWhatsAppEnquiryLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[#F5E3D2]/75 hover:text-[#C97A2B] transition-colors text-xs sm:text-sm py-1"
                >
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center sm:text-left">
            <h3 className="font-serif text-sm font-bold mb-2.5 text-[#E5A663]">
              Contact Us
            </h3>
            <ul className="space-y-2.5">
              <li className="flex items-start justify-center sm:justify-start gap-2">
                <MapPin className="w-4 h-4 text-[#C97A2B] flex-shrink-0 mt-0.5" />
                <span className="text-[#F5E3D2]/75 text-xs sm:text-sm leading-snug">
                  Nairobi, Kenya
                </span>
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <Phone className="w-4 h-4 text-[#C97A2B] flex-shrink-0" />
                <a
                  href="tel:+254729436767"
                  className="text-[#F5E3D2]/75 hover:text-[#C97A2B] text-xs sm:text-sm transition-colors"
                >
                  +254 729 436 767
                </a>
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-4 h-4 text-[#C97A2B] flex-shrink-0" />
                <a
                  href="mailto:hello@pembeafricasafaris.com?subject=Safari%20Inquiry%20-%20Pembe%20Africa%20Safaris&body=Hello%20Pembe%20Africa%20Safaris%20Team,%0A%0AI%20am%20interested%20in%20booking%20a%20safari%20and%20would%20like%20more%20details.%0A%0A[Your%20Message%20Here]%0A%0AThank%20you!"
                  className="text-[#F5E3D2]/75 hover:text-[#C97A2B] text-xs sm:text-sm transition-colors break-all"
                >
                  hello@pembeafricasafaris.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#2A1810] mt-6 md:mt-8 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[#F5E3D2]/60 text-xs">
          <p className="text-center sm:text-left order-2 sm:order-1">
            &copy; {currentYear} Pembe Africa Safaris. All rights reserved.
          </p>
          <a
            href={getWhatsAppEnquiryLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#C97A2B] transition-colors order-1 sm:order-2"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  )
}