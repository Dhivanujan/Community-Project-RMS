import dbConnect from '@/lib/dbConnect';
import { requireAdmin, requireAuth } from '@/lib/auth';
import Student from '@/models/Student';
import { NextResponse } from 'next/server';

// ✅ GET all students - ADMIN ONLY
export async function GET(request) {
    try {
        // Require admin authentication
        const { authorized, response: authResponse } = await requireAdmin(request);
        if (!authorized) return authResponse;

        await dbConnect();
        const students = await Student.find();
        return Response.json(students);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

// Add new student - ADMIN ONLY with input validation
export async function POST(request) {
    try {
        // Require admin authentication
        const { authorized, response: authResponse } = await requireAdmin(request);
        if (!authorized) return authResponse;

        await dbConnect();
        const body = await request.json();

        // Input validation
        const requiredFields = ['name', 'email', 'rollNumber'];
        const missingFields = requiredFields.filter(field => !body[field]);
        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Missing required fields: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        // Check for duplicate email
        const existingStudent = await Student.findOne({ email: body.email });
        if (existingStudent) {
            return NextResponse.json({ error: 'Student with this email already exists' }, { status: 409 });
        }

        const student = await Student.create(body);
        return Response.json(student, { status: 201 });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}