import { NextResponse } from 'next/server';
import {
  ACADEMIC_YEARS,
  DEPARTMENTS,
  BATCHES,
  SEMESTERS,
  SUBJECTS,
  VALID_GRADES,
} from '@/lib/resultUpload/config';

// ── GET: Return filter configuration for the UI ──
export async function GET() {
  return NextResponse.json(
    {
      success: true,
      data: {
        academicYears: ACADEMIC_YEARS,
        departments: DEPARTMENTS,
        batches: BATCHES,
        semesters: SEMESTERS,
        subjects: SUBJECTS,
        validGrades: VALID_GRADES,
      },
    },
    { status: 200 }
  );
}
