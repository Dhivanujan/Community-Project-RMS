import prisma from '@/lib/prisma';
import dbConnect from '@/lib/dbConnect';
import ResultUpload from '@/models/ResultUpload';
import GpaReport from '@/models/GpaReport';
import { GRADE_POINT_MAP } from '@/lib/resultUpload/config';

/**
 * Recalculates the cumulative GPA of a student based on all their published subjects.
 * Updates the existing GpaReport record or creates a new one if it doesn't exist.
 * 
 * @param {string|ObjectId} studentId - The ID of the student (StudentProfile ID)
 * @returns {Promise<Object>} The updated or created GPA Report document
 */
export async function recalculateStudentGPA(studentId) {
  await dbConnect();

  // 1. Fetch student profile using Prisma
  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId.toString() }
  });
  if (!student) {
    throw new Error(`Student profile not found for ID: ${studentId}`);
  }

  // 2. Fetch all published ResultUploads that contain this student, sorted chronologically
  const uploads = await ResultUpload.find({
    status: 'published',
    'entries.student': studentId
  }).sort({ publishedAt: 1 }).lean();

  // Map by subjectCode, applying repeat exam rules
  const subjectsMap = {};

  for (const upload of uploads) {
    const entry = upload.entries.find(e => e.student.toString() === studentId.toString());
    if (entry && entry.grade) {
      const subjectCode = upload.subjectCode;
      const currentGrade = entry.grade;
      const currentPoints = GRADE_POINT_MAP[currentGrade] ?? 0;

      if (!subjectsMap[subjectCode]) {
        // First attempt: no repeat cap applied
        subjectsMap[subjectCode] = {
          subjectName: `${upload.subjectCode} - ${upload.subjectName}`,
          grade: currentGrade,
          credits: upload.credits,
          points: currentPoints
        };
      } else {
        // Repeated attempt:
        // Capped at maximum grade of C (2.0 points)
        let resolvedGrade = currentGrade;
        let resolvedPoints = currentPoints;
        if (currentPoints > 2.0) {
          resolvedGrade = 'C';
          resolvedPoints = 2.0;
        }

        // Only upgrade if the new attempt is higher than the previous one
        if (resolvedPoints > subjectsMap[subjectCode].points) {
          subjectsMap[subjectCode].grade = resolvedGrade;
          subjectsMap[subjectCode].points = resolvedPoints;
        }
      }
    }
  }

  const subjectsList = Object.values(subjectsMap);

  const publishedSubjects = [];
  const grades = [];
  const credits = [];
  let totalCredits = 0;
  let weightedSum = 0;

  for (const sub of subjectsList) {
    const gradePoint = GRADE_POINT_MAP[sub.grade];
    publishedSubjects.push(sub.subjectName);
    grades.push(sub.grade);
    credits.push(sub.credits);

    if (gradePoint !== undefined && sub.credits > 0) {
      weightedSum += gradePoint * sub.credits;
      totalCredits += sub.credits;
    }
  }

  const currentGPA = totalCredits > 0 ? Math.round((weightedSum / totalCredits) * 100) / 100 : 0;

  // 3. Save/Update GPA report record in database
  const studentName = `${student.firstName} ${student.lastName}`;
  const studentRollNumber = student.rollNumber || student.indexNumber;

  const gpaRecord = await GpaReport.findOneAndUpdate(
    { student: studentId },
    {
      student: studentId,
      studentId: studentRollNumber,
      studentName,
      batch: student.enrollmentYear || 'N/A',
      department: student.department || 'N/A',
      publishedSubjects,
      grades,
      credits,
      totalCredits,
      currentGPA,
      lastUpdated: new Date()
    },
    { upsert: true, new: true }
  );

  return gpaRecord;
}
