import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Calendar, Camera, Clock, Users, Star, CheckCircle, ChevronRight } from 'lucide-react'

// Destination data
const destinationsData: Record<string, {
  name: string
  location: string
  description: string
  longDescription: string
  image: string
  gallery: string[]
  bestTime: string
  wildlife: string[]
  activities: string[]
  highlights: string[]
  accommodations: string[]
  rating: number
  reviews: number
}> = {
  'maasai-mara': {
    name: 'Maasai Mara National Reserve',
    location: 'Southwest Kenya',
    description: 'Witness the Great Migration and the Big Five in Africa\'s most famous reserve.',
    longDescription: `The Maasai Mara is Kenya's most celebrated game reserve, renowned for its exceptional populations of lions, leopards, cheetahs, and elephants. The annual wildebeest migration, one of the "Seven New Wonders of the World," sees over 1.5 million animals cross from the Serengeti into the Mara between July and October. Beyond the wildlife, the reserve is named after the Maasai people, who live in harmony with nature and offer rich cultural experiences.`,
    image: '/images/destinations/maasai-mara.jpg',
    gallery: [
      '/images/destinations/maasai-mara.jpg',
      '/images/gallery/wildlife/lion.jpg',
      '/images/gallery/landscapes/mara-river.jpg',
    ],
    bestTime: 'July - October (Migration season)',
    wildlife: ['Lions', 'Cheetahs', 'Leopards', 'Elephants', 'Buffalos', 'Wildebeest', 'Zebras', 'Giraffes', 'Hippos', 'Crocodiles'],
    activities: ['Game drives', 'Hot air balloon safaris', 'Maasai village visits', 'Night game drives', 'Bush dining'],
    highlights: [
      'Witness the Great Migration river crossings',
      'Spot the Big Five in one day',
      'Hot air balloon safari at sunrise',
      'Cultural visit to Maasai villages',
      'Sundowners overlooking the savanna'
    ],
    accommodations: [
      'Mara Serena Safari Lodge',
      'Angama Mara',
      'Governors Camp',
      'Mara Intrepids Camp',
      'Ashnil Mara Camp'
    ],
    rating: 4.9,
    reviews: 1250,
  },
  'amboseli': {
    name: 'Amboseli National Park',
    location: 'Southern Kenya, near Tanzania border',
    description: 'Iconic views of Mount Kilimanjaro and large herds of elephants.',
    longDescription: `Amboseli National Park is famous for its breathtaking views of Mount Kilimanjaro, Africa's highest peak. The park is a photographer's paradise, offering spectacular photo opportunities of elephants with the snow-capped mountain as backdrop. Amboseli is also an important research center for elephant behavior, and you'll see large herds up close. The park features dried-up lake beds, swamps, and savanna grasslands that attract a variety of wildlife.`,
    image: '/images/destinations/amboseli.jpg',
    gallery: [
      '/images/destinations/amboseli.jpg',
      '/images/gallery/wildlife/elephant.jpg',
      '/images/gallery/landscapes/kilimanjaro.jpg',
    ],
    bestTime: 'June - October (Dry season for best views)',
    wildlife: ['Elephants', 'Buffalos', 'Hippos', 'Giraffes', 'Zebras', 'Wildebeest', 'Lions', 'Cheetahs', 'Hyenas', 'Flamingos'],
    activities: ['Game drives', 'Photography tours', 'Bird watching', 'Maasai cultural visits', 'Observation Hill hike'],
    highlights: [
      'Elephants against Mount Kilimanjaro',
      'Observation Hill panoramic views',
      'Swamp areas with abundant wildlife',
      'Lake Amboseli bird watching',
      'Maasai community experiences'
    ],
    accommodations: [
      'Amboseli Serena Safari Lodge',
      'Ol Tukai Lodge',
      'Kilimanjaro Safari Club',
      'Tortilis Camp',
      'Kibo Safari Camp'
    ],
    rating: 4.8,
    reviews: 890,
  },
  'tsavo': {
    name: 'Tsavo National Park',
    location: 'Coastal Kenya, between Nairobi and Mombasa',
    description: 'Kenya\'s largest park, known for the man-eating lions and red elephants.',
    longDescription: `Tsavo National Park is one of the largest national parks in the world, divided into Tsavo East and Tsavo West. Famous for the "Man-eaters of Tsavo" lions, the park offers a rugged, wild experience. The red elephants of Tsavo, colored by the red soil dust, are unique to this area. Highlights include the Mzima Springs, where you can see hippos and crocodiles in crystal-clear water, and the lava tubes and volcanic cones.`,
    image: '/images/destinations/tsavo.jpg',
    gallery: [
      '/images/destinations/tsavo.jpg',
      '/images/gallery/wildlife/elephant.jpg',
      '/images/gallery/landscapes/sunset.jpg',
    ],
    bestTime: 'May - September (Dry season)',
    wildlife: ['Red Elephants', 'Lions', 'Leopards', 'Giraffes', 'Zebras', 'Buffalos', 'Hippos', 'Crocodiles', 'Ostriches', 'Kudus'],
    activities: ['Game drives', 'Mzima Springs visit', 'Lava tube exploration', 'Bird watching', 'Shetani Lava Flow hike'],
    highlights: [
      'Mzima Springs underwater viewing',
      'Red elephants in the wild',
      'Lava tubes and volcanic formations',
      'The famous Tsavo lions history',
      'Lugard Falls scenic views'
    ],
    accommodations: [
      'Sarova Salt Lick Safari Lodge',
      'Kilaguni Serena Safari Lodge',
      'Voi Safari Lodge',
      'Ashnil Aruba Lodge',
      'Finch Hattons Luxury Camp'
    ],
    rating: 4.7,
    reviews: 756,
  },
  'samburu': {
    name: 'Samburu National Reserve',
    location: 'Northern Kenya',
    description: 'Unique wildlife species found only in this arid region.',
    longDescription: `Samburu National Reserve is a rugged, semi-arid landscape offering unique wildlife found nowhere else in Kenya. The "Samburu Special Five" includes the Grevy's zebra, reticulated giraffe, Beisa oryx, Somali ostrich, and gerenuk. The Ewaso Nyiro River cuts through the reserve, attracting wildlife and providing beautiful scenery. The local Samburu people, cousins of the Maasai, add cultural richness to the experience.`,
    image: '/images/destinations/samburu.jpg',
    gallery: [
      '/images/destinations/samburu.jpg',
      '/images/gallery/wildlife/giraffe.jpg',
      '/images/gallery/cultural/village.jpg',
    ],
    bestTime: 'June - October (Dry season for best viewing)',
    wildlife: ['Grevy\'s Zebra', 'Reticulated Giraffe', 'Beisa Oryx', 'Somali Ostrich', 'Gerenuk', 'Elephants', 'Lions', 'Leopards', 'Cheetahs', 'Crocodiles'],
    activities: ['Game drives', 'Samburu cultural visits', 'Bird watching', 'Ewaso Nyiro river walks', 'Night game drives'],
    highlights: [
      'The Samburu Special Five unique species',
      'Ewaso Nyiro River wildlife viewing',
      'Samburu village cultural experiences',
      'Butterfly and bird watching',
      'Scenic semi-arid landscapes'
    ],
    accommodations: [
      'Saruni Samburu',
      'Elephant Bedroom Camp',
      'Samburu Intrepids Camp',
      'Ashnil Samburu Camp',
      'Larsens Camp'
    ],
    rating: 4.8,
    reviews: 623,
  },
  'lake-nakuru': {
    name: 'Lake Nakuru National Park',
    location: 'Great Rift Valley',
    description: 'Famous for flamingos and rhino sanctuary.',
    longDescription: `Lake Nakuru National Park is famous for its millions of flamingos that gather along the lake's shores, creating a stunning pink spectacle. The park is also a rhino sanctuary, protecting both black and white rhinos. The lake's alkaline waters attract a variety of birdlife, making it a birder's paradise. The park also offers excellent sightings of lions, leopards, and Rothschild's giraffes.`,
    image: '/images/destinations/lake-nakuru.jpg',
    gallery: [
      '/images/destinations/lake-nakuru.jpg',
      '/images/gallery/wildlife/rhino.jpg',
      '/images/gallery/landscapes/sunset.jpg',
    ],
    bestTime: 'November - April (Best for bird watching)',
    wildlife: ['Flamingos', 'Black Rhinos', 'White Rhinos', 'Lions', 'Leopards', 'Rothschild Giraffes', 'Waterbucks', 'Buffalos', 'Pelicans', 'Fish Eagles'],
    activities: ['Game drives', 'Bird watching', 'Baboon Cliff viewpoint', 'Makalia Falls visit', 'Rhino tracking'],
    highlights: [
      'Millions of flamingos on the lake',
      'Both black and white rhinos',
      'Baboon Cliff panoramic views',
      'Makalia Falls',
      'Lion hill for predator sightings'
    ],
    accommodations: [
      'Lake Nakuru Lodge',
      'Sarova Lion Hill Lodge',
      'The Cliff Luxury Camp',
      'Lake Nakuru Sopa Lodge',
      'Mbweha Camp'
    ],
    rating: 4.6,
    reviews: 512,
  },
}

// Helper function to get destination by slug
function getDestinationBySlug(slug: string) {
  // Direct match
  if (destinationsData[slug]) {
    return destinationsData[slug]
  }
  
  // Try to find by alternative slug (e.g., 'tsavo-national-park' vs 'tsavo')
  for (const [key, value] of Object.entries(destinationsData)) {
    const normalizedKey = key.toLowerCase()
    const normalizedSlug = slug.toLowerCase()
    if (normalizedKey.includes(normalizedSlug) || normalizedSlug.includes(normalizedKey)) {
      return value
    }
  }
  
  return null
}

export default async function DestinationPage({ params }: { params: { slug: string } }) {
  // Await params before accessing
  const { slug } = await params
  
  // Debug: Log the slug to see what's being received
  console.log('Destination slug:', slug)
  
  const destination = getDestinationBySlug(slug)

  if (!destination) {
    notFound()
  }

  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <div className="relative h-[50vh] overflow-hidden">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div className="px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">
              {destination.name}
            </h1>
            <div className="flex items-center justify-center gap-2 text-white/90">
              <MapPin className="w-5 h-5" />
              <span>{destination.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Rating & Quick Info */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="font-bold">{destination.rating}</span>
              <span className="text-gray-500">({destination.reviews} reviews)</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Best: {destination.bestTime.split('(')[0].trim()}</span>
            </div>
          </div>
          <Link
            href="/book-now"
            className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
          >
            Book This Destination →
          </Link>
        </div>

        {/* Description */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-4">About {destination.name}</h2>
          <p className="text-gray-600 leading-relaxed">{destination.longDescription}</p>
        </div>

        {/* Wildlife */}
        <div className="mb-12 bg-gray-50 rounded-2xl p-6">
          <h2 className="text-2xl font-serif font-bold mb-4">Wildlife You'll See</h2>
          <div className="flex flex-wrap gap-2">
            {destination.wildlife.map((animal, index) => (
              <span key={index} className="px-4 py-2 bg-white rounded-full text-sm shadow-sm">
                {animal}
              </span>
            ))}
          </div>
        </div>

        {/* Activities & Highlights Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-serif font-bold mb-4">Top Activities</h2>
            <ul className="space-y-3">
              {destination.activities.map((activity, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Camera className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{activity}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold mb-4">Highlights</h2>
            <ul className="space-y-3">
              {destination.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Accommodations */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-4">Where to Stay</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {destination.accommodations.map((accommodation, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <span className="text-gray-700">🏨 {accommodation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Best Time to Visit */}
        <div className="bg-primary/10 rounded-2xl p-6 text-center mb-12">
          <h3 className="text-xl font-bold mb-2">Best Time to Visit</h3>
          <p className="text-gray-700">{destination.bestTime}</p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/book-now"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-colors"
          >
            Plan Your Visit to {destination.name.split(' ')[0]}
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}