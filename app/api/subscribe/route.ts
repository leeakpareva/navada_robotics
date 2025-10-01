import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscriber = await prisma.emailSubscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        await prisma.emailSubscriber.update({
          where: { email },
          data: { isActive: true, subscribedAt: new Date() },
        });

        return NextResponse.json(
          {
            success: true,
            message: 'Your subscription has been reactivated!',
          },
          { status: 200 }
        );
      }
    }

    // Create new subscriber
    const subscriber = await prisma.emailSubscriber.create({
      data: {
        email,
        source: source || 'unknown',
        isActive: true,
      },
    });

    // Send welcome email (optional)
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'NAVADA <noreply@navada.info>',
          to: email,
          subject: 'Welcome to NAVADA Newsletter!',
          html: `
            <h2>Thank you for subscribing!</h2>
            <p>You'll now receive updates about AI, robotics, and technology innovations from NAVADA.</p>
            <p>Stay tuned for exciting content!</p>
            <br>
            <p>Best regards,<br>Lee Akpareva<br>NAVADA Robotics</p>
          `,
        }),
      });
    } catch (emailError) {
      console.error('Welcome email error:', emailError);
    }

    // Notify admin
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'NAVADA Subscriptions <noreply@navada.info>',
          to: 'lee@navada.info',
          subject: 'New Newsletter Subscriber',
          html: `
            <h2>New Newsletter Subscription</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Source:</strong> ${source || 'unknown'}</p>
            <p><strong>Subscribed at:</strong> ${new Date().toLocaleString()}</p>
          `,
        }),
      });
    } catch (notifyError) {
      console.error('Admin notification error:', notifyError);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for subscribing! Check your email for confirmation.',
        id: subscriber.id,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
