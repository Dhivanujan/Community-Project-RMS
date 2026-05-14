import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AuditLog from '@/models/AuditLog';
import { requireSuperAdmin } from '@/lib/auth';

export async function GET(req) {
  try {
    await dbConnect();
    
    const authResult = await requireSuperAdmin(req);
    if (!authResult.authorized) return authResult.response;

    const logs = await AuditLog.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({ logs }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
