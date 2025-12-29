import createMiddleware from 'next-intl/middleware';
import { routing } from '@/lib/routing';
 
export default createMiddleware(routing);
 
export const config = {
  // Match all pathnames except API, Next.js internals, and static files
  matcher: ['/((?!api|_next|_vercel|favicon.svg|logo.svg|.*\\..*).*)']
};
