// lib/revenue/revenue.ts

export interface Booking {
  id: string
  status: string
  total_price: number
  [key: string]: any
}

export function calculateActiveRevenue(bookings: Booking[]) {
  return bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.total_price || 0), 0)
}

export function calculateTotalRevenue(bookings: Booking[]) {
  return bookings
    .reduce((sum, b) => sum + (b.total_price || 0), 0)
}

export function getRevenueBreakdown(bookings: Booking[]) {
  return {
    total: calculateTotalRevenue(bookings),
    active: calculateActiveRevenue(bookings),
    cancelled: bookings
      .filter(b => b.status === 'cancelled')
      .reduce((sum, b) => sum + (b.total_price || 0), 0),
    confirmed: bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + (b.total_price || 0), 0),
    completed: bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + (b.total_price || 0), 0),
    pending: bookings
      .filter(b => b.status === 'pending')
      .reduce((sum, b) => sum + (b.total_price || 0), 0)
  }
}