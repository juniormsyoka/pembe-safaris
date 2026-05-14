// components/WhyChooseUs.tsx
import { 
  Compass, 
  Shield, 
  Users, 
  Camera, 
  Leaf, 
  Heart,
  CheckCircle 
} from 'lucide-react'

const WhyChooseUs = () => {
  const features = [
    {
      icon: Compass,
      title: 'Expert Local Guides',
      description: 'Our guides are born and raised in Kenya, with decades of experience in wildlife conservation and local culture.',
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Your safety is our priority with well-maintained vehicles, first-aid trained staff, and 24/7 support.',
    },
    {
      icon: Users,
      title: 'Small Groups',
      description: 'Intimate safari experiences with maximum 8 people per vehicle for personalized attention.',
    },
    {
      icon: Camera,
      title: 'Photography Focused',
      description: 'Specially designed itineraries for photography enthusiasts with expert guidance.',
    },
    {
      icon: Leaf,
      title: 'Eco-Conscious',
      description: 'We practice responsible tourism, supporting conservation and local communities.',
    },
    {
      icon: Heart,
      title: 'Customized Experiences',
      description: 'Tailor-made itineraries to match your interests, budget, and travel style.',
    },
  ]

  const stats = [
    { value: '100%', label: 'Local Ownership' },
    { value: '15+', label: 'Languages Spoken' },
    { value: '50+', label: 'Community Projects' },
    { value: '0', label: 'Carbon Footprint' },
  ]

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div>
            <span className="text-primary font-semibold tracking-wider uppercase text-xs md:text-sm">
              Why Choose Us
            </span>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-3 md:mb-4">
              Creating Unforgettable
              <span className="gradient-text"> Safari Memories</span>
            </h2>
            
            <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8">
              For over 25 years, Pembe Africa Safaris has been dedicated to providing authentic, 
              sustainable, and life-changing safari experiences across Kenya. We don't just 
              show you wildlife; we immerse you in the magic of Africa.
            </p>

            {/* Feature List - Mobile: 1 column, Desktop: inline grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
              {[
                'Best price guarantee',
                'Flexible booking & cancellation',
                'Sustainable tourism certified',
                'Emergency support 24/7',
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2 md:space-x-3">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0" />
                  <span className="text-sm md:text-base text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            {/* Stats Grid - Mobile: 2 columns */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-50 rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 text-center">
                  <div className="text-xl md:text-2xl lg:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs md:text-sm text-gray-600 mt-1 md:mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Features Grid - Mobile: 1 column, Tablet: 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 lg:gap-6 mt-8 lg:mt-0">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 hover:shadow-lg transition-shadow group active:scale-95"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-primary/10 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-serif text-base md:text-lg lg:text-xl font-bold mb-1 md:mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-xs md:text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs