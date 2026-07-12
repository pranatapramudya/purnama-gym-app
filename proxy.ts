import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Tentukan rute publik (Webhook dan Halaman Sign In/Up)
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/2026/sign-in(.*)',
  '/api/webhooks/clerk(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect({ unauthenticatedUrl: new URL('/sign-in', req.url).toString() });
  }

  // Pass current path to server components to bypass layouts if needed
  const response = NextResponse.next();
  response.headers.set('x-pathname', req.nextUrl.pathname);
  return response;
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
