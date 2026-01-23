import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define routes that should be accessible without logging in
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/login(.*)',
  '/signup(.*)',
  '/api/webhooks(.*)',
  '/',             // Landing page
  '/book(.*)',     // Public booking page
  '/review(.*)',   // Public review page
  '/ref(.*)'       // Public referral page
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
