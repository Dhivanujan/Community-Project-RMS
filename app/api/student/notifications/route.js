import { NextResponse } from 'next/server';
import { requireStudent } from '@/lib/auth';
import {
  hasStudentIdentifier,
  normalizeStudentIdentifier,
  resolveStudent,
  roundTo,
} from '@/lib/student/shared';
import {
  rawFind,
  rawFindOne,
  rawUpdate,
  rawUpsert,
  toOidFilter,
  parseOid,
  toDateRaw,
} from '@/lib/rawMongo';

function isValidOid(id) {
  return /^[a-f\d]{24}$/i.test(id);
}

async function seedResultNotifications(studentId) {
  const sid = String(studentId);
  const latestResults = await rawFind(
    'Result',
    { student: toOidFilter(sid) },
    { sort: { updatedAt: -1 }, limit: 20 }
  );

  for (const result of latestResults) {
    const publishedSubjects = (result.subjects || []).filter((subject) => Boolean(subject?.grade)).length;
    const resultId = parseOid(result._id);

    await rawUpsert(
      'StudentNotification',
      { student: toOidFilter(sid), sourceResultId: toOidFilter(resultId) },
      {
        $setOnInsert: {
          student: toOidFilter(sid),
          sourceResultId: toOidFilter(resultId),
          type: 'results',
          category: 'Results',
          title: `${result.semester} results updated`,
          description: `Published ${publishedSubjects} subject(s) with semester GPA ${roundTo(Number(result.gpa) || 0, 2)}.`,
          read: false,
          createdAt: toDateRaw(new Date()),
          updatedAt: toDateRaw(new Date()),
        },
      }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Try API auth, bypass error if not found
    let identifiers = {};
    try {
      identifiers = normalizeStudentIdentifier(searchParams);

      if (!hasStudentIdentifier(identifiers)) {
        const { authorized, user } = await requireStudent(request);
        if (authorized && user?.email) {
          identifiers.email = user.email;
        }
      }
    } catch (e) {}

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

    const category = searchParams.get('category')?.trim() || 'All';
    const filter = { student: toOidFilter(student._id) };
    if (category !== 'All') {
      filter.category = category;
    }

    const notifications = await rawFind('StudentNotification', filter, { sort: { createdAt: -1 } });
    const unreadCount = notifications.filter((item) => !item.read).length;

    return NextResponse.json(
      {
        success: true,
        data: {
          notifications: notifications.map((item) => ({
            id: parseOid(item._id),
            type: item.type,
            category: item.category,
            title: item.title,
            description: item.description,
            read: item.read,
            createdAt: item.createdAt?.$date?.$numberLong ? new Date(parseInt(item.createdAt.$date.$numberLong)).toISOString() : item.createdAt,
            updatedAt: item.updatedAt?.$date?.$numberLong ? new Date(parseInt(item.updatedAt.$date.$numberLong)).toISOString() : item.updatedAt,
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
    const body = await request.json();
    const { notificationId, read, markAllRead } = body || {};
    let { studentId, rollNumber, email } = body || {};

    if (!studentId && !rollNumber && !email) {
      try {
        const { authorized, user } = await requireStudent(request);
        if (authorized && user?.email) {
          email = user.email;
        }
      } catch (e) {}
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
      await rawUpdate(
        'StudentNotification',
        { student: toOidFilter(student._id), read: false },
        { $set: { read: true, updatedAt: toDateRaw(new Date()) } }
      );
      return NextResponse.json({ success: true, message: 'All notifications marked as read.' }, { status: 200 });
    }

    if (!notificationId || !isValidOid(notificationId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Valid notificationId is required.',
        },
        { status: 400 }
      );
    }

    await rawUpdate(
      'StudentNotification',
      { _id: toOidFilter(notificationId), student: toOidFilter(student._id) },
      { $set: { read: Boolean(read), updatedAt: toDateRaw(new Date()) } }
    );

    const updated = await rawFindOne('StudentNotification', { _id: toOidFilter(notificationId) });

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
          id: parseOid(updated._id),
          read: updated.read,
          updatedAt: updated.updatedAt?.$date?.$numberLong ? new Date(parseInt(updated.updatedAt.$date.$numberLong)).toISOString() : updated.updatedAt,
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
