import { requireAdmin, requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// ✅ GET all students - ADMIN ONLY
export async function GET(request) {
    try {
        // Require admin authentication
        const { authorized, response: authResponse } = await requireAdmin(request);
        if (!authorized) return authResponse;

        const students = await prisma.studentProfile.findMany({
            include: {
                user: true
            }
        });
        
        // Format to match old Mongoose structure where possible
        const serializedStudents = students.map(student => ({
            _id: student.id,
            id: student.id,
            name: `${student.firstName} ${student.lastName}`,
            firstName: student.firstName,
            lastName: student.lastName,
            rollNumber: student.indexNumber,
            indexNumber: student.indexNumber,
            email: student.user?.email,
            username: student.user?.username,
            department: student.department,
            enrollmentYear: student.enrollmentYear,
            createdAt: student.createdAt,
            updatedAt: student.updatedAt
        }));

        return Response.json(serializedStudents);
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