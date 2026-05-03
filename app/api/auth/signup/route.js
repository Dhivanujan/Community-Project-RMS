import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { validateEmail, validatePassword, validateRequiredFields } from '@/lib/validation';

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password, role, indexNumber } = await req.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'password', 'role'];
    const fieldsValidation = validateRequiredFields({ name, email, password, role }, requiredFields);
    if (!fieldsValidation.valid) {
      return NextResponse.json(
        { message: `Missing required fields: ${fieldsValidation.missing.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { message: 'Password does not meet requirements', errors: passwordValidation.errors },
        { status: 400 }
      );
    }

    // Validate role
    if (!['Student', 'Admin'].includes(role)) {
      return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      ...(role === 'Student' && { indexNumber: indexNumber || '' }),
    });

    return NextResponse.json(
      { message: 'User created successfully', userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'An error occurred during signup' }, { status: 500 });
  }
}