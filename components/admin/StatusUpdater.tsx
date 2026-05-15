// components/admin/StatusUpdater.tsx
'use client'

import { useState , useEffect} from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { CheckCircle, Loader2 } from 'lucide-react'
//import { bookingreference } from '@/lib/utils/booking-reference'
interface StatusUpdaterProps {
  bookingId: string
  currentStatus: string
  statusOptions: Array<{
    value: string
    label: string
    color: string
    bgColor: string
  }>
}

export default function StatusUpdater({ bookingId, currentStatus, statusOptions }: StatusUpdaterProps) {
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

   useEffect(() => {
    setSelectedStatus(currentStatus)
  }, [currentStatus])

  const handleStatusUpdate = async () => {
    if (selectedStatus === currentStatus) {
      setMessage({ type: 'error', text: 'Status is already set to this value' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    setIsUpdating(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: selectedStatus })
        .eq('id', bookingId)

      if (error) throw error

      setMessage({ type: 'success', text: 'Booking status updated successfully' })
     window.location.href = window.location.href + '?t=' + Date.now()
     // window.location.reload()
     // router.refresh()
     //router.push(`/track/${bookingReference}`)
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error updating status:', error)
      setMessage({ type: 'error', text: 'Failed to update status. Please try again.' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setIsUpdating(false)
    }
  }

  const getSelectedOptionStyle = () => {
    const option = statusOptions.find(opt => opt.value === selectedStatus)
    return option || statusOptions[0]
  }

  const selectedStyle = getSelectedOptionStyle()

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className={`px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent ${selectedStyle.color} font-medium bg-white`}
          disabled={isUpdating}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value} className={option.color}>
              {option.label}
            </option>
          ))}
        </select>
        
        <button
          onClick={handleStatusUpdate}
          disabled={isUpdating || selectedStatus === currentStatus}
          className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Update Status</span>
            </>
          )}
        </button>
      </div>
      
      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}
      
    {/*  <p className="text-xs text-gray-500">
        Current status: <span className={`font-medium ${selectedStyle.color}`}>{selectedStyle.label}</span>
        </p>*/}
    </div>
  )
}