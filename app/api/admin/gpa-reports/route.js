import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import ResultUpload from '@/models/ResultUpload';
import Student from '@/models/Student';
import GpaReport from '@/models/GpaReport';
import prisma from '@/lib/prisma';
import { recalculateStudentGPA } from '@/lib/gpa';
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

    const uploads = await ResultUpload.find(query).lean();

    // Fetch all student profiles from Prisma to map name and roll number without depending on mongoose populate
    const studentProfiles = await prisma.studentProfile.findMany({});
    const profileMap = {};
    studentProfiles.forEach((p) => {
      profileMap[p.id.toString()] = {
        name: `${p.firstName} ${p.lastName}`,
        rollNumber: p.rollNumber || p.indexNumber,
        department: p.department || 'N/A',
        enrollmentYear: p.enrollmentYear || 'N/A',
      };
    });

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
        const sid = entry.student.toString();
        const profile = profileMap[sid];
        if (!profile) return;

        if (!studentGpaMap[sid]) {
          studentGpaMap[sid] = {
            _id: sid,
            name: profile.name,
            rollNumber: profile.rollNumber,
            department: profile.department || upload.department,
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

    // ── 6. Self-healing Seeding ──
    const gpaCount = await GpaReport.countDocuments();
    if (gpaCount === 0) {
      const uniqueStudentIds = Object.keys(studentGpaMap);
      for (const studentId of uniqueStudentIds) {
        try {
          await recalculateStudentGPA(studentId);
        } catch (err) {
          console.error(`Failed to seed GPA for student ${studentId}:`, err);
        }
      }
    }

    // ── 7. Query GPA Records with Filters & Search ──
    const searchStudentId = searchParams.get('studentId')?.trim() || '';
    const gpaQuery = {};
    if (department) gpaQuery.department = department;
    if (batch) {
      if (batch.includes('/')) {
        const parts = batch.split('/');
        const startYr = parts[0].length === 2 ? `20${parts[0]}` : parts[0];
        const endYr = parts[1].length === 2 ? `20${parts[1]}` : parts[1];
        const fullBatch = `${startYr}/${endYr}`;
        gpaQuery.$or = [
          { batch: batch },
          { batch: fullBatch }
        ];
      } else {
        gpaQuery.batch = batch;
      }
    }
    if (searchStudentId) {
      gpaQuery.studentId = { $regex: searchStudentId, $options: 'i' };
    }

    const gpaRecords = await GpaReport.find(gpaQuery).sort({ studentId: 1 }).lean();

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
        gpaRecords,
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
