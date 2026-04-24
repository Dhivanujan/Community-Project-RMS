import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ResultUpload from '@/models/ResultUpload';
import Student from '@/models/Student';

// ── GET: List all result uploads with optional filters ──
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department')?.trim() || '';
    const semester = searchParams.get('semester')?.trim() || '';
    const status = searchParams.get('status')?.trim() || '';
    const academicYear = searchParams.get('academicYear')?.trim() || '';
    const batch = searchParams.get('batch')?.trim() || '';

    const query = {};
    if (department) query.department = department;
    if (semester) query.semester = semester;
    if (status) query.status = status;
    if (academicYear) query.academicYear = academicYear;
    if (batch) query.batch = batch;

   