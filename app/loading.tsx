export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <div className="mt-4 text-center text-gray-600">Loading amazing safaris...</div>
      </div>
    </div>
  )
}