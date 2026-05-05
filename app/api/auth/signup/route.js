import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { validateEmail, validatePassword, validateRequiredFields } from '@/lib/validation';
import nodemailer from 'nodemailer';

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
        { message: passwordValidation.errors.join(', ') },
        { status: 400 }
      );
    }

    // Validate role
    if (!['Student', 'Admin'].includes(role)) {
      return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      if (!user.isVerified) {
         // Resend OTP if user exists but unverified
      } else {
         return NextResponse.json({ message: 'User already exists' }, { status: 409 });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    if (!user) {
      // Create user
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        isVerified: false,
        otp,
        otpExpires,
        ...(role === 'Student' && { indexNumber: indexNumber || '' }),
      });
    } else {
      user.password = hashedPassword;
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    }

    // Send OTP email
    const emailUser = process.env.EMAIL_USER || '';
    const useGmailTransport = Boolean(process.env.EMAIL_SERVICE) || emailUser.toLowerCase().includes('@gmail.com');

    const transporter = nodemailer.createTransport(
      useGmailTransport
        ? {
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
              user: emailUser,
              pass: process.env.EMAIL_PASS,
            },
          }
        : {
            host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
            port: Number(process.env.EMAIL_PORT || 587),
            secure: Number(process.env.EMAIL_PORT || 587) === 465,
            auth: {
              user: emailUser || 'ethereal_user',
              pass: process.env.EMAIL_PASS || 'ethereal_pass',
            },
          }
    );

    const message = `
      Hello ${name},
      
      Thank you for registering. Your verification code (OTP) is:
      
      ${otp}
      
      This code is valid for 10 minutes.
    `;

    const fromAddress = process.env.FROM_EMAIL || emailUser || 'noreply@example.com';
    
    await transporter.sendMail({
      from: `${process.env.FROM_NAME || 'Faculty system'} <${fromAddress}>`,
      to: email,
      subject: 'Account Verification OTP',
      text: message,
    });

    return NextResponse.json(
      { message: 'Account created. Please check your email for the OTP.', userId: user._id, otpSent: true },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'An error occurred during signup' }, { status: 500 });
  }
}