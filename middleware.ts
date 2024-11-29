// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const role = req.cookies.get('role')?.value;
  const protectedRoutes = ['/dashboard', '/dashboard/settings', '/perfil'];

  // Si el usuario está intentando acceder a /login y ya tiene un token, redirigirlo a /dashboard
  if (token && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Si el usuario intenta acceder a una ruta protegida sin un token, redirigirlo a /login
  if (!token && protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  switch(role){
    case "ROLE_ADMIN":
      if (!req.nextUrl.pathname.startsWith("/dashboard/admin")) {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      }
      break;
    case "ROLE_EMPLOYEE":
      if (!req.nextUrl.pathname.startsWith("/dashboard/worker")) {
        return NextResponse.redirect(new URL("/dashboard/worker/products", req.url));
      }
      break;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/perfil/:path*', '/login'],
};
