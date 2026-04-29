import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Result from '@/models/Result';
import {
  hasStudentIdentifier,
  normalizeStudentIdentifier,
  resolveStudent,
  roundTo,
  semesterSortKey,
} from '@/lib/student/shared';

const GRADE_POINT_MAP = {
  'A+': 4.0,
  A: 4.0,
  'A-': 3.7,
  'B+': 3.3,
  B: 3.0,
  'B-': 2.7,
  'C+': 2.3,
  C: 2.0,
  'C-': 1.7,
  D: 1.0,
  F: 0,
};

function mapSubjectToRow(subject, index) {
  const grade = subject?.grade?.trim() || '—';
  const gradePoints = grade === '—' ? null : GRADE_POINT_MAP[grade] ?? null;

  return {
    code: `SUB-${String(index + 1).padStart(2, '0')}`,
    title: subject?.subjectName?.trim() || `Subject ${index + 1}`,
    credits: Number(subject?.credits) || 0,
    grade,
    gpa: gradePoints,
    status: grade === '—' ? 'Evaluating' : 'Published',
  };
}

function calculateSemesterGpa(subjects, fallbackGpa) {
  const published = subjects.filter(
    (item) => item.grade !== '—' && Number(item.credits) > 0 && Number.isFinite(item.gpa)
  );
  if (published.length === 0) {
    return fallbackGpa ? roundTo(Number(fallbackGpa), 2) : null;
  }

  const weightedNumerator = published.reduce(
    (sum, item) => sum + Number(item.gpa) * Number(item.credits),
    0
  );
  const weightedDenominator = published.reduce((sum, item) => sum + Number(item.credits), 0);

  if (!weightedDenominator) {
    return fallbackGpa ? roundTo(Number(fallbackGpa), 2) : null;
  }

  const calculated = weightedNumerator / weightedDenominator;

  if (Number.isFinite(calculated)) {
    return roundTo(calculated, 2);
  }

  return fallbackGpa ? roundTo(Number(fallbackGpa), 2) : null;
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

    const semesterFilter = searchParams.get('semester')?.trim() || '';
    const search = searchParams.get('search')?.trim().toLowerCase() || '';

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

    const query = { student: student._id };
    if (semesterFilter) {
      query.semester = semesterFilter;
    }

    const results = await Result.find(query).sort({ createdAt: -1 }).lean();
    const sorted = [...results].sort((a, b) => semesterSortKey(b.semester) - semesterSortKey(a.semester));

    const semesters = sorted.map((result) => result.semester);
    const selectedSemester = semesterFilter || semesters[0] || null;
    const selected = sorted.find((item) => item.semester === selectedSemester) || null;

    const mapped = (selected?.subjects || []).map(mapSubjectToRow);

    const filteredResults =
      search.length === 0
        ? mapped
        : mapped.filter(
            (item) =>
              item.title.toLowerCase().includes(search) || item.code.toLowerCase().includes(search)
          );

    const publishedResults = mapped.filter((item) => item.grade !== '—');
    const totalCredits = mapped.reduce((sum, item) => sum + Number(item.credits), 0);
    const earnedCredits = publishedResults.reduce((sum, item) => sum + Number(item.credits), 0);

    const gradeDistribution = publishedResults.reduce((acc, item) => {
      acc[item.grade] = (acc[item.grade] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json(
      {
        success: true,
        data: {
          student: {
            id: String(student._id),
            name: student.name,
            rollNumber: student.rollNumber,
          },
          selectedSemester,
          semesters,
          stats: {
            semesterGpa: selected ? calculateSemesterGpa(mapped, selected.gpa) : null,
            totalSubjects: mapped.length,
            totalCredits,
            earnedCredits,
            publishedCount: publishedResults.length,
          },
          results: filteredResults,
          gradeDistribution,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Student results API GET error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to load student results.',
      },
      { status: 500 }
    );
  }
}
