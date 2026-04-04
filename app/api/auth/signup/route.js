import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password, role, indexNumber } = await req.json();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      ...(role === 'Student' && { indexNumber }),
    });

    return NextResponse.json({ message: 'User created successfully', userId: newUser._id }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'An error occurred during signup' }, { status: 500 });
  }
}