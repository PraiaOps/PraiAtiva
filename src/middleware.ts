import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes and their required roles
const protectedRoutes = {
  '/dashboard/admin': ['admin'],
  '/dashboard/instrutor': ['instructor'],
  '/dashboard/empreendedor': ['entrepreneur'],
  '/dashboard/aluno': ['student', 'instructor', 'admin', 'entrepreneur']
};

// Middleware para tratamento de rotas
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get auth session from cookie
  const authSession = request.cookies.get('session')?.value;
  
  // Check if the route is protected
  const isProtectedRoute = Object.keys(protectedRoutes).some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // If no session, redirect to login
    if (!authSession) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }
  
  // If not protected or has session, allow access
  return NextResponse.next();
}

// Define which routes should be processed by this middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/perfil/:path*',
    '/atividades/criar',
    '/atividades/editar/:path*'
  ]
};