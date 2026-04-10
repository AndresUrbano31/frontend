import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if user is authenticated by looking for auth cookie
  const isAuthenticated = request.cookies.has('patientAuth') || 
    !!request.headers.get('x-patient-auth');

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/'];

  // If trying to access protected route without auth, redirect to login
  if (!publicRoutes.includes(pathname) && !isAuthenticated) {
    // Check localStorage approach - redirect to login
    if (pathname.startsWith('/dashboard') || 
        pathname.startsWith('/appointment') || 
        pathname.startsWith('/medical-history') ||
        pathname.startsWith('/lab-results')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If logged in and trying to access auth pages, redirect to dashboard
  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
