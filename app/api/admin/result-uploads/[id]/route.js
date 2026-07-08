import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  toOidFilter, toDateRaw, parseOid,
  rawFindOne, rawUpdate, rawDelete, serializeUploadFull,
} from '@/lib/rawMongo';
import { recalculateStudentGPA } from '@/lib/gpa';

function isValidOid(id) {
  return /^[a-f\d]{24}$/i.test(id);
}

const VALID_GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'E', 'F'];

// ── GET: Fetch a single result upload with populated student data ──
export async function GET(request, { params }) {
  try {
    const { id } = params;
    if (!isValidOid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid upload ID format.' }, { status: 400 });
    }

    const upload = await rawFindOne('ResultUpload', { _id: toOidFilter(id) });
    if (!upload) {
      return NextResponse.json({ success: false, message: 'Result upload not found.' }, { status: 404 });
    }

    // Populate student data via Prisma
    const studentIds = (upload.entries || []).map(e => parseOid(e.student));

    const studentProfiles = await prisma.studentProfile.findMany({
      where: { id: { in: studentIds } },
      include: { user: { select: { email: true } } },
    });

    const studentMap = {};
    studentProfiles.forEach(sp => {
      studentMap[sp.id] = {
        _id: sp.id,
        name: `${sp.firstName} ${sp.lastName}`,
        rollNumber: sp.rollNumber || sp.indexNumber,
        email: sp.user?.email || '',
        department: sp.department || upload.department,
        enrollmentYear: sp.enrollmentYear || upload.academicYear,
      };
    });

    const serialized = {
      ...serializeUploadFull(upload),
      entries: (upload.entries || []).map(e => ({
        student: studentMap[parseOid(e.student)] || null,
        grade: e.grade,
      })),
    };

    return NextResponse.json({ success: true, data: serialized }, { status: 200 });
  } catch (error) {
    console.error('Result upload GET [id] error:', error);
    return NextResponse.json({ success: false, message: 'Unable to fetch result upload.' }, { status: 500 });
  }
}

// ── PUT: Update grades for a result upload ──
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    if (!isValidOid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid upload ID format.' }, { status: 400 });
    }

    const upload = await rawFindOne('ResultUpload', { _id: toOidFilter(id) });
    if (!upload) {
      return NextResponse.json({ success: false, message: 'Result upload not found.' }, { status: 404 });
    }

    const body = await request.json();
    const { entries } = body;

    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({ success: false, message: 'Entries array is required.' }, { status: 400 });
    }

    for (let i = 0; i < entries.length; i++) {
      if (!entries[i].student || !entries[i].grade || !VALID_GRADES.includes(entries[i].grade)) {
        return NextResponse.json(
          { success: false, message: `Entry #${i + 1} has an invalid or missing grade.` },
          { status: 400 }
        );
      }
    }

    const now = new Date();
    const newEntries = entries.map(e => ({ student: toOidFilter(e.student), grade: e.grade }));

    // Build audit log entry
    const auditEntry = {
      action: upload.status === 'published' ? 'edited_after_publish' : 'updated',
      performedBy: 'Admin',
      performedAt: toDateRaw(now),
      details: `Draft updated with ${entries.length} entry/entries.`,
    };

    await rawUpdate(
      'ResultUpload',
      { _id: toOidFilter(id) },
      {
        $set:  { entries: newEntries, updatedAt: toDateRaw(now) },
        $push: { auditLog: auditEntry },
      }
    );

    // Trigger GPA recalc if already published
    if (upload.status === 'published') {
      for (const entry of entries) {
        try { await recalculateStudentGPA(entry.student); } catch (_) {}
      }
    }

    return NextResponse.json({ success: true, message: 'Result upload updated successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Result upload PUT [id] error:', error);
    return NextResponse.json({ success: false, message: 'Unable to update result upload.' }, { status: 500 });
  }
}

// ── DELETE: Delete a draft result upload ──
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!isValidOid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid upload ID format.' }, { status: 400 });
    }

    const upload = await rawFindOne('ResultUpload', { _id: toOidFilter(id) });
    if (!upload) {
      return NextResponse.json({ success: false, message: 'Result upload not found.' }, { status: 404 });
    }
    if (upload.status === 'published') {
      return NextResponse.json({ success: false, message: 'Cannot delete a published result upload.' }, { status: 403 });
    }

    await rawDelete('ResultUpload', { _id: toOidFilter(id) });

    return NextResponse.json({ success: true, message: 'Draft deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Result upload DELETE [id] error:', error);
    return NextResponse.json({ success: false, message: 'Unable to delete result upload.' }, { status: 500 });
  }
}
