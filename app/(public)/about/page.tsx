// app/(routes)/about/page.tsx
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-serif font-bold mb-8 text-center">
          About <span className="text-primary">Pembe Africa Safaris</span>
        </h1>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-gray-600 mb-6">
            For over 25 years, Pembe Africa Safaris has been dedicated to providing authentic, 
            sustainable, and life-changing safari experiences across Kenya.
          </p>
          <p className="text-lg text-gray-600">
            Our name "Pembe" means "tusk" in Swahili, symbolizing our commitment to 
            wildlife conservation and responsible tourism.
          </p>
        </div>
      </div>
    </div>
  )
}