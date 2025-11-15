import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Allow access to login page without auth
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }
  
  // Check authentication for all other admin routes
  if (pathname.startsWith('/admin')) {
    const session = request.cookies.get('admin_session');
    const isAuthenticated = session?.value === 'authenticated';
    
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};

