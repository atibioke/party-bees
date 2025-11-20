import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
