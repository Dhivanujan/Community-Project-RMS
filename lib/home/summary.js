import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';
import Result from '@/models/Result';

function roundTo(value, places = 2) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

export function getHomepageFallbackSummary() {
  return {
    overallGpa: 0,
    totalStudents: 0,
    activeCourses: 0,
    firstClassEligible: 0,
    atRisk: 0,
    topPerformers: [],
    departmentStats: [],
    gpaDistribution: {
      below2: 0,
      between2And24: 0,
      between25And29: 0,
      between30And34: 0,
      above35: 0,
    },
  };
}

export async function getHomepageSummary() {
  const fallback = getHomepageFallbackSummary();

  await dbConnect();

  const [students, results] = await Promise.all([
    Student.find({}, 'name department').lean(),
    Result.find({}, 'student gpa subjects').lean(),
  ]);

  const studentById = new Map(students.map((student) => [String(student._id), student]));

  const gpas = [];
  const subjects = new Set();
  const studentBestGpa = new Map();

  const departmentMap = new Map();
  for (const student of students) {
    const deptName = student.department?.trim() || 'Unassigned';
    if (!departmentMap.has(deptName)) {
      departmentMap.set(deptName, {
        title: deptName,
        students: 0,
        gpaSum: 0,
        gpaCount: 0,
      });
    }
    departmentMap.get(deptName).students += 1;
  }

  for (const result of results) {
    const gpa = Number(result.gpa);
    if (Number.isFinite(gpa)) {
      gpas.push(gpa);

      const studentId = String(result.student);
      const currentBest = studentBestGpa.get(studentId);
      if (currentBest === undefined || gpa > currentBest) {
        studentBestGpa.set(studentId, gpa);
      }

      const student = studentById.get(studentId);
      const deptName = student?.department?.trim() || 'Unassigned';
      if (departmentMap.has(deptName)) {
        const dept = departmentMap.get(deptName);
        dept.gpaSum += gpa;
        dept.gpaCount += 1;
      }
    }

    if (Array.isArray(result.subjects)) {
      for (const subject of result.subjects) {
        if (subject?.subjectName) {
          subjects.add(subject.subjectName);
        }
      }
    }
  }

  const overallGpa =
    gpas.length > 0 ? roundTo(gpas.reduce((sum, gpa) => sum + gpa, 0) / gpas.length, 2) : 0;

  const firstClassEligible = gpas.filter((gpa) => gpa >= 3.7).length;
  const atRisk = gpas.filter((gpa) => gpa < 2.0).length;

  const topPerformers = Array.from(studentBestGpa.entries())
    .map(([studentId, gpa]) => ({
      id: studentId,
      name: studentById.get(studentId)?.name || 'Unknown Student',
      gpa: roundTo(gpa, 2),
    }))
    .sort((a, b) => b.gpa - a.gpa)
    .slice(0, 3);

  const departmentStats = Array.from(departmentMap.values())
    .map((dept) => {
      const avg = dept.gpaCount > 0 ? dept.gpaSum / dept.gpaCount : 0;
      return {
        title: dept.title,
        students: dept.students,
        gpa: roundTo(avg, 2),
        gpaPercent: Math.max(0, Math.min(100, Math.round((avg / 4) * 100))),
      };
    })
    .sort((a, b) => b.students - a.students)
    .slice(0, 3);

  const totalCount = gpas.length || 1;
  const gpaDistribution = {
    below2: Math.round((gpas.filter((gpa) => gpa < 2.0).length / totalCount) * 100),
    between2And24: Math.round((gpas.filter((gpa) => gpa >= 2.0 && gpa < 2.5).length / totalCount) * 100),
    between25And29: Math.round((gpas.filter((gpa) => gpa >= 2.5 && gpa < 3.0).length / totalCount) * 100),
    between30And34: Math.round((gpas.filter((gpa) => gpa >= 3.0 && gpa < 3.5).length / totalCount) * 100),
    above35: Math.round((gpas.filter((gpa) => gpa >= 3.5).length / totalCount) * 100),
  };

  return {
    ...fallback,
    overallGpa,
    totalStudents: students.length,
    activeCourses: subjects.size,
    firstClassEligible,
    atRisk,
    topPerformers,
    departmentStats,
    gpaDistribution,
  };
}
