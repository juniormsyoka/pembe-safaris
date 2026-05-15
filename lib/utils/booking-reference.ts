// lib/utils/booking-reference.ts
export function generateBookingReference(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0')
  return `PEM-${year}-${random}`
}