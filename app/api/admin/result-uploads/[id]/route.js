import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import ResultUpload from '@/models/ResultUpload';

// ── GET: Fetch a single result upload with populated student data ──
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid upload ID format.' },
        { status: 400 }
      );
    }

    const upload = await ResultUpload.findById(id)
      .populate('entries.student', 'name rollNumber email department enrollmentYear')
      .lean();

    if (!upload) {
      return NextResponse.json(
        { success: false, message: 'Result upload not found.' },
        { status: 404 }
      );
    }

    const serialized = {
      ...upload,
      _id: upload._id.toString(),
      createdAt: upload.createdAt?.toISOString(),
      updatedAt: upload.updatedAt?.toISOString(),
      publishedAt: upload.publishedAt?.toISOString() || null,
      entries: upload.entries.map((e) => ({
        student: e.student
          ? {
              _id: e.student._id.toString(),
              name: e.student.name,
              rollNumber: e.student.rollNumber,
              email: e.student.email,
              department: e.student.department,
              enrollmentYear: e.student.enrollmentYear,
            }
          : null,
        grade: e.grade,
      })),
    };

    return NextResponse.json({ success: true, data: serialized }, { status: 200 });
  } catch (error) {
    console.error('Result upload GET [id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Unable to fetch result upload.' },
      { status: 500 }
    );
  }
}

// ── PUT: Update grades for a result upload ──
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid upload ID format.' },
        { status: 400 }
      );
    }

    const upload = await ResultUpload.findById(id);
    if (!upload) {
      return NextResponse.json(
        { success: false, message: 'Result upload not found.' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { entries } = body;

    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Entries array is required.' },
        { status: 400 }
      );
    }

    // Validate grades
    const VALID_GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'E', 'F'];
    for (let i = 0; i < entries.length; i++) {
      if (!entries[i].student || !entries[i].grade || !VALID_GRADES.includes(entries[i].grade)) {
        return NextResponse.json(
          { success: false, message: `Entry #${i + 1} has an invalid or missing grade.` },
          { status: 400 }
        );
      }
    }

    // Track changes for audit log if published
    if (upload.status === 'published') {
      const oldEntriesMap = {};
      upload.entries.forEach((e) => {
        oldEntriesMap[e.student.toString()] = e.grade;
      });

      const changes = [];
      entries.forEach((e) => {
        const oldGrade = oldEntriesMap[e.student];
        if (oldGrade && oldGrade !== e.grade) {
          changes.push(`${e.student}: ${oldGrade} → ${e.grade}`);
        }
      });

      if (changes.length > 0) {
        upload.auditLog.push({
          action: 'edited_after_publish',
          performedBy: 'Admin',
          performedAt: new Date(),
          details: `${changes.length} grade(s) changed: ${changes.join('; ')}`,
        });
      }
    } else {
      upload.auditLog.push({
        action: 'updated',
        performedBy: 'Admin',
        performedAt: new Date(),
        details: `Draft updated with ${entries.length} entry/entries.`,
      });
    }

    upload.entries = entries;
    await upload.save();

    return NextResponse.json(
      { success: true, message: 'Result upload updated successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Result upload PUT [id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Unable to update result upload.' },
      { status: 500 }
    );
  }
}

// ── DELETE: Delete a draft result upload ──
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid upload ID format.' },
        { status: 400 }
      );
    }

    const upload = await ResultUpload.findById(id);
    if (!upload) {
      return NextResponse.json(
        { success: false, message: 'Result upload not found.' },
        { status: 404 }
      );
    }

    if (upload.status === 'published') {
      return NextResponse.json(
        { success: false, message: 'Cannot delete a published result upload.' },
        { status: 403 }
      );
    }

    await ResultUpload.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: 'Draft deleted successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Result upload DELETE [id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Unable to delete result upload.' },
      { status: 500 }
    );
  }
}
