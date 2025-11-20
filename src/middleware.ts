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

  return response;
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*', '/admin/:path*'],
};
