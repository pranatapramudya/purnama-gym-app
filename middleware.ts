import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Tentukan rute publik (Webhook dan Halaman Sign In/Up)
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/api/webhooks/clerk(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
