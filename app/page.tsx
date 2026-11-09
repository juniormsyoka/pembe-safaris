// app/page.tsx
import Hero from '@/components/sections/Hero'
import FeaturedSafaris from '@/components/sections/FeaturedSafaris'
import WhyChooseUs from '@/components/sections/WhyChooseUs'
import Destinations from '@/components/sections/Destinations'
import Testimonials from '@/components/sections/Testimonials'
import Gallery from '@/components/sections/Gallery'
import Newsletter from '@/components/sections/Newsletter'
import { createClientInstance } from '@/lib/supabase/client'

import { getFeaturedPackages } from '@/lib/packages/packages'

/*
async function getFeaturedPackages() {
  const supabase = createClientInstance()
  
  const { data: packages, error } = await supabase
    .from('packages')
    .select('*')
    .eq('featured', true)
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(5)
  
  if (error) {
    console.error('Error fetching packages:', error)
    return []
  }
  
  return packages || []
}
*/
export default async function Home() {
  const featuredPackages = await getFeaturedPackages()
  
  return (
    <>
      <Hero />
      <Destinations />
      <FeaturedSafaris packages={featuredPackages} />
      
      <WhyChooseUs />
      {/*<Testimonials />*/}
      <Gallery />
     {/* <Newsletter />*/}
    </>
  )
}