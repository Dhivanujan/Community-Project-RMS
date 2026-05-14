import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { requireSuperAdmin } from '@/lib/auth';

export async function GET(req) {
  try {
    await dbConnect();
    
    const authResult = await requireSuperAdmin(req);
    if (!authResult.authorized) return authResult.response;

    const users = await User.find({}, '-password').sort({ createdAt: -1 });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
