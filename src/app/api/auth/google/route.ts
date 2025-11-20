import { NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = process.env.NEXTAUTH_URL + '/api/auth/google/callback';

export async function GET() {
  try {
    if (!GOOGLE_CLIENT_ID) {
      return NextResponse.json(
        { success: false, error: 'Google OAuth not configured' },
        { status: 500 }
      );
    }

    // Generate a random state for CSRF protection
    const state = Math.random().toString(36).substring(7);
    
    // Build Google OAuth URL
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    googleAuthUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid email profile');
    googleAuthUrl.searchParams.set('state', state);
    googleAuthUrl.searchParams.set('access_type', 'offline');
    googleAuthUrl.searchParams.set('prompt', 'select_account');

    // Redirect to Google OAuth consent screen
    return NextResponse.redirect(googleAuthUrl.toString());
  } catch (error) {
    console.error('Google OAuth initiation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initiate Google OAuth' },
      { status: 500 }
    );
  }
}
