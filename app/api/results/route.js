import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';
import Result from '@/models/Result';

async function resolveStudentId({ studentId, rollNumber, email }) {
	if (studentId) {
		if (!mongoose.Types.ObjectId.isValid(studentId)) {
			return null;
		}
		return studentId;
	}

	if (rollNumber) {
		const student = await Student.findOne({ rollNumber }).select('_id').lean();
		return student?._id ? String(student._id) : null;
	}

	if (email) {
		const student = await Student.findOne({ email }).select('_id').lean();
		return student?._id ? String(student._id) : null;
	}

	return null;
}

export async function GET(request) {
	try {
		await dbConnect();

		const { searchParams } = new URL(request.url);
		const studentId = searchParams.get('studentId')?.trim() || '';
		const rollNumber = searchParams.get('rollNumber')?.trim() || '';
		const email = searchParams.get('email')?.trim() || '';
		const semester = searchParams.get('semester')?.trim() || '';

		const query = {};

		if (studentId || rollNumber || email) {
			const resolvedStudentId = await resolveStudentId({ studentId, rollNumber, email });
			if (!resolvedStudentId) {
				return NextResponse.json(
					{
						success: false,
						message: 'Invalid student identifier or student not found.',
					},
					{ status: 400 }
				);
			}
			query.student = resolvedStudentId;
		}

		if (semester) {
			query.semester = semester;
		}

		const results = await Result.find(query)
			.populate('student', 'name rollNumber email department enrollmentYear')
			.sort({ createdAt: -1 })
			.lean();

		return NextResponse.json({ success: true, data: results }, { status: 200 });
	} catch (error) {
		console.error('Results API GET error:', error);
		return NextResponse.json(
			{
				success: false,
				message: 'Unable to fetch results.',
			},
			{ status: 500 }
		);
	}
}

export async function POST(request) {
	try {
		await dbConnect();

		const body = await request.json();
		const { studentId, semester, gpa, totalCredits, subjects } = body;

		if (!studentId || !semester || gpa === undefined || gpa === null) {
			return NextResponse.json(
				{
					success: false,
					message: 'studentId, semester, and gpa are required.',
				},
				{ status: 400 }
			);
		}

		if (!mongoose.Types.ObjectId.isValid(studentId)) {
			return NextResponse.json(
				{
					success: false,
					message: 'Invalid studentId format.',
				},
				{ status: 400 }
			);
		}

		const studentExists = await Student.exists({ _id: studentId });
		if (!studentExists) {
			return NextResponse.json(
				{
					success: false,
					message: 'Student does not exist.',
				},
				{ status: 404 }
			);
		}

		const created = await Result.create({
			student: studentId,
			semester,
			gpa: Number(gpa),
			totalCredits: Number(totalCredits) || 0,
			subjects: Array.isArray(subjects) ? subjects : [],
		});

		const populatedResult = await Result.findById(created._id)
			.populate('student', 'name rollNumber email department enrollmentYear')
			.lean();

		return NextResponse.json({ success: true, data: populatedResult }, { status: 201 });
	} catch (error) {
		console.error('Results API POST error:', error);
		return NextResponse.json(
			{
				success: false,
				message: 'Unable to create result record.',
			},
			{ status: 500 }
		);
	}
}
