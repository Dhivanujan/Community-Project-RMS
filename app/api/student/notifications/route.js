import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import Result from '@/models/Result';
import StudentNotification from '@/models/StudentNotification';
import { requireStudent } from '@/lib/auth';
import {
  hasStudentIdentifier,
  normalizeStudentIdentifier,
  resolveStudent,
  roundTo,
} from '@/lib/student/shared';

async function seedResultNotifications(studentId) {
  const latestResults = await Result.find({ student: studentId })
    .sort({ updatedAt: -1 })
    .limit(20)
    .lean();

  for (const result of latestResults) {
    const publishedSubjects = (result.subjects || []).filter((subject) => Boolean(subject?.grade)).length;

    await StudentNotification.findOneAndUpdate(
      { student: studentId, sourceResultId: result._id },
      {
        $setOnInsert: {
          student: studentId,
          sourceResultId: result._id,
          type: 'results',
          category: 'Results',
          title: `${result.semester} results updated`,
          description: `Published ${publishedSubjects} subject(s) with semester GPA ${roundTo(Number(result.gpa) || 0, 2)}.`,
          read: false,
        },
      },
      { upsert: true, new: false }
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();

    // Try API auth, bypass error if not found? No, let's just try auth to get the user email if there are no search params.
    let identifiers;
    try {
      const { searchParams } = new URL(request.url);
      identifiers = normalizeStudentIdentifier(searchParams);

      if (!hasStudentIdentifier(identifiers)) {
        const { authorized, user } = await requireStudent(request);
        if (authorized && user?.email) {
          identifiers.email = user.email;
        }
      }
    } catch(e) {}

    if (!hasStudentIdentifier(identifiers)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Provide one identifier: studentId, rollNumber, or email.',
        },
        { status: 400 }
      );
    }

    const student = await resolveStudent(identifiers);
    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: 'Student not found.',
        },
        { status: 404 }
      );
    }

    // NOTE: seedResultNotifications is now called via POST endpoint, not GET
    // This ensures GET operations remain idempotent and don't have side effects

    const category = searchParams.get('category')?.trim() || 'All';
    const query = { student: student._id };
    if (category !== 'All') {
      query.category = category;
    }

    const notifications = await StudentNotification.find(query).sort({ createdAt: -1 }).lean();
    const unreadCount = notifications.filter((item) => !item.read).length;

    return NextResponse.json(
      {
        success: true,
        data: {
          notifications: notifications.map((item) => ({
            id: String(item._id),
            type: item.type,
            category: item.category,
            title: item.title,
            description: item.description,
            read: item.read,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          })),
          unreadCount,
          filters: ['All', 'Results', 'Academic', 'General'],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Student notifications API GET error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to load notifications.',
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { notificationId, read, markAllRead } = body || {};
    let { studentId, rollNumber, email } = body || {};

    if (!studentId && !rollNumber && !email) {
      try {
        const { authorized, user } = await requireStudent(request);
        if (authorized && user?.email) {
          email = user.email;
        }
      } catch(e) {}
    }

    if (!studentId && !rollNumber && !email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Provide one identifier: studentId, rollNumber, or email.',
        },
        { status: 400 }
      );
    }

    const student = await resolveStudent({ studentId, rollNumber, email });
    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: 'Student not found.',
        },
        { status: 404 }
      );
    }

    if (markAllRead) {
      await StudentNotification.updateMany({ student: student._id, read: false }, { $set: { read: true } });
      return NextResponse.json({ success: true, message: 'All notifications marked as read.' }, { status: 200 });
    }

    if (!notificationId || !mongoose.Types.ObjectId.isValid(notificationId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Valid notificationId is required.',
        },
        { status: 400 }
      );
    }

    const updated = await StudentNotification.findOneAndUpdate(
      { _id: notificationId, student: student._id },
      { $set: { read: Boolean(read) } },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          message: 'Notification not found.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: String(updated._id),
          read: updated.read,
          updatedAt: updated.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Student notifications API PATCH error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to update notification state.',
      },
      { status: 500 }
    );
  }
}

// POST: Seed/generate notifications from latest results
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { studentId, rollNumber, email } = body || {};

    if (!studentId && !rollNumber && !email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Provide one identifier: studentId, rollNumber, or email.',
        },
        { status: 400 }
      );
    }

    const student = await resolveStudent({ studentId, rollNumber, email });
    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: 'Student not found.',
        },
        { status: 404 }
      );
    }

    // Seed/refresh notifications from recent results
    await seedResultNotifications(student._id);

    return NextResponse.json(
      {
        success: true,
        message: 'Notifications synced with latest results.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Student notifications API POST error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to seed notifications.',
      },
      { status: 500 }
    );
  }
}
