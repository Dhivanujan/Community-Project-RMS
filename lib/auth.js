import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import dbConnect from './dbConnect';
import User from '@/models/User';

// Verify JWT token — reads from httpOnly cookie in request headers OR Authorization header
export async function verifyToken(request) {
  try {
    let token = null;

    // 1. Try reading the 'token' cookie directly from the request Cookie header
    //    (this works reliably in all Next.js Route Handlers)
    const cookieHeader = request?.headers?.get('cookie') || '';
    if (cookieHeader) {
      const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
      if (match) {
        token = decodeURIComponent(match[1]);
      }
    }

    // 2. Fall back to Authorization: Bearer header (Postman / programmatic calls)
    if (!token) {
      token = request?.headers?.get('authorization')?.replace('Bearer ', '') || null;
    }

    if (!token) {
      return null;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
  } catch (error) {
    return null;
  }
}

// Middleware to require authentication
export async function requireAuth(request) {
  const decoded = await verifyToken(request);

  if (!decoded) {
    return {
      authorized: false,
      response: NextResponse.json(
        { message: 'Unauthorized: Invalid or missing token' },
        { status: 401 }
      ),
    };
  }

  return {
    authorized: true,
    user: decoded,
  };
}

// Middleware to require admin role
// NOTE: The User model uses role: 'Faculty Admin' for admin users
export async function requireAdmin(request) {
  const { authorized, user, response } = await requireAuth(request);

  if (!authorized) {
    return { authorized: false, response };
  }

  // Accept both 'Faculty Admin' (DB value) and 'Admin' (legacy fallback)
  if (user.role !== 'Faculty Admin' && user.role !== 'Admin') {
    return {
      authorized: false,
      response: NextResponse.json(
        { message: 'Forbidden: Admin access required' },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    user,
  };
}

// Middleware to require student role
export async function requireStudent(request) {
  const { authorized, user, response } = await requireAuth(request);

  if (!authorized) {
    return { authorized: false, response };
  }

  if (user.role !== 'Student') {
    return {
      authorized: false,
      response: NextResponse.json(
        { message: 'Forbidden: Student access required' },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    user,
  };
}

// Get current user from database
export async function getCurrentUser(userId) {
  try {
    await dbConnect();
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    return null;
  }
}
