import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyJWT, signJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import { validateNigerianPhone } from '@/utils/phone';

export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const payload = await verifyJWT(token);
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { businessName, whatsapp } = await req.json();

    if (!businessName || !whatsapp) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate Nigerian phone number
    const phoneValidation = validateNigerianPhone(whatsapp);
    if (!phoneValidation.isValid) {
      return NextResponse.json(
        { success: false, error: phoneValidation.error || 'Invalid phone number' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Update user's profile
    const updatedUser = await User.findByIdAndUpdate(
      payload.userId,
      {
        businessName,
        whatsapp: phoneValidation.formatted!,
        profileCompleted: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Issue new JWT with updated profileCompleted flag
    const newToken = await signJWT({
      userId: updatedUser._id.toString(),
      email: updatedUser.email,
      role: updatedUser.role,
      profileCompleted: true,
      acceptedTerms: updatedUser.acceptedTerms,
      isVerified: updatedUser.isVerified,
    });

    const response = NextResponse.json({
      success: true,
      data: {
        businessName: updatedUser.businessName,
        whatsapp: updatedUser.whatsapp,
        profileCompleted: updatedUser.profileCompleted,
      },
    });

    // Set new token in cookie
    response.cookies.set('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Complete profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
