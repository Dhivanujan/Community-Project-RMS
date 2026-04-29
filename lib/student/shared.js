import mongoose from 'mongoose';
import Student from '@/models/Student';
import User from '@/models/User';

export function roundTo(value, places = 2) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

export function semesterSortKey(semester = '') {
  const normalized = semester.trim();
  const yearMatch = normalized.match(/(\d{4})/);
  const year = yearMatch ? Number(yearMatch[1]) : 0;

  const lower = normalized.toLowerCase();
  const seasonWeight = lower.includes('spring')
    ? 1
    : lower.includes('summer')
      ? 2
      : lower.includes('fall') || lower.includes('autumn')
        ? 3
        : lower.includes('winter')
          ? 0
          : -1;

  return year * 10 + seasonWeight;
}

export function resolveAcademicStanding(cgpa) {
  if (cgpa >= 3.7) return 'First Class';
  if (cgpa >= 3.3) return 'Second Upper';
  if (cgpa >= 3.0) return 'Second Lower';
  if (cgpa >= 2.0) return 'General';
  return 'At Risk';
}

export async function resolveStudent(query = {}) {
  const { studentId, rollNumber, email } = query;

  if (studentId) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return null;
    }
    return Student.findById(studentId).lean();
  }

  if (rollNumber) {
    return Student.findOne({ rollNumber }).lean();
  }

  if (email) {
    return Student.findOne({ email }).lean();
  }

  return null;
}

export async function resolveUserForStudent(student) {
  if (!student?.email) {
    return null;
  }

  return User.findOne({ email: student.email, role: 'Student' }).lean();
}

export function normalizeStudentIdentifier(searchParams) {
  return {
    studentId: searchParams.get('studentId')?.trim() || '',
    rollNumber: searchParams.get('rollNumber')?.trim() || '',
    email: searchParams.get('email')?.trim() || '',
  };
}

export function hasStudentIdentifier({ studentId, rollNumber, email }) {
  return Boolean(studentId || rollNumber || email);
}
