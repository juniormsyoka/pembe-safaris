// lib/email/templates/booking-confirmation.ts
export function getBookingConfirmationEmail(booking: any, packageDetails: any) {
  const formattedDate = new Date(booking.preferred_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation - ${booking.booking_reference}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f3f4f6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #1e3c3f 0%, #2a5a5e 100%); padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-family: Georgia, serif; }
    .header p { color: #e5e7eb; margin: 10px 0 0; }
    .content { padding: 30px; }
    .section { margin-bottom: 30px; border-bottom: 1px solid #e5e7eb; padding-bottom: 20px; }
    .section-title { font-size: 18px; font-weight: 700; color: #1e3c3f; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }
    .detail-row { display: flex; margin-bottom: 10px; }
    .detail-label { width: 140px; font-weight: 600; color: #4b5563; }
    .detail-value { flex: 1; color: #1f2937; }
    .reference-box { background-color: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
    .reference-box p { margin: 0; font-size: 20px; font-weight: 700; color: #1e3c3f; letter-spacing: 2px; }
    .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .status-confirmed { background-color: #10b981; color: white; }
    .status-pending { background-color: #f59e0b; color: white; }
    .footer { background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; font-size: 12px; color: #6b7280; }
    .button { display: inline-block; background-color: #1e3c3f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 15px; }
    @media (max-width: 480px) {
      .container { padding: 10px; }
      .content { padding: 20px; }
      .detail-row { flex-direction: column; }
      .detail-label { width: 100%; margin-bottom: 4px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✨ Booking Confirmed!</h1>
      <p>Your African safari adventure awaits</p>
    </div>
    
    <div class="content">
      <div class="reference-box">
        <p>📌 ${booking.booking_reference}</p>
      </div>
      
      <!-- Guest Information -->
      <div class="section">
        <div class="section-title">
          <span>👤</span> Guest Information
        </div>
        <div class="detail-row">
          <div class="detail-label">Full Name:</div>
          <div class="detail-value">${booking.customer_name}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Email:</div>
          <div class="detail-value">${booking.customer_email}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Phone:</div>
          <div class="detail-value">${booking.customer_phone}</div>
        </div>
      </div>
      
      <!-- Safari Details -->
      <div class="section">
        <div class="section-title">
          <span>🦁</span> Safari Details
        </div>
        <div class="detail-row">
          <div class="detail-label">Package:</div>
          <div class="detail-value">${packageDetails?.title || 'Custom Safari'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Travel Date:</div>
          <div class="detail-value">${formattedDate}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Travelers:</div>
          <div class="detail-value">${booking.number_of_travelers} person(s)</div>
        </div>
      </div>
      
      <!-- Special Requests -->
      ${booking.special_requests ? `
      <div class="section">
        <div class="section-title">
          <span>📝</span> Special Requests
        </div>
        <div class="detail-value">${booking.special_requests}</div>
      </div>
      ` : ''}
      
      <!-- Payment Summary -->
      <div class="section">
        <div class="section-title">
          <span>💰</span> Payment Summary
        </div>
        <div class="detail-row">
          <div class="detail-label">Total Amount:</div>
          <div class="detail-value"><strong>$${parseFloat(booking.total_price).toLocaleString()}</strong></div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Status:</div>
          <div class="detail-value">
            <span class="status ${booking.status === 'confirmed' ? 'status-confirmed' : 'status-pending'}">
              ${booking.status?.toUpperCase() || 'PENDING'}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Next Steps -->
      <div class="section">
        <div class="section-title">
          <span>📞</span> Next Steps
        </div>
        <p style="margin: 0 0 10px;">Our team will contact you within 24 hours to confirm all details.</p>
        <p style="margin: 0;">For any questions, contact us:</p>
        <ul style="margin-top: 10px; padding-left: 20px;">
          <li>📧 <a href="mailto:bookings@pembeafrica.com" style="color: #1e3c3f;">bookings@pembeafrica.com</a></li>
          <li>📞 <a href="tel:+254729436767" style="color: #1e3c3f;">+254 729 436 767</a></li>
          <li>💬 WhatsApp: <a href="https://wa.me/254729436767" style="color: #1e3c3f;">+254 729 436 767</a></li>
        </ul>
      </div>
      
      <div style="text-align: center;">
        <a href="https://yourdomain.com/track/${booking.booking_reference}" class="button">
          Track Your Booking →
        </a>
      </div>
    </div>
    
    <div class="footer">
      <p>© 2024 Pembe Africa Safaris. All rights reserved.</p>
      <p>Westlands, Peponi Road, Nairobi, Kenya</p>
      <p style="margin-top: 10px;">
        <a href="#" style="color: #6b7280;">Privacy Policy</a> | 
        <a href="#" style="color: #6b7280;">Terms of Service</a>
      </p>
    </div>
  </div>
</body>
</html>
  `
}