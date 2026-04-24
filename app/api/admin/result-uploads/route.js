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

// ── POST: Create a new result upload (draft) ──
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      academicYear,
      department,
      batch,
      semester,
      subjectCode,
      subjectName,
      credits,
      entries,
    } = body;

    // ── Validate required fields ──
    if (!academicYear || !department || !batch || !semester || !subjectCode || !subjectName || !credits) {
      return NextResponse.json(
        { success: false, message: 'All filter fields (academicYear, department, batch, semester, subjectCode, subjectName, credits) are required.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json(
        { success: false, message: 'At least one student grade entry is required.' },
        { status: 400 }
      );
    }

    // ── Validate each entry has student + grade ──
    const VALID_GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'E', 'F'];
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (!entry.student) {
        return NextResponse.json(
          { success: false, message: `Entry #${i + 1} is missing a student ID.` },
          { status: 400 }
        );
      }
      if (!entry.grade || !VALID_GRADES.includes(entry.grade)) {
        return NextResponse.json(
          { success: false, message: `Entry #${i + 1} has an invalid grade "${entry.grade}". Allowed: ${VALID_GRADES.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // ── Verify students exist ──
    const studentIds = entries.map((e) => e.student);
    const existingStudents = await Student.find({ _id: { $in: studentIds } }).select('_id').lean();
    const existingIds = new Set(existingStudents.map((s) => s._id.toString()));
    const missingIds = studentIds.filter((id) => !existingIds.has(id));

    if (missingIds.length > 0) {
      return NextResponse.json(
        { success: false, message: `Students not found: ${missingIds.join(', ')}` },
        { status: 400 }
      );
    }

    // ── Create the upload (draft) ──
    const upload = await ResultUpload.create({
      academicYear,
      department,
      batch,
      semester,
      subjectCode,
      subjectName,
      credits: Number(credits),
      status: 'draft',
      entries,
      auditLog: [
        {
          action: 'created',
          performedBy: 'Admin',
          performedAt: new Date(),
          details: `Draft created with ${entries.length} student(s).`,
        },
      ],
    });

    return NextResponse.json(
      { success: true, data: { _id: upload._id.toString() }, message: 'Draft saved successfully.' },
      { status: 201 }
    );
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: 'A result upload for this subject already exists for the selected academic year, department, batch, and semester.',
        },
        { status: 409 }
      );
    }

    console.error('Result uploads POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Unable to create result upload.' },
      { status: 500 }
    );
  }
}
