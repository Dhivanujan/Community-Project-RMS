import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { requireAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    const { authorized, user, response } = await requireAdmin(request);
    
    if (!authorized) return response;

    await dbConnect();

    // Fetch the admin's profile, excluding the password
    const adminProfile = await User.findById(user.userId).select('-password');

    if (!adminProfile) {
      return NextResponse.json(
        { success: false, message: 'Admin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: adminProfile }, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return NextResponse.json(
      { success: false, message: 'Server error fetching profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { authorized, user, response } = await requireAdmin(request);
    
    if (!authorized) return response;

    await dbConnect();
    const body = await request.json();
    const { name, email } = body;

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if another user already uses this email
    const existingUser = await User.findOne({ email, _id: { $ne: user.userId } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email is already in use by another account' },
        { status: 400 }
      );
    }

    // Update the admin user
    const updatedAdmin = await User.findByIdAndUpdate(
      user.userId,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedAdmin) {
      return NextResponse.json(
        { success: false, message: 'Admin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Profile updated successfully', data: updatedAdmin },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating admin profile:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error updating profile' },
      { status: 500 }
    );
  }
}
