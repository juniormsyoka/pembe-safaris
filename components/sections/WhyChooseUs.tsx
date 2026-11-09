// components/WhyChooseUs.tsx
'use client'

import Image from 'next/image'
import { BookOpen, ShieldCheck } from 'lucide-react'

const WhyChooseUs = () => {
  return (
    <section className="py-16 md:py-24 bg-[#FAF2EB] text-[#2A1810]" id="why-choose-us">
      <div className="max-w-[1240px] mx-auto px-4 md:px-6">
        
        {/* Top Feature / Cultural Immersion Showcase */}
        <div className="relative rounded-[32px] overflow-hidden bg-[#2A1810] text-[#FAF2EB] p-8 md:p-12 lg:p-16 mb-16 md:mb-24 shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="z-10">
              <span className="text-[#C97A2B] font-semibold tracking-widest uppercase text-xs md:text-sm block mb-3">
                Authentic Heritage
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] mb-6">
                Discover the Wild Side of Kenya with Pembe Africa Safaris
              </h2>
              <p className="text-[#F5E3D2]/80 text-base md:text-lg leading-relaxed font-light">
                Immerse yourself deep into the heart of Kenya's breathtaking wilderness and rich local traditions, guided by those who call these legendary landscapes home.
              </p>
            </div>

            {/* Right Stacked Polaroid Images */}
            <div className="relative flex justify-center lg:justify-end items-center">
              <div className="relative w-full max-w-[420px] h-[280px] sm:h-[320px]">
                {/* Main Image Card */}
                <div className="absolute inset-0 rounded-[24px] overflow-hidden shadow-2xl border-4 border-white/90 transform -rotate-2 transition-transform hover:rotate-0 duration-500">
                  <Image
                    src="/images/destinations/samburu.jpg"
                    alt="Cultural safari experience"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Secondary Offset Image Card */}
                <div className="absolute -bottom-6 -left-6 sm:-left-10 w-44 sm:w-56 h-32 sm:h-40 rounded-[20px] overflow-hidden shadow-2xl border-4 border-white/90 transform rotate-6 transition-transform hover:rotate-2 duration-500 hidden sm:block">
                  <Image
                    src="/images/destinations/maasai-mara.jpg"
                    alt="Wildlife scenery"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Split Section: Experience the Wild Wonders + Editorial Polaroid Stack */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Content & Value Pillars */}
          <div>
            <span className="text-[#C97A2B] font-semibold tracking-widest uppercase text-xs md:text-sm block mb-2">
              Why Choose Us
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] mb-6 text-[#2A1810]">
              Experience the Wild Wonders of Kenya with Pembe Africa Safaris...
            </h2>
            
            <div className="space-y-8 mt-8">
              {/* Pillar 1 */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#F5E3D2] border border-[#C97A2B]/20 flex items-center justify-center flex-shrink-0 text-[#C97A2B]">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold mb-2 text-[#2A1810]">
                    Tailored Safari Adventures
                  </h3>
                  <p className="text-[#2A1810]/75 text-sm md:text-base leading-relaxed">
                    Choose from a selection of personalized safari packages, each designed to fulfill your specific adventure desires, from the breathtaking migrations of Maasai Mara to serene Diani Beach getaways.
                  </p>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#F5E3D2] border border-[#C97A2B]/20 flex items-center justify-center flex-shrink-0 text-[#C97A2B]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold mb-2 text-[#2A1810]">
                    Dedicated, Certified Guides
                  </h3>
                  <p className="text-[#2A1810]/75 text-sm md:text-base leading-relaxed">
                    Rest assured knowing our local guides are certified and committed to making your exploration safe, engaging, and unforgettable, enhanced with rich insights into Kenya's wildlife and culture.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Angled Polaroid Image Stack */}
          <div className="relative flex justify-center items-center py-8">
            <div className="relative w-full max-w-[460px] h-[380px] sm:h-[440px]">
              {/* Back Polariod Card */}
              <div className="absolute top-0 right-4 w-[75%][height:80%] sm:w-[320px] sm:h-[380px] bg-white p-4 pb-12 rounded-[24px] shadow-xl transform rotate-6 transition-transform duration-500 hover:rotate-3">
                <div className="relative w-full h-full rounded-[16px] overflow-hidden">
                  <Image
                    src="/images/destinations/amboseli.jpg"
                    alt="Amboseli Kilimanjaro view"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Front Polaroid Card */}
              <div className="absolute bottom-0 left-4 w-[75%] h-[80%] sm:w-[320px] sm:h-[380px] bg-white p-4 pb-12 rounded-[24px] shadow-2xl transform -rotate-3 transition-transform duration-500 hover:rotate-0 border border-[#2A1810]/10">
                <div className="relative w-full h-full rounded-[16px] overflow-hidden">
                  <Image
                    src="/images/destinations/tsavo.jpg"
                    alt="Wildlife safari adventure"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

export default WhyChooseUs