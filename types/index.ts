export interface Safari {
  id: string
  title: string
  slug: string
  location: string
  duration: string
  groupSize: string
  price: number
  rating: number
  reviews: number
  image: string
  badge?: string
  description: string
  highlights: string[]
  itinerary: ItineraryItem[]
  inclusions: string[]
  exclusions: string[]
}

export interface ItineraryItem {
  day: number
  title: string
  description: string
  activities: string[]
  accommodation: string
  meals: string[]
}

export interface Destination {
  id: string
  name: string
  slug: string
  description: string
  image: string
  highlights: string[]
  bestTimeToVisit: string
  wildlife: string[]
}

export interface Testimonial {
  id: string
  name: string
  location: string
  image: string
  rating: number
  text: string
  safari: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  author: string
  date: string
  category: string
  readTime: string
}

export interface BookingFormData {
  safariId: string
  startDate: Date
  endDate: Date
  adults: number
  children: number
  name: string
  email: string
  phone: string
  specialRequests?: string
}