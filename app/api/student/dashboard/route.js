import { NextResponse } from 'next/server';
import { requireStudent } from '@/lib/auth';
import { getStudentDashboardData } from '@/lib/student/dashboard';

export async function GET(request) {
  try {
    // Require authentication
    const { authorized, response: authResponse, user } = await requireStudent(request);
    if (!authorized) return authResponse;

    const { searchParams } = new URL(request.url);

    const studentId = searchParams.get('studentId')?.trim() || '';
    const rollNumber = searchParams.get('rollNumber')?.trim() || '';
    let email = searchParams.get('email')?.trim() || '';

    if (!studentId && !rollNumber && !email) {
      if (user.role === 'Student') {
        email = user.email;
      } else {
        return NextResponse.json(
          {
            success: false,
            message: 'Provide one identifier: studentId, rollNumber, or email.',
          },
          { status: 400 }
        );
      }
    }

    // Prevent students from viewing other students' data
    // (allow admin to view any student, but students can only view their own)
    if (user.role === 'Student' && user.email !== email && email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: Cannot view other students\' data.',
        },
        { status: 403 }
      );
    }

    const data = await getStudentDashboardData({ studentId, rollNumber, email });

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: 'Student not found.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Student dashboard API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to load student dashboard data.',
      },
      { status: 500 }
    );
  }
}
