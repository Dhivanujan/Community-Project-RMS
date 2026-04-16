import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';
import Result from '@/models/Result';
import mongoose from 'mongoose';

function roundTo(value, places = 2) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function semesterSortKey(semester = '') {
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

function sanitizeSemesterSubjects(subjects = []) {
  if (!Array.isArray(subjects)) return [];

  return subjects.map((subject, index) => {
    const subjectName = subject?.subjectName?.trim() || `Subject ${index + 1}`;
    const grade = subject?.grade?.trim() || null;
    const credits = Number(subject?.credits) || 0;

    return {
      code: `SUB-${String(index + 1).padStart(2, '0')}`,
      title: subjectName,
      grade,
      credits,
      status: grade ? 'Published' : 'Evaluating',
    };
  });
}

function buildUpdateMessages(results) {
  if (!Array.isArray(results) || results.length === 0) {
    return [];
  }

  return results.slice(0, 5).map((result) => {
    const gpa = Number(result.gpa);
    const publishedSubjects = (result.subjects || []).filter((subject) => Boolean(subject?.grade)).length;

    return {
      id: String(result._id),
      type: 'results',
      title: `${result.semester} results updated`,
      description: `Published ${publishedSubjects} subject(s) with semester GPA ${Number.isFinite(gpa) ? roundTo(gpa, 2) : 0}.`,
      createdAt: result.updatedAt,
    };
  });
}

async function resolveStudent(query = {}) {
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

export async function getStudentDashboardData(query = {}) {
  await dbConnect();

  const student = await resolveStudent(query);
  if (!student) {
    return null;
  }

  const results = await Result.find({ student: student._id })
    .sort({ createdAt: -1 })
    .lean();

  const resultsBySemester = [...results].sort(
    (a, b) => semesterSortKey(b.semester) - semesterSortKey(a.semester)
  );

  const currentSemesterResult = resultsBySemester[0] || null;
  const currentSemesterSubjects = sanitizeSemesterSubjects(currentSemesterResult?.subjects || []);

  const semesterBreakdown = resultsBySemester.map((result) => {
    const subjects = sanitizeSemesterSubjects(result.subjects || []);
    const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
    const publishedSubjects = subjects.filter((subject) => subject.grade).length;

    return {
      semester: result.semester,
      gpa: roundTo(Number(result.gpa) || 0, 2),
      totalCredits,
      subjectCount: subjects.length,
      publishedSubjects,
      pendingSubjects: subjects.length - publishedSubjects,
      updatedAt: result.updatedAt,
    };
  });

  const totalSubjects = semesterBreakdown.reduce((sum, semester) => sum + semester.subjectCount, 0);
  const publishedResults = semesterBreakdown.reduce((sum, semester) => sum + semester.publishedSubjects, 0);
  const pendingResults = Math.max(totalSubjects - publishedResults, 0);
  const totalCredits = semesterBreakdown.reduce((sum, semester) => sum + semester.totalCredits, 0);
  const earnedCredits = totalCredits;

  const cumulativeGpa =
    results.length > 0
      ? roundTo(results.reduce((sum, result) => sum + (Number(result.gpa) || 0), 0) / results.length, 2)
      : 0;

  const recentUpdates = buildUpdateMessages(results);

  return {
    student: {
      id: String(student._id),
      name: student.name,
      rollNumber: student.rollNumber,
      email: student.email,
      department: student.department || null,
      enrollmentYear: student.enrollmentYear || null,
    },
    cards: {
      cumulativeGpa,
      totalSubjects,
      publishedResults,
      pendingResults,
      totalCredits,
      earnedCredits,
    },
    currentSemester: {
      name: currentSemesterResult?.semester || null,
      gpa: currentSemesterResult ? roundTo(Number(currentSemesterResult.gpa) || 0, 2) : 0,
      subjects: currentSemesterSubjects,
    },
    semesterBreakdown,
    recentUpdates,
  };
}
