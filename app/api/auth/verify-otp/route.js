import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req) {
  try {
    await dbConnect();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and OTP are required' }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ message: 'User is already verified' }, { status: 400 });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json({ message: 'Error verifying OTP' }, { status: 500 });
  }
}
