import { NextResponse } from 'next/server'

interface EmailData {
  to: string
  subject: string
  html: string
  from?: string
}

interface EventRegistrationData {
  name: string
  email: string
  eventName: string
  eventId: string
  phone?: string
  company?: string
  jobTitle?: string
}

export async function sendEmail(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
  try {
    // For now, we'll log the email instead of actually sending it
    // This can be replaced with actual email service like Resend, SendGrid, etc.
    console.log('📧 Email to be sent:', {
      to: emailData.to,
      subject: emailData.subject,
      from: emailData.from || 'NAVADA Events <events@navadarobotics.com>',
      html: emailData.html.substring(0, 100) + '...'
    })

    // In production, you would integrate with an actual email service here:
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // const result = await resend.emails.send(emailData)

    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    }
  }
}

export function generateEventRegistrationConfirmationEmail(data: EventRegistrationData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event Registration Confirmation</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #8b5cf6, #a855f7); padding: 40px 20px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: bold; }
        .header p { color: #e9d5ff; margin: 10px 0 0 0; font-size: 16px; }
        .content { padding: 40px 20px; }
        .content h2 { color: #1f2937; margin: 0 0 20px 0; font-size: 24px; }
        .content p { color: #374151; line-height: 1.6; margin: 0 0 16px 0; }
        .event-details { background-color: #f9fafb; border-left: 4px solid #8b5cf6; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .event-details h3 { margin: 0 0 15px 0; color: #1f2937; font-size: 18px; }
        .detail-row { margin: 8px 0; color: #374151; }
        .detail-label { font-weight: 600; color: #1f2937; }
        .button { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #a855f7); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .footer { background-color: #1f2937; color: white; padding: 30px 20px; text-align: center; }
        .footer p { margin: 5px 0; opacity: 0.8; }
        .social { margin: 20px 0; }
        .social a { color: #8b5cf6; text-decoration: none; margin: 0 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>NAVADA</h1>
          <p>Registration Confirmed!</p>
        </div>

        <div class="content">
          <h2>Welcome to ${data.eventName}!</h2>

          <p>Hi ${data.name},</p>

          <p>Thank you for registering for <strong>${data.eventName}</strong>! We're excited to have you join us for this innovative event.</p>

          <div class="event-details">
            <h3>Event Details</h3>
            <div class="detail-row"><span class="detail-label">Event:</span> ${data.eventName}</div>
            <div class="detail-row"><span class="detail-label">Date:</span> 01/12/2025</div>
            <div class="detail-row"><span class="detail-label">Time:</span> 09:30 - 18:00</div>
            <div class="detail-row"><span class="detail-label">Location:</span> The XCHG, 22 Bishopsgate, London</div>
            <div class="detail-row"><span class="detail-label">Registration ID:</span> ${data.eventId}</div>
          </div>

          <div class="event-details">
            <h3>Your Registration Details</h3>
            <div class="detail-row"><span class="detail-label">Name:</span> ${data.name}</div>
            <div class="detail-row"><span class="detail-label">Email:</span> ${data.email}</div>
            ${data.phone ? `<div class="detail-row"><span class="detail-label">Phone:</span> ${data.phone}</div>` : ''}
            ${data.company ? `<div class="detail-row"><span class="detail-label">Company:</span> ${data.company}</div>` : ''}
            ${data.jobTitle ? `<div class="detail-row"><span class="detail-label">Role:</span> ${data.jobTitle}</div>` : ''}
          </div>

          <p><strong>What to expect:</strong></p>
          <ul style="color: #374151; line-height: 1.6;">
            <li>Hands-on AI workshops and live demonstrations</li>
            <li>Networking with industry leaders and innovators</li>
            <li>4-hour hackathon with mentorship from experts</li>
            <li>Insights into AI opportunities in Africa and enterprise</li>
            <li>Feedback from experienced founders and investors</li>
          </ul>

          <p>We'll send you additional details and updates as the event approaches. If you have any questions, feel free to reach out to us.</p>

          <a href="https://navadarobotics.com/solutions/events" class="button">View Event Details</a>

          <p>Looking forward to seeing you there!</p>

          <p>Best regards,<br>
          <strong>The NAVADA Team</strong></p>
        </div>

        <div class="footer">
          <h3 style="margin: 0 0 10px 0; color: white;">NAVADA</h3>
          <p>Navigating Artistic Vision with Advanced Digital Assistance</p>
          <div class="social">
            <a href="https://navadarobotics.com">Website</a> |
            <a href="mailto:contact@navadarobotics.com">Contact</a>
          </div>
          <p style="font-size: 12px; margin-top: 20px;">
            You received this email because you registered for ${data.eventName}.<br>
            NAVADA Robotics © 2024. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function sendEventRegistrationConfirmation(registrationData: EventRegistrationData): Promise<{ success: boolean; error?: string }> {
  const emailHtml = generateEventRegistrationConfirmationEmail(registrationData)

  return await sendEmail({
    to: registrationData.email,
    subject: `Registration Confirmed: ${registrationData.eventName}`,
    html: emailHtml,
    from: 'NAVADA Events <events@navadarobotics.com>'
  })
}