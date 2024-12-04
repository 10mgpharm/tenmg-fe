import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt';
import { NextAuthUserSessionWithToken } from './types';

export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|widgets|auth|images|assets|icons).*)'],
};

export async function middleware(request: NextRequest) {
  // Retrieve the JWT token
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET }) as NextAuthUserSessionWithToken;

  if (token) {
    const entityType = token.entityType;
    const url = request.nextUrl;
    const pathname = url.pathname;

    // Define the allowed prefixes for each entity type
    const allowedRoutes: Record<string, string> = {
      VENDOR: '/vendors',
      SUPPLIER: '/suppliers',
      ADMIN: '/admin',
      CUSTOMER_PHARMACY: '/storefront',
    };

    // Check if the user is accessing an allowed route
    const allowedPrefix = allowedRoutes[entityType];

    if (allowedPrefix && !pathname.startsWith(allowedPrefix)) {
      console.log(`Redirecting ${entityType} to their allowed route: ${allowedPrefix}`);
      return NextResponse.redirect(new URL(allowedPrefix, request.url));
    }
  } else {
    console.log('No user is logged in');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}