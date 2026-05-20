import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  // Buscamos la cookie que usaremos como testigo de sesión
  const sessionToken = request.cookies.get('session-token')?.value;

  // Si no hay token, redirigimos al login arrastrando la ruta original como callback
  if (!sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// OBLIGATORIO: Definir estrictamente qué rutas pasan por este middleware
export const config = {
  matcher: [
    '/galeria/:path*',
    '/upload/:path*',
  ],
};