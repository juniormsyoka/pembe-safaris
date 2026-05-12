import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, type } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const subjectLine = type === 'booking' 
      ? `New Booking Inquiry: ${subject || 'Safari Booking'}`
      : `New Contact Message: ${subject || 'Website Inquiry'}`

    const emailContent = `
      <h2>New ${type === 'booking' ? 'Booking Inquiry' : 'Contact Message'}</h2>
      
      <p><strong>From:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
      
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
      
      <hr>
      <p><small>Sent from Pembe Africa Safaris website</small></p>
    `

    const { data, error } = await resend.emails.send({
      from: 'Pembe Africa Safaris <onboarding@resend.dev>',
      to: [process.env.CONTACT_EMAIL || 'deniskamwathi@gmail.com'],
      subject: subjectLine,
      html: emailContent,
      replyTo: email,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}