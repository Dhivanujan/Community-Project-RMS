import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  toOidFilter, toDateRaw, parseOid,
  rawFindOne, rawUpdate, rawUpsert,
} from '@/lib/rawMongo';
import { GRADE_POINT_MAP } from '@/lib/resultUpload/config';
import { sendResultPublishedEmail } from '@/lib/email';

function isValidOid(id) {
  return /^[a-f\d]{24}$/i.test(id);
}

// ── POST: Publish a result upload ──
export async function POST(request, { params }) {
  try {
    const { authorized, response: authResponse } = await requireAdmin(request);
    if (!authorized) return authResponse;

    const { id } = params;
    if (!isValidOid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid upload ID format.' }, { status: 400 });
    }

    const upload = await rawFindOne('ResultUpload', { _id: toOidFilter(id) });
    if (!upload) {
      return NextResponse.json({ success: false, message: 'Result upload not found.' }, { status: 404 });
    }
    if (upload.status === 'published') {
      return NextResponse.json({ success: false, message: 'This result upload has already been published.' }, { status: 400 });
    }

    const incomplete = (upload.entries || []).filter(e => !e.grade);
    if (incomplete.length > 0) {
      return NextResponse.json(
        { success: false, message: `${incomplete.length} student(s) have no grades assigned.` },
        { status: 400 }
      );
    }

    const subjectLabel = `${upload.subjectCode} - ${upload.subjectName}`;

    // ── For each student: upsert Result doc + notification ──
    for (const entry of upload.entries) {
      const studentId = parseOid(entry.student);
      const grade = entry.grade;
      const credits = upload.credits;
      const gradePoint = GRADE_POINT_MAP[grade] ?? 0;

      // Upsert the student's Result record for this semester
      const existing = await rawFindOne('Result', {
        student: toOidFilter(studentId),
        semester: upload.semester,
      });

      if (existing) {
        // Check if subject already in subjects array
        const subjects = existing.subjects || [];
        const idx = subjects.findIndex(s => s.subjectName === subjectLabel);

        let updatedSubjects;
        if (idx >= 0) {
          updatedSubjects = subjects.map((s, i) =>
            i === idx ? { ...s, grade } : s
          );
        } else {
          updatedSubjects = [...subjects, { subjectName: subjectLabel, grade, credits }];
        }

        // Recalculate GPA
        let weightedSum = 0, totalCredits = 0;
        for (const s of updatedSubjects) {
          const gp = GRADE_POINT_MAP[s.grade];
          if (gp !== undefined && s.credits > 0) {
            weightedSum  += gp * s.credits;
            totalCredits += s.credits;
          }
        }
        const gpa = totalCredits > 0 ? Math.round((weightedSum / totalCredits) * 100) / 100 : 0;

        await rawUpdate(
          'Result',
          { student: toOidFilter(studentId), semester: upload.semester },
          { $set: { subjects: updatedSubjects, gpa, totalCredits, updatedAt: toDateRaw(new Date()) } }
        );
      } else {
        // Create new Result document
        const { newOid } = await import('@/lib/rawMongo');
        const resultId = newOid();
        const now = new Date();
        const gpa = credits > 0 ? Math.round((gradePoint * credits) / credits * 100) / 100 : 0;

        await rawUpsert(
          'Result',
          { student: toOidFilter(studentId), semester: upload.semester },
          {
            $set: {
              student:      toOidFilter(studentId),
              semester:     upload.semester,
              gpa,
              totalCredits: credits,
              subjects:     [{ subjectName: subjectLabel, grade, credits }],
              updatedAt:    toDateRaw(now),
            },
            $setOnInsert: {
              createdAt: toDateRaw(now),
            },
          }
        );
      }

      // ── Notification (non-blocking) ──
      try {
        const notifNow = new Date();
        await rawUpsert(
          'StudentNotification',
          { student: toOidFilter(studentId), type: 'results', 'meta.subjectCode': upload.subjectCode },
          {
            $set: {
              student:     toOidFilter(studentId),
              type:        'results',
              category:    'Results',
              title:       `${upload.semester} results updated`,
              description: `Results published for ${subjectLabel}. Grade: ${grade}`,
              read:        false,
              meta:        { subjectCode: upload.subjectCode },
              updatedAt:   toDateRaw(notifNow),
            },
            $setOnInsert: { createdAt: toDateRaw(notifNow) },
          }
        );
      } catch (notifErr) {
        console.warn('Notification upsert warning:', notifErr.message);
      }

      // ── Email (non-blocking) ──
      try {
        const profile = await prisma.studentProfile.findUnique({
          where: { id: studentId },
          include: { user: true },
        });
        if (profile?.user?.email) {
          await sendResultPublishedEmail(
            profile.user.email,
            profile.firstName,
            upload.subjectCode,
            upload.subjectName,
            upload.semester,
            grade,
            upload.department,
            upload.batch
          );
        }
      } catch (emailErr) {
        console.warn('Email send warning:', emailErr.message);
      }
    }

    // ── Mark upload as published ──
    const publishedAt = new Date();
    await rawUpdate(
      'ResultUpload',
      { _id: toOidFilter(id) },
      {
        $set: {
          status:      'published',
          publishedAt: toDateRaw(publishedAt),
          publishedBy: 'Admin',
          updatedAt:   toDateRaw(publishedAt),
        },
        $push: {
          auditLog: {
            action:      'published',
            performedBy: 'Admin',
            performedAt: toDateRaw(publishedAt),
            details:     `Published ${upload.entries.length} result(s) for ${upload.subjectCode}.`,
          },
        },
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: `Results published successfully for ${upload.subjectCode}. ${upload.entries.length} student(s) notified.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Result upload PUBLISH error:', error);
    return NextResponse.json(
      { success: false, message: 'Unable to publish results. Please try again.' },
      { status: 500 }
    );
  }
}
