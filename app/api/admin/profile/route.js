import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    const { authorized, user, response } = await requireAdmin(request);
    
    if (!authorized) return response;

    // Fetch the admin's profile via Prisma, excluding password
    const adminProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isFirstLogin: true,
        active: true,
        department: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!adminProfile) {
      return NextResponse.json(
        { success: false, message: 'Admin not found' },
        { status: 404 }
      );
    }

    // Adapt to match mongoose style _id property if frontend relies on it
    const formattedAdmin = {
      ...adminProfile,
      _id: adminProfile.id,
    };

    return NextResponse.json({ success: true, data: formattedAdmin }, { status: 200 });
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
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        id: { not: user.id },
      }
    });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email is already in use by another account' },
        { status: 400 }
      );
    }

    // Update the admin user
    const updatedAdmin = await prisma.user.update({
      where: { id: user.id },
      data: { email }, // Note: User schema does not have a general 'name' field, it is linked via profiles, but let's check username/email
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isFirstLogin: true,
        active: true,
        department: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!updatedAdmin) {
      return NextResponse.json(
        { success: false, message: 'Admin not found' },
        { status: 404 }
      );
    }

    const formattedAdmin = {
      ...updatedAdmin,
      _id: updatedAdmin.id,
      name: name, // Preserve name in return data if needed by frontend
    };

    return NextResponse.json(
      { success: true, message: 'Profile updated successfully', data: formattedAdmin },
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
