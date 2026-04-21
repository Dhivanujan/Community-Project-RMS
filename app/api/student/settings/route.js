import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';
import StudentPreference from '@/models/StudentPreference';
import User from '@/models/User';
import {
  hasStudentIdentifier,
  normalizeStudentIdentifier,
  resolveStudent,
  resolveUserForStudent,
} from '@/lib/student/shared';

const DEFAULT_PREFERENCES = {
  emailNotifications: true,
  pushNotifications: true,
  resultAlerts: true,
  academicUpdates: true,
  generalNews: false,
  theme: 'light',
};

function buildAcademicYearLabel(enrollmentYear) {
  if (!enrollmentYear) {
    return null;
  }

  const parsed = Number(enrollmentYear);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  const currentYear = new Date().getFullYear();
  const yearCount = Math.max(currentYear - parsed + 1, 1);
  return `${yearCount}${yearCount === 1 ? 'st' : yearCount === 2 ? 'nd' : yearCount === 3 ? 'rd' : 'th'} Year`;
}

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const identifiers = normalizeStudentIdentifier(searchParams);

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

    const [user, preferences] = await Promise.all([
      resolveUserForStudent(student),
      StudentPreference.findOne({ student: student._id }).lean(),
    ]);

    const preferenceData = {
      ...DEFAULT_PREFERENCES,
      ...(preferences || {}),
    };

    const data = {
      profile: {
        studentId: String(student._id),
        fullName: student.name,
        rollNumber: student.rollNumber,
        email: student.email,
        department: student.department || null,
        batch: student.enrollmentYear ? `${student.enrollmentYear}/${Number(student.enrollmentYear) + 1}` : null,
        academicYear: buildAcademicYearLabel(student.enrollmentYear),
        role: user?.role || 'Student',
      },
      preferences: {
        emailNotifications: preferenceData.emailNotifications,
        pushNotifications: preferenceData.pushNotifications,
        resultAlerts: preferenceData.resultAlerts,
        academicUpdates: preferenceData.academicUpdates,
        generalNews: preferenceData.generalNews,
        theme: preferenceData.theme,
      },
    };

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Student settings API GET error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to load student settings.',
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { studentId, rollNumber, email, fullName, preferences } = body || {};

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

    if (typeof fullName === 'string' && fullName.trim()) {
      await User.updateOne({ email: student.email, role: 'Student' }, { $set: { name: fullName.trim() } });
      await Student.updateOne({ _id: student._id }, { $set: { name: fullName.trim() } });
    }

    const allowedPreferenceFields = [
      'emailNotifications',
      'pushNotifications',
      'resultAlerts',
      'academicUpdates',
      'generalNews',
      'theme',
    ];

    const updatePreferenceSet = {};
    for (const field of allowedPreferenceFields) {
      if (preferences && Object.prototype.hasOwnProperty.call(preferences, field)) {
        updatePreferenceSet[field] = preferences[field];
      }
    }

    if (Object.keys(updatePreferenceSet).length > 0) {
      await StudentPreference.updateOne(
        { student: student._id },
        {
          $set: updatePreferenceSet,
          $setOnInsert: { student: student._id },
        },
        { upsert: true }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Settings updated successfully.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Student settings API PATCH error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to update settings.',
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { studentId, rollNumber, email, currentPassword, newPassword } = body || {};

    if (!studentId && !rollNumber && !email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Provide one identifier: studentId, rollNumber, or email.',
        },
        { status: 400 }
      );
    }

    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: 'currentPassword and a newPassword of at least 6 characters are required.',
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

    const user = await User.findOne({ email: student.email, role: 'Student' });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User account not found for student.',
        },
        { status: 404 }
      );
    }

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Current password is incorrect.',
        },
        { status: 401 }
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Password updated successfully.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Student settings API POST error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to update password.',
      },
      { status: 500 }
    );
  }
}
