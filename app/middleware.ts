import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server";
 
export default convexAuthNextjsMiddleware();
 
export const config = {
  // The following matcher runs middleware on all routes
  // except static assets and our auth API route
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)((?!(/auth.*)).*)"
  ],
};