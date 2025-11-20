import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { signJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import { logDebug } from '@/lib/logger';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.NEXTAUTH_URL + '/api/auth/google/callback';

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  id_token: string;
}

interface GoogleUserInfo {
  sub: string; // Google user ID
  email: string;
  email_verified: boolean;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(new URL(`/login?error=${error}`, req.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL('/login?error=no_code', req.url));
    }

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return NextResponse.redirect(new URL('/login?error=oauth_not_configured', req.url));
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', await tokenResponse.text());
      return NextResponse.redirect(new URL('/login?error=token_exchange_failed', req.url));
    }

    const tokens: GoogleTokenResponse = await tokenResponse.json();

    // Fetch user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userInfoResponse.ok) {
      console.error('Failed to fetch user info');
      return NextResponse.redirect(new URL('/login?error=user_info_failed', req.url));
    }

    const googleUser: GoogleUserInfo = await userInfoResponse.json();

    logDebug('Google User Info:', { email: googleUser.email, sub: googleUser.sub, name: googleUser.name });

    await dbConnect();

    // 1. Try to find by Google ID first (Primary Identity)
    let user = await User.findOne({ googleId: googleUser.sub });

    if (user) {
      // Check if email matches
      if (user.email !== googleUser.email) {
        logDebug('Conflict detected: Google ID matches user but email does not. Unlinking old user.', { 
          dbEmail: user.email, 
          googleEmail: googleUser.email,
          userId: user._id 
        });
        
        // Unlink the old user to fix the corruption
        user.googleId = undefined;
        await user.save();
        user = null; // Reset user to fall through to email check
      } else {
        logDebug('Found existing user by Google ID:', { id: user._id, email: user.email });
      }
    }

    // 2. If no user found by Google ID (or unlinked), try by Email
    if (!user) {
      user = await User.findOne({ email: googleUser.email });
      
      if (user) {
        logDebug('Found existing user by email. Linking Google Account.', { email: user.email });
        user.googleId = googleUser.sub;
        user.provider = 'google';
        await user.save();
      }
    }

    // 3. If still no user, Create New
    if (!user) {
      logDebug('Creating new user for:', googleUser.email);
      user = await User.create({
        email: googleUser.email,
        googleId: googleUser.sub,
        name: googleUser.name,
        businessName: googleUser.name, // Temporary, will be updated in profile setup
        provider: 'google',
        profileCompleted: false,
        acceptedTerms: false,
      });
    }

    // Create JWT session
    const token = await signJWT({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      profileCompleted: user.profileCompleted,
      acceptedTerms: user.acceptedTerms,
    });

    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Redirect based on user state
    let redirectUrl = '/dashboard';
    
    if (!user.acceptedTerms) {
      redirectUrl = '/terms-acceptance';
    } else if (!user.profileCompleted) {
      redirectUrl = '/profile-setup';
    }

    return NextResponse.redirect(new URL(redirectUrl, req.url));
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=oauth_failed', req.url));
  }
}
