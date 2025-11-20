import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { sendEmail } from '@/lib/mail';
import { validateNigerianPhone } from '@/utils/phone';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { businessName, email, whatsapp, password, acceptedTerms } = await req.json();

    if (!businessName || !email || !whatsapp || !password) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (!acceptedTerms) {
      return NextResponse.json({ success: false, error: 'You must accept the terms and conditions' }, { status: 400 });
    }

    // Validate Nigerian phone number
    const phoneValidation = validateNigerianPhone(whatsapp);
    if (!phoneValidation.isValid) {
      return NextResponse.json({ success: false, error: phoneValidation.error || 'Invalid phone number' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      businessName,
      email,
      whatsapp: phoneValidation.formatted!,
      password: hashedPassword,
      provider: 'local',
      acceptedTerms: true,
      termsAcceptedAt: new Date(),
      verificationToken,
      verificationTokenExpires,
      isVerified: false,
    });

    // Send verification email (don't await to speed up response)
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    
    sendEmail({
      to: email,
      subject: 'Verify your Skiboh account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #EC4899;">Welcome to Skiboh!</h2>
          <p>Hi ${businessName},</p>
          <p>Thanks for signing up. Please verify your email address to get started.</p>
          <a href="${verificationUrl}" style="display: inline-block; background-color: #EC4899; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Verify Email</a>
          <p>Or click this link: <a href="${verificationUrl}">${verificationUrl}</a></p>
          <p>This link expires in 24 hours.</p>
        </div>
      `,
    }).catch(err => console.error('Failed to send verification email:', err));

    // Create session immediately after signup
    // Convert ObjectId to string for JWT payload
    const token = await signJWT({ 
      userId: user._id.toString(), 
      email: user.email, 
      role: user.role,
      profileCompleted: true, // Local signups have completed profile
      acceptedTerms: true,
      isVerified: false // Initial state
    });
    
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({ success: true, data: { id: user._id, email: user.email, businessName: user.businessName } }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
