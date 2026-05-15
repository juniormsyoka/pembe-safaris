// lib/email/send.ts
import { Resend } from 'resend'
import { getBookingConfirmationEmail } from './templates/booking-confirmation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendBookingConfirmationEmail(booking: any, packageDetails: any) {
  const html = getBookingConfirmationEmail(booking, packageDetails)
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Pembe Africa Safaris <bookings@pembeafrica.com>',
      to: [booking.customer_email],
      subject: `✅ Safari Booking Confirmed - ${booking.booking_reference}`,
      html: html,
      replyTo: 'bookings@pembeafrica.com',
    })
    
    if (error) {
      console.error('Email error:', error)
      return { success: false, error }
    }
    
    return { success: true, data }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }
}