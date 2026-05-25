import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import ResultUpload from '@/models/ResultUpload';
import prisma from '@/lib/prisma';

// ── Grade mapping: Marks → Grade ──
function marksToGrade(marks) {
  if (marks >= 85) return 'A+';
  if (marks >= 75) return 'A';
  if (marks >= 70) return 'A-';
  if (marks >= 65) return 'B+';
  if (marks >= 60) return 'B';
  if (marks >= 55) return 'B-';
  if (marks >= 50) return 'C+';
  if (marks >= 45) return 'C';
  if (marks >= 40) return 'C-';
  if (marks >= 35) return 'D+';
  if (marks >= 30) return 'D';
  if (marks >= 0)  return 'E';
  return 'F';
}

/**
 * Extract structured result rows from raw PDF text.
 * Attempts multiple common patterns found in university result sheets:
 *
 *  Pattern A: "SE/2021/001  75"  (StudentID followed by marks)
 *  Pattern B: "SE/2021/001  CS101  75"  (StudentID, SubjectCode, Marks)
 *  Pattern C: lines that start with an index/roll number
 *
 * Returns array of { studentId, marks } objects.
 */
function extractRowsFromPdfText(text) {
  const lines = text
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const rows = [];

  // ── Regex patterns ──
  // Roll/Index numbers like SE/2021/001, IT/2022/015, CS001, 2021CS001, etc.
  const studentIdPattern = /\b([A-Z]{1,4}[\\/\-]?\d{2,4}[\\/\-]?\d{1,4}|[A-Z]{2,4}\d{3,6}|\d{4}[A-Z]{2,4}\d{3,6})\b/i;
  // Marks: a plain number (0-100), optionally followed by a slash (like 75/100)
  const marksPattern = /\b(\d{1,3})(?:\/100)?\b/;

  for (const line of lines) {
    // Try to find student ID in this line
    const idMatch = line.match(studentIdPattern);
    if (!idMatch) continue;

    const studentId = idMatch[1].toUpperCase();

    // After student ID, extract the first number that looks like marks (0–100)
    const afterId = line.slice(idMatch.index + idMatch[0].length);
    const numbersInLine = [...afterId.matchAll(/\b(\d{1,3})\b/g)].map(m => Number(m[1]));
    const marks = numbersInLine.find(n => n >= 0 && n <= 100);

    if (marks === undefined) continue; // no valid marks found

    rows.push({ studentId, marks });
  }

  return rows;
}

// ── POST: Validate + Preview PDF scan upload ──
export async function POST(request) {
  try {
    const { authorized, response: authResponse } = await requireAdmin(request);
    if (!authorized) return authResponse;

    await dbConnect();

    const formData = await request.formData();
    const file        = formData.get('file');
    const academicYear = formData.get('academicYear')?.trim() || '';
    const department   = formData.get('department')?.trim()   || '';
    const semester     = formData.get('semester')?.trim()     || '';
    const subjectCode  = formData.get('subjectCode')?.trim()  || '';
    const subjectName  = formData.get('subjectName')?.trim()  || '';
    const credits      = Number(formData.get('credits'))      || 0;

    // ── Validate required context fields ──
    if (!academicYear || !department || !semester || !subjectCode || !subjectName || !credits) {
      return NextResponse.json(
        { success: false, message: 'All context fields (Academic Year, Department, Semester, Subject) are required.' },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No PDF file uploaded.' },
        { status: 400 }
      );
    }

    const filename = file.name.toLowerCase();
    if (!filename.endsWith('.pdf')) {
      return NextResponse.json(
        { success: false, message: 'Only PDF files are supported. Please upload a .pdf file.' },
        { status: 400 }
      );
    }

    // ── Parse PDF ──
    let pdfText = '';
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Dynamically import pdf-parse to avoid Next.js edge runtime issues
      const pdfParse = (await import('pdf-parse')).default;
      const pdfData = await pdfParse(buffer);
      pdfText = pdfData.text || '';
    } catch (pdfErr) {
      console.error('PDF parse error:', pdfErr);
      return NextResponse.json(
        { success: false, message: 'Failed to read the PDF. Make sure it is a text-based PDF (not a scanned image).' },
        { status: 422 }
      );
    }

    if (!pdfText.trim()) {
      return NextResponse.json(
        { success: false, message: 'The PDF appears to be empty or is a scanned image. Only text-based PDFs are supported.' },
        { status: 400 }
      );
    }

    // ── Extract rows from PDF text ──
    const extractedRows = extractRowsFromPdfText(pdfText);

    if (extractedRows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No student data could be extracted from this PDF. Please ensure the PDF contains student IDs and marks in a readable format.',
        },
        { status: 400 }
      );
    }

    // ── Fetch students in this department for DB lookup ──
    const allStudents = await prisma.studentProfile.findMany({
      where: { department },
      select: {
        id: true,
        rollNumber: true,
        indexNumber: true,
        firstName: true,
        lastName: true,
        enrollmentYear: true,
      },
    });

    // Build lookup map by rollNumber / indexNumber (case-insensitive)
    const studentByRoll = {};
    allStudents.forEach(s => {
      const key = (s.rollNumber || s.indexNumber || '').toLowerCase().trim().replace(/\s+/g, '');
      if (key) studentByRoll[key] = s;
    });

    // ── Check for existing upload ──
    const existing = await ResultUpload.findOne({ academicYear, department, semester, subjectCode }).lean();

    const validRows   = [];
    const invalidRows = [];
    const seenIds     = new Set();
    let rowNum = 0;

    for (const { studentId, marks } of extractedRows) {
      rowNum++;
      const errors = [];
      const key = studentId.toLowerCase().replace(/\s+/g, '');
      const matchedStudent = studentByRoll[key] || null;

      if (!matchedStudent) {
        errors.push(`Student ID "${studentId}" not found in ${department}`);
      }

      if (marks < 0 || marks > 100) {
        errors.push(`Marks ${marks} is out of range (0–100)`);
      }

      if (matchedStudent && seenIds.has(matchedStudent.id)) {
        errors.push(`Duplicate entry for "${studentId}"`);
      } else if (matchedStudent) {
        seenIds.add(matchedStudent.id);
      }

      if (errors.length > 0) {
        invalidRows.push({ row: rowNum, studentId, marks, errors });
      } else {
        const grade = marksToGrade(marks);
        validRows.push({
          row: rowNum,
          studentId,
          studentName: `${matchedStudent.firstName} ${matchedStudent.lastName}`,
          marks,
          grade,
          internalId: matchedStudent.id,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        validRows,
        invalidRows,
        totalRows: extractedRows.length,
        hasExisting: !!existing,
        existingStatus: existing?.status || null,
        context: { academicYear, department, semester, subjectCode, subjectName, credits },
        // Return detected subjectCode from PDF if found (for info)
        pdfSubjectHint: detectSubjectFromText(pdfText),
      },
    }, { status: 200 });

  } catch (error) {
    console.error('PDF scan error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred while processing the PDF.' },
      { status: 500 }
    );
  }
}

/**
 * Try to detect a subject code mentioned in the PDF text.
 * Returns the first match or null.
 */
function detectSubjectFromText(text) {
  // Common patterns: CS101, IT2023, SE3010, COM201, etc.
  const match = text.match(/\b([A-Z]{2,4}\s?\d{3,4})\b/);
  return match ? match[1].replace(/\s+/, '') : null;
}
