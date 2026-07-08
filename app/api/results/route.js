import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
  rawFind,
  rawInsert,
  rawFindOne,
  toOidFilter,
  parseOid,
  toDateRaw,
  newOid,
} from '@/lib/rawMongo';

function isValidOid(id) {
  return /^[a-f\d]{24}$/i.test(id);
}

async function resolveStudentId({ studentId, rollNumber, email }) {
  if (studentId) {
    if (!isValidOid(studentId)) {
      return null;
    }
    return studentId;
  }

  if (rollNumber) {
    const student = await prisma.studentProfile.findFirst({
      where: { OR: [{ rollNumber }, { indexNumber: rollNumber }] }
    });
    return student?.id || null;
  }

  if (email) {
    const student = await prisma.studentProfile.findFirst({
      where: { user: { email } }
    });
    return student?.id || null;
  }

  return null;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId')?.trim() || '';
    const rollNumber = searchParams.get('rollNumber')?.trim() || '';
    const email = searchParams.get('email')?.trim() || '';
    const semester = searchParams.get('semester')?.trim() || '';

    const query = {};

    if (studentId || rollNumber || email) {
      const resolvedStudentId = await resolveStudentId({ studentId, rollNumber, email });
      if (!resolvedStudentId) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid student identifier or student not found.',
          },
          { status: 400 }
        );
      }
      query.student = toOidFilter(resolvedStudentId);
    }

    if (semester) {
      query.semester = semester;
    }

    const results = await rawFind('Result', query, { sort: { createdAt: -1 } });

    // Populate student field
    const studentIds = results.map(r => parseOid(r.student)).filter(Boolean);
    const profiles = await prisma.studentProfile.findMany({
      where: { id: { in: studentIds } },
      include: { user: true }
    });
    const profileMap = {};
    profiles.forEach(p => {
      profileMap[p.id] = {
        _id: p.id,
        name: `${p.firstName} ${p.lastName}`,
        rollNumber: p.rollNumber || p.indexNumber,
        email: p.user?.email || '',
        department: p.department,
        enrollmentYear: p.enrollmentYear,
      };
    });

    const populated = results.map(r => ({
      ...r,
      _id: parseOid(r._id),
      student: profileMap[parseOid(r.student)] || null,
      createdAt: r.createdAt?.$date?.$numberLong ? new Date(parseInt(r.createdAt.$date.$numberLong)).toISOString() : r.createdAt,
      updatedAt: r.updatedAt?.$date?.$numberLong ? new Date(parseInt(r.updatedAt.$date.$numberLong)).toISOString() : r.updatedAt,
    }));

    return NextResponse.json({ success: true, data: populated }, { status: 200 });
  } catch (error) {
    console.error('Results API GET error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to fetch results.',
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { studentId, semester, gpa, totalCredits, subjects } = body;

    if (!studentId || !semester || gpa === undefined || gpa === null) {
      return NextResponse.json(
        {
          success: false,
          message: 'studentId, semester, and gpa are required.',
        },
        { status: 400 }
      );
    }

    if (!isValidOid(studentId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid studentId format.',
        },
        { status: 400 }
      );
    }

    const studentExists = await prisma.studentProfile.findUnique({
      where: { id: studentId }
    });
    if (!studentExists) {
      return NextResponse.json(
        {
          success: false,
          message: 'Student does not exist.',
        },
        { status: 404 }
      );
    }

    const resultId = newOid();
    const now = new Date();

    await rawInsert('Result', {
      _id: toOidFilter(resultId),
      student: toOidFilter(studentId),
      semester,
      gpa: Number(gpa),
      totalCredits: Number(totalCredits) || 0,
      subjects: (Array.isArray(subjects) ? subjects : []).map(s => ({
        subjectName: s.subjectName,
        grade: s.grade,
        credits: Number(s.credits) || 0,
      })),
      createdAt: toDateRaw(now),
      updatedAt: toDateRaw(now),
    });

    const profile = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: { user: true }
    });

    const populatedResult = {
      _id: resultId,
      student: profile ? {
        _id: profile.id,
        name: `${profile.firstName} ${profile.lastName}`,
        rollNumber: profile.rollNumber || profile.indexNumber,
        email: profile.user?.email || '',
        department: profile.department,
        enrollmentYear: profile.enrollmentYear,
      } : null,
      semester,
      gpa: Number(gpa),
      totalCredits: Number(totalCredits) || 0,
      subjects: Array.isArray(subjects) ? subjects : [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    return NextResponse.json({ success: true, data: populatedResult }, { status: 201 });
  } catch (error) {
    console.error('Results API POST error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to create result record.',
      },
      { status: 500 }
    );
  }
}
