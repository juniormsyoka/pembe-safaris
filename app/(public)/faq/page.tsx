'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    question: 'How do I book a safari with Pembe Safaris?',
    answer: 'You can book directly through our website by filling out the Book Now form, or contact us via email or WhatsApp. Our team will respond within 24 hours to help you plan your perfect safari.',
  },
  {
    question: 'What is included in the safari package price?',
    answer: 'Our packages typically include: accommodation, game drives in 4x4 vehicles, park entrance fees, professional English-speaking guide, bottled water during safaris, and airport transfers. Meals are included as specified in each package.',
  },
  {
    question: 'When is the best time to go on safari in Kenya?',
    answer: 'The best time for wildlife viewing is during the dry season from June to October. For the Great Migration in Maasai Mara, July to September is ideal. The wet season (November to May) offers lower rates and beautiful landscapes.',
  },
  {
    question: 'Do I need a visa to visit Kenya?',
    answer: 'Most international visitors require a visa to enter Kenya. You can apply for an eVisa online before travel. We recommend checking with your local Kenyan embassy for specific requirements.',
  },
  {
    question: 'Is it safe to travel on safari in Kenya?',
    answer: 'Yes, Kenya is a safe safari destination. Our guides are experienced professionals who prioritize your safety. We recommend following common-sense safety practices and listening to your guide\'s instructions.',
  },
  {
    question: 'What should I pack for my safari?',
    answer: 'Essentials include: neutral-colored clothing (khaki, beige, olive), comfortable walking shoes, hat, sunglasses, sunscreen, insect repellent, camera, binoculars, and any personal medications.',
  },
  {
    question: 'Can I customize my safari itinerary?',
    answer: 'Absolutely! We specialize in creating custom itineraries based on your interests, budget, and schedule. Contact us with your preferences and we\'ll design a personalized safari for you.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Cancellation policies vary by package. Generally, we require a deposit to secure your booking. Please review our terms when booking or contact us for specific details.',
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Everything you need to know about planning your safari with Pembe Safaris
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-800">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center p-8 bg-primary/10 rounded-2xl">
          <p className="text-gray-700 mb-4">Still have questions?</p>
          <a
            href="https://wa.me/254729436767"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            Chat with us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}