import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt';
import { NextAuthUserSessionWithToken } from './types';
import { headers } from 'next/headers';

export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|widgets|auth|images|assets|icons|firebase-messaging-sw\\.js).*)'],
};

export async function middleware(request: NextRequest) {
  // Retrieve the JWT token
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET }) as NextAuthUserSessionWithToken;
  const url = request.nextUrl;
  const pathname = url.pathname;
  const headersList = headers();
  const referer = headersList.get('referer');

  // Define the allowed prefixes for each entity type
  const protectedRoute: Record<string, string> = {
    LENDER: '/lenders',
    VENDOR: '/vendors',
    SUPPLIER: '/suppliers',
    ADMIN: '/admin',
    CUSTOMER_PHARMACY: '/storefront',
  };

  if (token) {
    const {
      email, emailVerifiedAt, entityType, completeProfile, token: accessToken, account: { provider }
    } = token;

    let action = 'signin';
    if (referer && referer.includes('/auth/signin')) {
      action = 'signin';
    } else if (referer && referer.includes('/auth/signup')) {
      action = 'signup';
    }
    const from = referer ? encodeURIComponent(referer) : `/auth/${action}`;

    if (!email)
      return NextResponse.redirect(new URL(`/auth/signin`, request.url));

    if (provider === "credentials" && !emailVerifiedAt)
      return NextResponse.redirect(new URL(`/auth/verification?token=${accessToken}&action=${action}&from=${from}`, request.url));

    if (!completeProfile)
      return NextResponse.redirect(new URL(`/auth/business-information?token=${accessToken}&action=${action}&from=${from}`, request.url));

    // Check if the user is accessing an allowed route
    const allowedPrefix = protectedRoute[entityType];

    if (allowedPrefix && !pathname.startsWith(allowedPrefix)) {
      return NextResponse.redirect(new URL(allowedPrefix, request.url));
    }
  } else {
    const innerAppRouteList = Object.values(protectedRoute).find((prefix) => pathname.startsWith(prefix));
    if (innerAppRouteList) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }
  
  // Public routes e.g Website
  return NextResponse.next();
}