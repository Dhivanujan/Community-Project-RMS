import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Result from '@/models/Result';
import {
  hasStudentIdentifier,
  normalizeStudentIdentifier,
  resolveAcademicStanding,
  resolveStudent,
  roundTo,
  semesterSortKey,
} from '@/lib/student/shared';

const GPA_SCALE = [
  { grade: 'A+', range: '4.00', desc: 'Exceptional' },
  { grade: 'A', range: '4.00', desc: 'Excellent' },
  { grade: 'A-', range: '3.70', desc: 'Very Good' },
  { grade: 'B+', range: '3.30', desc: 'Good' },
  { grade: 'B', range: '3.00', desc: 'Above Average' },
  { grade: 'B-', range: '2.70', desc: 'Average' },
  { grade: 'C+', range: '2.30', desc: 'Below Average' },
  { grade: 'C', range: '2.00', desc: 'Satisfactory' },
];

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

    const results = await Result.find({ student: student._id }).sort({ createdAt: -1 }).lean();

    const sortedResults = [...results].sort(
      (a, b) => semesterSortKey(b.semester) - semesterSortKey(a.semester)
    );

    const semesterBreakdown = sortedResults.map((result) => {
      const subjects = Array.isArray(result.subjects) ? result.subjects : [];
      const credits = subjects.reduce((sum, subject) => sum + (Number(subject?.credits) || 0), 0);
      const publishedCount = subjects.filter((subject) => Boolean(subject?.grade)).length;

      return {
        semester: result.semester,
        gpa: roundTo(Number(result.gpa) || 0, 2),
        credits,
        subjects: subjects.length,
        deansList: Number(result.gpa) >= 3.7,
        publishedCount,
      };
    });

    const totalCreditsEarned = semesterBreakdown.reduce((sum, item) => sum + item.credits, 0);
    const totalCreditsRequired = 128;
    const cumulativeGpa =
      sortedResults.length > 0
        ? roundTo(
            sortedResults.reduce((sum, result) => sum + (Number(result.gpa) || 0), 0) /
              sortedResults.length,
            2
          )
        : 0;

    const deansListCount = semesterBreakdown.filter((item) => item.deansList).length;

    const data = {
      student: {
        id: String(student._id),
        name: student.name,
        rollNumber: student.rollNumber,
        department: student.department || null,
      },
      overview: {
        cumulativeGpa,
        totalCreditsEarned,
        totalCreditsRequired,
        deansListCount,
        academicStanding: resolveAcademicStanding(cumulativeGpa),
      },
      semesterBreakdown,
      gpaScale: GPA_SCALE,
    };

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Student GPA summary API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to load GPA summary data.',
      },
      { status: 500 }
    );
  }
}
