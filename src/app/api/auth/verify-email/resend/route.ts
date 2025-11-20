import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { sendEmail } from '@/lib/mail';
import { getSession } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    // Try to get user from session first
    const session = await getSession();
    let email: string | undefined;

    if (session?.user && typeof session.user.email === 'string') {
      email = session.user.email;
    } else {
      // If no session, check body (for when user is not logged in but trying to verify)
      const body = await req.json().catch(() => ({}));
      email = body.email;
    }

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ success: false, error: 'Email is already verified' }, { status: 400 });
    }

    // Re-send existing token or generate new one if expired? 
    // For simplicity, let's just send the existing one if valid, or we should probably check expiry.
    // But the model logic in signup generated a 24h token. 
    // If it's expired, we should generate a new one.
    
    if (user.verificationTokenExpires && new Date() > user.verificationTokenExpires) {
        // Token expired, generate new one
        user.verificationToken = crypto.randomBytes(32).toString('hex');
        user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        await user.save();
    }

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${user.verificationToken}`;
    
    await sendEmail({
      to: email,
      subject: 'Verify your Skiboh account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #EC4899;">Verify Email Address</h2>
          <p>Hi ${user.businessName},</p>
          <p>You requested to resend your verification email. Click the button below to verify.</p>
          <a href="${verificationUrl}" style="display: inline-block; background-color: #EC4899; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Verify Email</a>
          <p>Or click this link: <a href="${verificationUrl}">${verificationUrl}</a></p>
          <p>This link expires in 24 hours.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: 'Verification email sent' });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

