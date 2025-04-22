import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    
    if (!token) {
      const signInUrl = new URL("/login", req.url);
      signInUrl.searchParams.set("callbackUrl", req.url); //TODO: this doesnt work for now.
      return NextResponse.redirect(signInUrl);
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log("Authorized Callback - Token:", token);
        return !!token;
      }
    },
    pages: {
      signIn: '/login' 
    }
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/home/:path*",
    "/products/:path*",
    "/orders/:path*",
  ]
};