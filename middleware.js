import { NextResponse } from 'next/server';
import * as jose from 'jose';

// Define protected routes and their required roles
const protectedRoutes = {
  '/super-admin': ['Super Admin'],
  '/admin': ['Faculty Admin', 'Super Admin', 'Faculty', 'Admin'],
  '/student': ['Student'],
};

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // Find the required roles for the current path
  let requiredRoles = null;
  for (const [route, roles] of Object.entries(protectedRoutes)) {
    if (path.startsWith(route)) {
      requiredRoles = roles;
      break;
    }
  }

  // If route is not protected, continue
  if (!requiredRoles) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  if (!token) {
    // If no token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify token using jose for Edge runtime compatibility
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);

    const userRole = payload.role;

    // Check if user has required role
    if (!requiredRoles.includes(userRole)) {
      // Redirect unauthorized users
      if (userRole === 'Student') {
        return NextResponse.redirect(new URL('/student/dashboard', request.url));
      } else if (['Faculty Admin', 'Faculty', 'Admin'].includes(userRole)) {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else if (userRole === 'Super Admin') {
        return NextResponse.redirect(new URL('/super-admin/dashboard', request.url));
      } else {
         return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid or expired token
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/super-admin/:path*', '/admin/:path*', '/student/:path*'],
};
