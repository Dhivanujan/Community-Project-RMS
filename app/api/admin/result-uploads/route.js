import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  newOid, toOidFilter, toDateRaw,
  rawFind, rawInsert, serializeUploadList,
} from '@/lib/rawMongo';

const VALID_GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'E', 'F'];

// ── GET: List all result uploads ──
export async function GET(request) {
  try {
    const { authorized, response: authResponse } = await requireAdmin(request);
    if (!authorized) return authResponse;

    const { searchParams } = new URL(request.url);
    const department  = searchParams.get('department')?.trim()  || '';
    const semester    = searchParams.get('semester')?.trim()    || '';
    const status      = searchParams.get('status')?.trim()      || '';
    const academicYear= searchParams.get('academicYear')?.trim()|| '';

    const filter = {};
    if (department)   filter.department   = department;
    if (semester)     filter.semester     = semester;
    if (status)       filter.status       = status;
    if (academicYear) filter.academicYear = academicYear;

    const docs = await rawFind('ResultUpload', filter, {
      sort: { updatedAt: -1 },
      projection: { entries: 0, auditLog: 0 },
    });

    const serialized = docs.map(serializeUploadList);
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
    const { authorized, response: authResponse } = await requireAdmin(request);
    if (!authorized) return authResponse;

    const body = await request.json();
    const {
      academicYear, department, semester,
      subjectCode, subjectName, credits,
      entries, batch = 'N/A',
    } = body;

    // Validate required fields
    if (!academicYear || !department || !semester || !subjectCode || !subjectName || !credits) {
      return NextResponse.json(
        { success: false, message: 'All filter fields are required.' },
        { status: 400 }
      );
    }
    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json(
        { success: false, message: 'At least one student grade entry is required.' },
        { status: 400 }
      );
    }

    // Validate grades
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      if (!e.student) {
        return NextResponse.json(
          { success: false, message: `Entry #${i + 1} is missing a student ID.` },
          { status: 400 }
        );
      }
      if (!e.grade || !VALID_GRADES.includes(e.grade)) {
        return NextResponse.json(
          { success: false, message: `Entry #${i + 1} has an invalid grade "${e.grade}".` },
          { status: 400 }
        );
      }
    }

    // Verify students exist via Prisma
    const studentIds = entries.map(e => e.student);
    const existingStudents = await prisma.studentProfile.findMany({
      where: { id: { in: studentIds } },
      select: { id: true },
    });
    const existingIds = new Set(existingStudents.map(s => s.id));
    const missingIds = studentIds.filter(id => !existingIds.has(id));
    if (missingIds.length > 0) {
      return NextResponse.json(
        { success: false, message: `Students not found: ${missingIds.join(', ')}` },
        { status: 400 }
      );
    }

    // Insert via Prisma raw command (avoids Mongoose/dbConnect)
    const now  = new Date();
    const newId = newOid();

    await rawInsert('ResultUpload', {
      _id:         toOidFilter(newId),
      academicYear,
      department,
      semester,
      subjectCode,
      subjectName,
      credits:     Number(credits),
      batch,
      status:      'draft',
      entries:     entries.map(e => ({ student: toOidFilter(e.student), grade: e.grade })),
      auditLog:    [{
        action:      'created',
        performedBy: 'Admin',
        performedAt: toDateRaw(now),
        details:     `Draft created with ${entries.length} student(s).`,
      }],
      publishedAt: null,
      publishedBy: null,
      createdAt:   toDateRaw(now),
      updatedAt:   toDateRaw(now),
    });

    return NextResponse.json(
      { success: true, data: { _id: newId }, message: 'Draft saved successfully.' },
      { status: 201 }
    );
  } catch (error) {
    // Duplicate key (same subject already uploaded)
    if (error.message?.includes('E11000') || error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'A result upload for this subject already exists for this year, department and semester.' },
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
