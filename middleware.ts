import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuth } from './src/lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const verifiedToken = token && await verifyAuth(token).catch((err) => {
    console.error(err.message);
    return null; // Token no válido o error en la verificación
  });

  // Redirigir si el token no es válido o no existe
  if (!verifiedToken) {
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (request.nextUrl.pathname.startsWith('/api')) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'authentication failed' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
