import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { rawFindOne, parseOid } from '@/lib/rawMongo';

export async function POST(req) {
  try {
    const { email, password, role } = await req.json();

    // Find user based on role grouping using rawMongo to bypass Mongoose/dbConnect
    let user;
    if (role === 'Staff' || role === 'Faculty Admin') {
      // Allow legacy 'Faculty Admin' or new 'Staff' role string from frontend
      user = await rawFindOne('User', { email, role: { $in: ['Faculty Admin', 'Faculty', 'Super Admin', 'Admin', 'STAFF', 'SUPER_ADMIN'] } });
    } else {
      user = await rawFindOne('User', { email, role: { $in: ['Student', 'STUDENT'] } });
    }

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials or role' }, { status: 401 });
    }

    if (user.isActive === false || user.active === false) {
      return NextResponse.json({ message: 'Your account has been deactivated. Please contact support.' }, { status: 403 });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT - JWT_SECRET must be set, no fallback
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET not configured');
      return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
    }

    const userId = parseOid(user._id);

    const token = jwt.sign(
      { userId, role: user.role, email: user.email },
      jwtSecret,
      { expiresIn: '1d' }
    );

    // Create response with cookie
    const response = NextResponse.json({ 
      message: 'Logged in successfully', 
      role: user.role,
      forcePasswordChange: user.forcePasswordChange || false
    }, { status: 200 });

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 day
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'An error occurred during login' }, { status: 500 });
  }
}