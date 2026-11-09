// app/(public)/destinations/[slug]/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Camera, Clock, Star, CheckCircle, ChevronRight, ArrowLeft } from 'lucide-react'

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
 // reviews: number
}> = {
  'maasai-mara': {
    name: 'Maasai Mara National Reserve',
    location: 'Southwest Kenya',
    description: 'Witness the Great Migration and the Big Five in Africa\'s most famous reserve.',
    longDescription: `The Maasai Mara is Kenya's most celebrated game reserve, renowned for its exceptional populations of lions, leopards, cheetahs, and elephants. The annual wildebeest migration, one of the "Seven New Wonders of the World," sees over 1.5 million animals cross from the Serengeti into the Mara between July and October. Beyond the wildlife, the reserve is named after the Maasai people, who live in harmony with nature and offer rich cultural experiences.`,
    image: '/images/destinations/maasai-mara.jpg',
    gallery: [
      '/images/destinations/maasai-mara.jpg',
    ],
    bestTime: 'July - October (Migration season)',
    wildlife: ['Lions', 'Cheetahs', 'Leopards', 'Elephants', 'Buffalos', 'Wildebeest', 'Zebras', 'Giraffes', 'Hippos', 'Crocodiles'],
    activities: ['Game drives', 'Hot air balloon safaris', 'Maasai village visits', 'Night game drives', 'Bush dining'],
    highlights: [
      'Witness the Great Migration river crossings',
      'Spot the Big Five in one day',
      'Hot air balloon safari at sunrise',
      'Cultural visit to Maasai villages',
      'Sundowners overlooking the savannah'
    ],
    accommodations: [
      'Mara Serena Safari Lodge',
      'Angama Mara',
      'Governors Camp',
      'Mara Intrepids Camp',
      'Ashnil Mara Camp'
    ],
    rating: 4.9,
   // reviews: 1250,
  },
  'amboseli': {
    name: 'Amboseli National Park',
    location: 'Southern Kenya, near Tanzania border',
    description: 'Iconic views of Mount Kilimanjaro and large herds of elephants.',
    longDescription: `Amboseli National Park is famous for its breathtaking views of Mount Kilimanjaro, Africa's highest peak. The park is a photographer's paradise, offering spectacular photo opportunities of elephants with the snow-capped mountain as backdrop. Amboseli is also an important research center for elephant behavior, and you'll see large herds up close. The park features dried-up lake beds, swamps, and savanna grasslands that attract a variety of wildlife.`,
    image: '/images/destinations/amboseli.jpg',
    gallery: [
      '/images/destinations/amboseli.jpg',
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
    //reviews: 890,
  },
  'tsavo': {
    name: 'Tsavo National Park',
    location: 'Coastal Kenya, between Nairobi and Mombasa',
    description: 'Kenya\'s largest park, known for the man-eating lions and red elephants.',
    longDescription: `Tsavo National Park is one of the largest national parks in the world, divided into Tsavo East and Tsavo West. Famous for the "Man-eaters of Tsavo" lions, the park offers a rugged, wild experience. The red elephants of Tsavo, colored by the red soil dust, are unique to this area. Highlights include the Mzima Springs, where you can see hippos and crocodiles in crystal-clear water, and the lava tubes and volcanic cones.`,
    image: '/images/destinations/tsavo.jpg',
    gallery: [
      '/images/destinations/tsavo.jpg',
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
    //reviews: 756,
  },
  'samburu': {
    name: 'Samburu National Reserve',
    location: 'Northern Kenya',
    description: 'Unique wildlife species found only in this arid region.',
    longDescription: `Samburu National Reserve is a rugged, semi-arid landscape offering unique wildlife found nowhere else in Kenya. The "Samburu Special Five" includes the Grevy's zebra, reticulated giraffe, Beisa oryx, Somali ostrich, and gerenuk. The Ewaso Nyiro River cuts through the reserve, attracting wildlife and providing beautiful scenery. The local Samburu people, cousins of the Maasai, add cultural richness to the experience.`,
    image: '/images/destinations/samburu.jpg',
    gallery: [
      '/images/destinations/samburu.jpg',
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
    //reviews: 623,
  },
  'lake-nakuru': {
    name: 'Lake Nakuru National Park',
    location: 'Great Rift Valley',
    description: 'Famous for flamingos and rhino sanctuary.',
    longDescription: `Lake Nakuru National Park is famous for its millions of flamingos that gather along the lake's shores, creating a stunning pink spectacle. The park is also a rhino sanctuary, protecting both black and white rhinos. The lake's alkaline waters attract a variety of birdlife, making it a birder's paradise. The park also offers excellent sightings of lions, leopards, and Rothschild's giraffes.`,
    image: '/images/destinations/lake-nakuru.jpg',
    gallery: [
      '/images/destinations/lake-nakuru.jpg',
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
    //reviews: 512,
  },
}

function getDestinationBySlug(slug: string) {
  if (destinationsData[slug]) {
    return destinationsData[slug]
  }
  
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
  const { slug } = await params
  const destination = getDestinationBySlug(slug)

  if (!destination) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#FAF2EB] text-[#2A1810] pb-24">
      {/* Hero Section */}
      <div className="relative h-[45vh] sm:h-[55vh] overflow-hidden">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1109]/90 via-[#1F1109]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-[#FAF2EB]">
          <div className="max-w-[1240px] mx-auto text-center">
            <span className="text-[#E5A663] text-xs sm:text-sm font-semibold tracking-widest uppercase block mb-2">
              Destination Highlight
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-3 leading-[1.1]">
              {destination.name}
            </h1>
            <div className="flex items-center justify-center gap-2 text-[#FAF2EB]/90 text-xs sm:text-sm">
              <MapPin className="w-4 h-4 text-[#E5A663]" />
              <span>{destination.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#2A1810]/70 hover:text-[#C97A2B] transition-colors mb-6 text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Rating & Quick Info */}
        <div className="bg-white rounded-[24px] p-5 sm:p-6 shadow-[0_10px_30px_rgba(42,24,16,0.06)] flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-[#C97A2B] fill-current" />
              <span className="font-bold text-[#2A1810]">{destination.rating}</span>
             {/* <span className="text-[#2A1810]/60 text-sm">({destination.reviews} reviews)</span>*/}
            </div>
            <div className="flex items-center gap-1.5 text-[#2A1810]/70 text-sm">
              <Clock className="w-4 h-4 text-[#C97A2B]" />
              <span>Best: {destination.bestTime.split('(')[0].trim()}</span>
            </div>
          </div>
          <Link
            href="/book-now"
            className="w-full sm:w-auto text-center bg-[#2A1810] text-[#FAF2EB] px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#C97A2B] transition-all duration-300 shadow-md active:scale-95"
          >
            Book This Destination →
          </Link>
        </div>

        {/* Description */}
        <div className="bg-white rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 shadow-[0_10px_30px_rgba(42,24,16,0.06)] mb-8">
          <h2 className="text-2xl font-serif font-bold mb-4 text-[#2A1810]">About {destination.name}</h2>
          <p className="text-[#2A1810]/75 text-sm sm:text-base leading-relaxed">{destination.longDescription}</p>
        </div>

        {/* Wildlife */}
        <div className="bg-white rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 shadow-[0_10px_30px_rgba(42,24,16,0.06)] mb-8">
          <h2 className="text-2xl font-serif font-bold mb-4 text-[#2A1810]">Wildlife You'll See</h2>
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {destination.wildlife.map((animal, index) => (
              <span key={index} className="px-4 py-2 bg-[#FAF2EB] rounded-full text-xs sm:text-sm font-medium text-[#2A1810] border border-[#2A1810]/5">
                {animal}
              </span>
            ))}
          </div>
        </div>

        {/* Activities & Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 shadow-[0_10px_30px_rgba(42,24,16,0.06)]">
            <h2 className="text-2xl font-serif font-bold mb-6 text-[#2A1810]">Top Activities</h2>
            <ul className="space-y-4">
              {destination.activities.map((activity, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#FAF2EB] text-[#C97A2B]">
                    <Camera className="w-4 h-4" />
                  </div>
                  <span className="text-[#2A1810]/75 text-sm sm:text-base self-center">{activity}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 shadow-[0_10px_30px_rgba(42,24,16,0.06)]">
            <h2 className="text-2xl font-serif font-bold mb-6 text-[#2A1810]">Highlights</h2>
            <ul className="space-y-4">
              {destination.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#FAF2EB] text-[#C97A2B]">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-[#2A1810]/75 text-sm sm:text-base self-center">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Accommodations */}
        <div className="bg-white rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 shadow-[0_10px_30px_rgba(42,24,16,0.06)] mb-8">
          <h2 className="text-2xl font-serif font-bold mb-6 text-[#2A1810]">Where to Stay</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {destination.accommodations.map((accommodation, index) => (
              <div key={index} className="bg-[#FAF2EB]/60 rounded-2xl p-4 border border-[#2A1810]/5 flex items-center gap-3">
                <span className="text-lg">🏨</span>
                <span className="text-[#2A1810] font-medium text-sm">{accommodation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Best Time to Visit Banner */}
        <div className="bg-[#2A1810] text-[#FAF2EB] rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 text-center mb-8 shadow-lg">
          <span className="text-[#C97A2B] text-xs font-semibold uppercase tracking-widest block mb-2">Seasonal Guidance</span>
          <h3 className="font-serif text-xl sm:text-2xl font-bold mb-2">Best Time to Visit</h3>
          <p className="text-[#FAF2EB]/80 text-sm sm:text-base">{destination.bestTime}</p>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <Link
            href="/book-now"
            className="inline-flex items-center justify-center gap-2 bg-[#C97A2B] text-[#FAF2EB] px-8 py-4 rounded-full font-semibold hover:bg-[#2A1810] transition-colors text-sm sm:text-base shadow-lg active:scale-95"
          >
            Plan Your Visit to {destination.name.split(' ')[0]}
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}