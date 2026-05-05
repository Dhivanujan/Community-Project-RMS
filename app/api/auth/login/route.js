import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password, role } = await req.json();

    // Find user
    const user = await User.findOne({ email, role });
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials or role' }, { status: 401 });
    }

    if (!user.isVerified) {
      return NextResponse.json({ message: 'Please verify your email before logging in. Sign up again to receive a new OTP.' }, { status: 403 });
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

    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      jwtSecret,
      { expiresIn: '1d' }
    );

    // Create response with cookie
    const response = NextResponse.json({ message: 'Logged in successfully', role: user.role }, { status: 200 });
    
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