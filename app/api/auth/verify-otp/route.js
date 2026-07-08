import { NextResponse } from 'next/server';
import { rawFindOne, rawUpdate, parseDateRaw } from '@/lib/rawMongo';

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and OTP are required' }, { status: 400 });
    }

    const user = await rawFindOne('User', { email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ message: 'User is already verified' }, { status: 400 });
    }

    const otpExpires = user.otpExpires?.$date?.$numberLong ? parseInt(user.otpExpires.$date.$numberLong) : new Date(user.otpExpires).getTime();

    if (user.otp !== otp || otpExpires < Date.now()) {
      return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
    }

    await rawUpdate(
      'User',
      { email },
      {
        $set: { isVerified: true },
        $unset: { otp: "", otpExpires: "" },
      }
    );

    return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json({ message: 'Error verifying OTP' }, { status: 500 });
  }
}
