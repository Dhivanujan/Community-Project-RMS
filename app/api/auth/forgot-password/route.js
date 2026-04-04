import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { email } = await req.json();

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      // You might want to return 200 anyway to prevent email enumeration
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 Minutes

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetPasswordExpire;
    await user.save();

    // Create reset url
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    // Normally you would use an email service via environment variables
    // e.g. SendGrid, Mailgun, Amazon SES, or Gmail App Passwords
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
      port: process.env.EMAIL_PORT || 587,
      auth: {
        user: process.env.EMAIL_USER || 'ethereal_user',
        pass: process.env.EMAIL_PASS || 'ethereal_pass',
      },
    });

    const message = `
      You are receiving this email because you (or someone else) has requested a password reset.
      Please make a PUT request or open this link to reset your password: 
      \n\n ${resetUrl}
    `;

    try {
      await transporter.sendMail({
        from: `${process.env.FROM_NAME || 'Faculty system'} <${process.env.FROM_EMAIL || 'noreply@faculty.edu'}>`,
        to: user.email,
        subject: 'Password reset token',
        text: message,
      });

      return NextResponse.json({ message: 'Email sent' }, { status: 200 });
    } catch (err) {
      console.error(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return NextResponse.json({ message: 'Email could not be sent' }, { status: 500 });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'Error processing forgot password' }, { status: 500 });
  }
}