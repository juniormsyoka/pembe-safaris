import { getAllPackages } from '@/lib/packages/packages'
import BookingForm from '@/components/forms/BookingForm'

export default async function BookNowPage() {
  // Fetch all active packages from Supabase
  const packages = await getAllPackages()

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 bg-[#FAF2EB] text-[#2A1810]">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-[clamp(2rem,5vw,3rem)] font-bold mb-3 tracking-tight">
            Book Your <em className="font-normal text-[#C97A2B]">Safari</em>
          </h1>
          <p className="text-[#2A1810]/70 text-sm sm:text-base max-w-lg mx-auto">
            Fill out the form below and we'll help you plan the perfect African adventure.
          </p>
        </div>

        {/* Render the Client Component and pass the database data */}
        <BookingForm packages={packages} />

      </div>
    </div>
  )
}