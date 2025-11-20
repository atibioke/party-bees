import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const supportEmail = process.env.SUPPORT_EMAIL || process.env.MAIL_FROM_ADDRESS || 'support@skiboh.com';

    // Send email to support
    await sendEmail({
      to: supportEmail,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #EC4899;">New Contact Form Submission</h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border-left: 4px solid #EC4899;">
            <h3 style="color: #1f2937; margin-top: 0;">Message:</h3>
            <p style="color: #4b5563; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
            This message was sent from the Skiboh contact form.
          </p>
        </div>
      `,
    });

    // Send confirmation email to user
    await sendEmail({
      to: email,
      subject: 'We received your message - Skiboh',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #EC4899;">Thank you for contacting us!</h2>
          <p>Hi ${name},</p>
          <p>We've received your message and will get back to you as soon as possible.</p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Your message:</strong></p>
            <p style="margin: 5px 0 0 0; color: #4b5563;">${message}</p>
          </div>
          <p>We typically respond within 24-48 hours during business days.</p>
          <p>Best regards,<br>The Skiboh Team</p>
        </div>
      `,
    }).catch(err => {
      // Don't fail the request if confirmation email fails
      console.error('Failed to send confirmation email:', err);
    });

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully!'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}

