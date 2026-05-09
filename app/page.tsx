// app/page.tsx
import Hero from '@/components/sections/Hero'
import FeaturedSafaris from '@/components/sections/FeaturedSafaris'
import WhyChooseUs from '@/components/sections/WhyChooseUs'
import Destinations from '@/components/sections/Destinations'
import Testimonials from '@/components/sections/Testimonials'
import Gallery from '@/components/sections/Gallery'
import Newsletter from '@/components/sections/Newsletter'
import { createClientInstance } from '@/lib/supabase/client'

async function getFeaturedPackages() {
  const supabase = createClientInstance()
  
  const { data: packages, error } = await supabase
    .from('packages')
    .select('*')
    .eq('featured', true)
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(4)
  
  if (error) {
    console.error('Error fetching packages:', error)
    return []
  }
  
  return packages || []
}

export default async function Home() {
  const featuredPackages = await getFeaturedPackages()
  
  return (
    <>
      <Hero />
      <FeaturedSafaris packages={featuredPackages} />
      <WhyChooseUs />
      <Destinations />
      <Testimonials />
      <Gallery />
      <Newsletter />
    </>
  )
}