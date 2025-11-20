import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // CORS handling
  const origin = request.headers.get('origin');
  const allowedOrigins = ['http://localhost:8081', 'http://localhost:8082', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];
  
  // Simple CORS check or allow all for development if origin is in list
  // For development, we can be permissive
  const isAllowedOrigin = origin && allowedOrigins.some(o => origin.startsWith(o));

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    response.headers.set('Access-Control-Allow-Origin', origin || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
    return response;
  }

  const response = NextResponse.next();

  if (origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check if user needs to accept terms
    if (!payload.acceptedTerms) {
      return NextResponse.redirect(new URL('/terms-acceptance', request.url));
    }

    // Check if user needs to complete profile
    if (!payload.profileCompleted) {
      return NextResponse.redirect(new URL('/profile-setup', request.url));
    }
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Note: Admin role check is done in the API routes and page components
    // Middleware only checks authentication
  }

  // Guard terms-acceptance route
  if (pathname === '/terms-acceptance') {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // If user has already accepted terms, redirect to profile-setup or dashboard
    if (payload.acceptedTerms) {
      if (!payload.profileCompleted) {
        return NextResponse.redirect(new URL('/profile-setup', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Guard profile-setup route
  if (pathname === '/profile-setup') {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // If user hasn't accepted terms yet, redirect to terms-acceptance
    if (!payload.acceptedTerms) {
      return NextResponse.redirect(new URL('/terms-acceptance', request.url));
    }

    // If profile is already completed, redirect to dashboard
    if (payload.profileCompleted) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*', '/admin/:path*', '/terms-acceptance', '/profile-setup'],
};
