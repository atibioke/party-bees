import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyJWT, signJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST() {
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

    await dbConnect();

    // Update user's terms acceptance
    const user = await User.findByIdAndUpdate(
      payload.userId,
      {
        acceptedTerms: true,
        termsAcceptedAt: new Date(),
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Issue new JWT with updated acceptedTerms flag
    const newToken = await signJWT({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      profileCompleted: user.profileCompleted,
      acceptedTerms: true,
      isVerified: user.isVerified,
    });

    const response = NextResponse.json({
      success: true,
      data: {
        acceptedTerms: user.acceptedTerms,
        termsAcceptedAt: user.termsAcceptedAt,
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
    console.error('Accept terms error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
