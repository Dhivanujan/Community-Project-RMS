import { NextResponse } from 'next/server';
import { getStudentDashboardData } from '@/lib/student/dashboard';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const studentId = searchParams.get('studentId')?.trim() || '';
    const rollNumber = searchParams.get('rollNumber')?.trim() || '';
    const email = searchParams.get('email')?.trim() || '';

    if (!studentId && !rollNumber && !email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Provide one identifier: studentId, rollNumber, or email.',
        },
        { status: 400 }
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
