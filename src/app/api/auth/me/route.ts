import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { logDebug } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    let token = cookieStore.get('token')?.value;

    // If no cookie, check Authorization header
    if (!token) {
       const { headers } = await import('next/headers');
       const headersList = await headers();
       const authHeader = headersList.get('authorization');
       if (authHeader && authHeader.startsWith('Bearer ')) {
         token = authHeader.substring(7);
       }
    }

    if (!token) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();
    
    // Ensure userId is a string (it might be an ObjectId or string)
    const userId = typeof payload.userId === 'string' 
      ? payload.userId 
      : String(payload.userId);
    
    logDebug('Me API - Token Payload:', { userId, email: payload.email });

    const user = await User.findById(userId).select('-password'); // Exclude password

    if (!user) {
      logDebug('Me API - User not found in DB for ID:', userId);
      console.error('User not found for userId:', userId, 'Payload:', payload);
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const response = NextResponse.json({ success: true, data: user });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
