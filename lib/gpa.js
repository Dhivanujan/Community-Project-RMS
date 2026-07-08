import prisma from '@/lib/prisma';
import { GRADE_POINT_MAP } from '@/lib/resultUpload/config';
import {
  toOidFilter, toDateRaw, parseOid,
  rawFind, rawUpsert,
} from '@/lib/rawMongo';

/**
 * Recalculates the cumulative GPA of a student based on all their published subjects.
 * Uses Prisma $runCommandRaw (not Mongoose) to avoid the dbConnect DNS SRV issue.
 *
 * @param {string} studentId - The StudentProfile ID
 */
export async function recalculateStudentGPA(studentId) {
  const sid = studentId.toString();

  // 1. Fetch student profile via Prisma
  const student = await prisma.studentProfile.findUnique({ where: { id: sid } });
  if (!student) throw new Error(`Student profile not found for ID: ${sid}`);

  // 2. Fetch all published ResultUploads that contain this student
  const uploads = await rawFind(
    'ResultUpload',
    { status: 'published', 'entries.student': toOidFilter(sid) },
    { sort: { publishedAt: 1 } }
  );

  // Map by subjectCode (repeat-exam rules: cap grade at C on retakes)
  const subjectsMap = {};

  for (const upload of uploads) {
    const entry = (upload.entries || []).find(
      e => parseOid(e.student) === sid
    );
    if (!entry?.grade) continue;

    const subjectCode   = upload.subjectCode;
    const currentGrade  = entry.grade;
    const currentPoints = GRADE_POINT_MAP[currentGrade] ?? 0;

    if (!subjectsMap[subjectCode]) {
      subjectsMap[subjectCode] = {
        subjectName: `${upload.subjectCode} - ${upload.subjectName}`,
        grade:   currentGrade,
        credits: upload.credits,
        points:  currentPoints,
      };
    } else {
      // Repeat attempt: cap at C (2.0)
      let resolvedPoints = currentPoints > 2.0 ? 2.0 : currentPoints;
      let resolvedGrade  = currentPoints > 2.0 ? 'C' : currentGrade;
      if (resolvedPoints > subjectsMap[subjectCode].points) {
        subjectsMap[subjectCode].grade  = resolvedGrade;
        subjectsMap[subjectCode].points = resolvedPoints;
      }
    }
  }

  const subjectsList = Object.values(subjectsMap);
  const publishedSubjects = [];
  const grades   = [];
  const credits  = [];
  let totalCredits = 0;
  let weightedSum  = 0;

  for (const sub of subjectsList) {
    const gp = GRADE_POINT_MAP[sub.grade];
    publishedSubjects.push(sub.subjectName);
    grades.push(sub.grade);
    credits.push(sub.credits);
    if (gp !== undefined && sub.credits > 0) {
      weightedSum  += gp * sub.credits;
      totalCredits += sub.credits;
    }
  }

  const currentGPA = totalCredits > 0
    ? Math.round((weightedSum / totalCredits) * 100) / 100
    : 0;

  const studentName       = `${student.firstName} ${student.lastName}`;
  const studentRollNumber = student.rollNumber || student.indexNumber;
  const now = new Date();

  // 3. Upsert GpaReport via raw command
  await rawUpsert(
    'GpaReport',
    { student: toOidFilter(sid) },
    {
      $set: {
        student:          toOidFilter(sid),
        studentId:        studentRollNumber,
        studentName,
        batch:            student.enrollmentYear || 'N/A',
        department:       student.department || 'N/A',
        publishedSubjects,
        grades,
        credits,
        totalCredits,
        currentGPA,
        lastUpdated:      toDateRaw(now),
        updatedAt:        toDateRaw(now),
      },
      $setOnInsert: { createdAt: toDateRaw(now) },
    }
  );

  return { studentId: sid, currentGPA, totalCredits };
}
