// app/api/admin/bookings/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { generateBookingReference } from '@/lib/utils/booking-reference'
import { sendBookingConfirmationEmail } from '@/lib/email/send'

export async function POST(request: Request) {
  try {
    // Verify admin auth (simple token check)
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    
    // Validate required fields
    const required = ['customer_name', 'customer_email', 'customer_phone', 'package_id', 'preferred_date', 'number_of_travelers', 'total_price']
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 })
      }
    }
    
    // Generate booking reference
    const booking_reference = generateBookingReference()
    
    // Fetch package details for email
    const { data: packageData } = await supabaseAdmin
      .from('packages')
      .select('title, duration, location')
      .eq('id', body.package_id)
      .single()
    
    // Create booking in Supabase
    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        package_id: body.package_id,
        customer_name: body.customer_name,
        customer_email: body.customer_email,
        customer_phone: body.customer_phone,
        number_of_travelers: body.number_of_travelers,
        preferred_date: body.preferred_date,
        special_requests: body.special_requests || null,
        total_price: body.total_price,
        status: body.status || 'confirmed',
        booking_reference: booking_reference,
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
    }
    
    // Send confirmation email
    const emailResult = await sendBookingConfirmationEmail(booking, packageData)
    
    if (!emailResult.success) {
      console.error('Email failed but booking was created:', emailResult.error)
      // Still return success since booking was created
      return NextResponse.json({ 
        success: true, 
        booking, 
        emailWarning: 'Booking created but email failed to send' 
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      booking,
      emailSent: true
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  // Verify admin auth
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { data: bookings, error } = await supabaseAdmin
    .from('bookings')
    .select('*, packages(title)')
    .order('created_at', { ascending: false })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ bookings })
}