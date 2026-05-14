import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import AuditLog from '@/models/AuditLog';
import { requireSuperAdmin } from '@/lib/auth';

export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    
    const authResult = await requireSuperAdmin(req);
    if (!authResult.authorized) return authResult.response;

    const { id } = params;
    const body = await req.json();
    
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (body.isActive !== undefined) {
      user.isActive = body.isActive;
      
      // Log the action
      await AuditLog.create({
        userId: authResult.user.userId,
        action: body.isActive ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
        entity: 'User',
        entityId: user._id,
        details: { targetEmail: user.email }
      });
    }

    if (body.role) {
      user.role = body.role;
    }

    await user.save();

    return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
