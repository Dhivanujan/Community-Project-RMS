import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import ResultUpload from '@/models/ResultUpload';
import Student from '@/models/Student';
import { GRADE_POINT_MAP } from '@/lib/resultUpload/config';

// Grade → GPA point conversion (already in config)
const gradeToGPA = GRADE_POINT_MAP;

export async function GET(request) {
  try {
    const { authorized, response: authResponse } = await requireAdmin(request);
    if (!authorized) return authResponse;

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department')?.trim() || '';
    const academicYear = searchParams.get('academicYear')?.trim() || '';
    const batch = searchParams.get('batch')?.trim() || '';
    const semester = searchParams.get('semester')?.trim() || '';

    // Only look at published uploads
    const query = { status: 'published' };
    if (department) query.department = department;
    if (academicYear) query.academicYear = academicYear;
    if (batch) query.batch = batch;
    if (semester) query.semester = semester;

    const uploads = await ResultUpload.find(query)
      .populate('entries.student', 'name rollNumber department enrollmentYear')
      .lean();

    // ── 1. Grade Distribution (across all filtered uploads) ──
    const gradeCount = {};
    uploads.forEach((upload) => {
      upload.entries.forEach((entry) => {
        const g = entry.grade;
        gradeCount[g] = (gradeCount[g] || 0) + 1;
      });
    });

    const gradeDistribution = Object.entries(gradeCount)
      .map(([grade, count]) => ({
        grade,
        count,
        gpaPoint: gradeToGPA[grade] ?? 0,
      }))
      .sort((a, b) => b.gpaPoint - a.gpaPoint);

    // ── 2. Department Comparison (avg GPA per dept) ──
    const deptGpaMap = {};
    uploads.forEach((upload) => {
      const dept = upload.department;
      if (!deptGpaMap[dept]) deptGpaMap[dept] = { sum: 0, count: 0 };
      upload.entries.forEach((entry) => {
        const gpa = gradeToGPA[entry.grade] ?? 0;
        deptGpaMap[dept].sum += gpa;
        deptGpaMap[dept].count += 1;
      });
    });
    const departmentComparison = Object.entries(deptGpaMap).map(([dept, data]) => ({
      department: dept,
      avgGPA: data.count > 0 ? parseFloat((data.sum / data.count).toFixed(2)) : 0,
      studentCount: data.count,
    })).sort((a, b) => b.avgGPA - a.avgGPA);

    // ── 3. Semester GPA Trend (avg GPA per semester per dept) ──
    const semDeptMap = {};
    uploads.forEach((upload) => {
      const key = `${upload.semester}|||${upload.department}`;
      if (!semDeptMap[key]) semDeptMap[key] = { sum: 0, count: 0, semester: upload.semester, department: upload.department };
      upload.entries.forEach((entry) => {
        semDeptMap[key].sum += gradeToGPA[entry.grade] ?? 0;
        semDeptMap[key].count += 1;
      });
    });
    const semesterTrend = Object.values(semDeptMap).map((item) => ({
      semester: item.semester,
      department: item.department,
      avgGPA: item.count > 0 ? parseFloat((item.sum / item.count).toFixed(2)) : 0,
    })).sort((a, b) => a.semester.localeCompare(b.semester));

    // ── 4. Top Performers (per student, weighted avg GPA across all their entries) ──
    const studentGpaMap = {};
    uploads.forEach((upload) => {
      upload.entries.forEach((entry) => {
        if (!entry.student) return;
        const sid = entry.student._id.toString();
        if (!studentGpaMap[sid]) {
          studentGpaMap[sid] = {
            _id: sid,
            name: entry.student.name,
            rollNumber: entry.student.rollNumber,
            department: entry.student.department || upload.department,
            sum: 0,
            count: 0,
            grades: [],
          };
        }
        studentGpaMap[sid].sum += gradeToGPA[entry.grade] ?? 0;
        studentGpaMap[sid].count += 1;
        studentGpaMap[sid].grades.push(entry.grade);
      });
    });

    const topPerformers = Object.values(studentGpaMap)
      .map((s) => ({
        ...s,
        avgGPA: s.count > 0 ? parseFloat((s.sum / s.count).toFixed(2)) : 0,
      }))
      .sort((a, b) => b.avgGPA - a.avgGPA)
      .slice(0, 10);

    // ── 5. Summary Stats ──
    const totalEntries = uploads.reduce((sum, u) => sum + u.entries.length, 0);
    const totalGPA = uploads.reduce((sum, u) => {
      return sum + u.entries.reduce((s, e) => s + (gradeToGPA[e.grade] ?? 0), 0);
    }, 0);
    const overallAvgGPA = totalEntries > 0 ? parseFloat((totalGPA / totalEntries).toFixed(2)) : 0;
    const totalPublished = uploads.length;
    const uniqueStudents = Object.keys(studentGpaMap).length;

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalPublished,
          totalEntries,
          uniqueStudents,
          overallAvgGPA,
        },
        gradeDistribution,
        departmentComparison,
        semesterTrend,
        topPerformers,
      },
    });
  } catch (error) {
    console.error('GPA Reports API error:', error);
    return NextResponse.json(
      { success: false, message: 'Unable to generate GPA report.' },
      { status: 500 }
    );
  }
}
