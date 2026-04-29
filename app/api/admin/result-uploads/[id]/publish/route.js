import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import ResultUpload from '@/models/ResultUpload';
import Result from '@/models/Result';
import StudentNotification from '@/models/StudentNotification';
import { GRADE_POINT_MAP } from '@/lib/resultUpload/config';

// ── POST: Publish a result upload ──
export async function POST(request, { params }) {
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
        { success: false, message: 'This result upload has already been published.' },
        { status: 400 }
      );
    }

    // ── Validate all entries have grades ──
    const incompleteEntries = upload.entries.filter((e) => !e.grade);
    if (incompleteEntries.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `${incompleteEntries.length} student(s) do not have grades assigned. All students must have grades before publishing.`,
        },
        { status: 400 }
      );
    }

    // ── For each student, upsert into the existing Result model ──
    const subjectEntry = {
      subjectName: `${upload.subjectCode} - ${upload.subjectName}`,
      credits: upload.credits,
    };

    for (const entry of upload.entries) {
      const studentId = entry.student;
      const grade = entry.grade;

      // Find or create a Result doc for this student + semester
      let resultDoc = await Result.findOne({
        student: studentId,
        semester: upload.semester,
      });

      if (resultDoc) {
        // Check if subject already exists in this result
        const existingSubjectIndex = resultDoc.subjects.findIndex(
          (s) => s.subjectName === subjectEntry.subjectName
        );

        if (existingSubjectIndex >= 0) {
          // Update existing subject grade
          resultDoc.subjects[existingSubjectIndex].grade = grade;
        } else {
          // Add new subject
          resultDoc.subjects.push({
            subjectName: subjectEntry.subjectName,
            grade: grade,
            credits: subjectEntry.credits,
          });
        }
      } else {
        // Create new result document
        resultDoc = new Result({
          student: studentId,
          semester: upload.semester,
          gpa: 0,
          totalCredits: 0,
          subjects: [
            {
              subjectName: subjectEntry.subjectName,
              grade: grade,
              credits: subjectEntry.credits,
            },
          ],
        });
      }

      // ── Recalculate GPA and total credits ──
      let weightedSum = 0;
      let totalCredits = 0;

      for (const subject of resultDoc.subjects) {
        const gradePoint = GRADE_POINT_MAP[subject.grade];
        if (gradePoint !== undefined && subject.credits > 0) {
          weightedSum += gradePoint * subject.credits;
          totalCredits += subject.credits;
        }
      }

      resultDoc.gpa = totalCredits > 0 ? Math.round((weightedSum / totalCredits) * 100) / 100 : 0;
      resultDoc.totalCredits = totalCredits;

      await resultDoc.save();

      // ── Create notification for the student ──
      try {
        await StudentNotification.findOneAndUpdate(
          { student: studentId, sourceResultId: resultDoc._id },
          {
            $set: {
              type: 'results',
              category: 'Results',
              title: `${upload.semester} results updated`,
              description: `Results published for ${upload.subjectCode} - ${upload.subjectName}. Grade: ${grade}`,
              read: false,
            },
            $setOnInsert: {
              student: studentId,
              sourceResultId: resultDoc._id,
            },
          },
          { upsert: true, new: true }
        );
      } catch (notifError) {
        // Non-blocking: don't fail publish if notification creation fails
        console.warn('Notification creation warning:', notifError.message);
      }
    }

    // ── Mark upload as published ──
    upload.status = 'published';
    upload.publishedAt = new Date();
    upload.publishedBy = 'Admin';
    upload.auditLog.push({
      action: 'published',
      performedBy: 'Admin',
      performedAt: new Date(),
      details: `Published ${upload.entries.length} result(s) for ${upload.subjectCode}.`,
    });

    await upload.save();

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
