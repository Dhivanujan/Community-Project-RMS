import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ResultUpload from '@/models/ResultUpload';
import Student from '@/models/Student';

// ── GET: List all result uploads with optional filters ──
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department')?.trim() || '';
    const semester = searchParams.get('semester')?.trim() || '';
    const status = searchParams.get('status')?.trim() || '';
    const academicYear = searchParams.get('academicYear')?.trim() || '';
    const batch = searchParams.get('batch')?.trim() || '';

    const query = {};
    if (department) query.department = department;
    if (semester) query.semester = semester;
    if (status) query.status = status;
    if (academicYear) query.academicYear = academicYear;
    if (batch) query.batch = batch;

    const uploads = await ResultUpload.find(query)
      .sort({ updatedAt: -1 })
      .select('-entries -auditLog')
      .lean();

    const serialized = uploads.map((u) => ({
      ...u,
      _id: u._id.toString(),
      createdAt: u.createdAt?.toISOString(),
      updatedAt: u.updatedAt?.toISOString(),
      publishedAt: u.publishedAt?.toISOString() || null,
    }));

    return NextResponse.json({ success: true, data: serialized }, { status: 200 });
  } catch (error) {
    console.error('Result uploads GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Unable to fetch result uploads.' },
      { status: 500 }
    );
  }
}
