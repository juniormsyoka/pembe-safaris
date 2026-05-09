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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div>
            <span className="text-primary font-semibold tracking-wider uppercase">
              Why Choose Us
            </span>
            <h2 className="section-title mt-2">
              Creating Unforgettable
              <span className="gradient-text"> Safari Memories</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-8">
              For over 25 years, Pembe Safaris has been dedicated to providing authentic, 
              sustainable, and life-changing safari experiences across Kenya. We don't just 
              show you wildlife; we immerse you in the magic of Africa.
            </p>

            {/* Feature List */}
            <div className="space-y-4 mb-8">
              {[
                'Best price guarantee',
                'Flexible booking & cancellation',
                'Sustainable tourism certified',
                'Emergency support 24/7',
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-gray-600 mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Features Grid */}
          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow group"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-serif text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
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