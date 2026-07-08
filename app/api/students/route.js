import { requireAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { rawFindOne, rawInsert, toOidFilter, newOid, toDateRaw } from '@/lib/rawMongo';

// ✅ GET all students - ADMIN ONLY
export async function GET(request) {
    try {
        // Require admin authentication
        const { authorized, response: authResponse } = await requireAdmin(request);
        if (!authorized) return authResponse;

        // Fetch only valid user IDs first to avoid crashes from orphaned profiles
        // (StudentProfile rows whose userId no longer has a matching User)
        const validUsers = await prisma.user.findMany({ select: { id: true } });
        const validUserIds = validUsers.map(u => u.id);

        const students = await prisma.studentProfile.findMany({
            where: {
                userId: { in: validUserIds }
            },
            include: {
                user: true
            },
            orderBy: { createdAt: 'desc' }
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
        console.error('GET /api/students error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

// Add new student - ADMIN ONLY with input validation
export async function POST(request) {
    try {
        // Require admin authentication
        const { authorized, response: authResponse } = await requireAdmin(request);
        if (!authorized) return authResponse;

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
        const existingStudent = await rawFindOne('students', { email: body.email });
        if (existingStudent) {
            return NextResponse.json({ error: 'Student with this email already exists' }, { status: 409 });
        }

        const now = new Date();
        const studentId = newOid();
        const studentDoc = {
            _id: toOidFilter(studentId),
            name: body.name,
            email: body.email,
            rollNumber: body.rollNumber,
            department: body.department || '',
            enrollmentYear: body.enrollmentYear || '',
            createdAt: toDateRaw(now),
            updatedAt: toDateRaw(now),
        };
        await rawInsert('students', studentDoc);
        
        const serialized = {
            ...studentDoc,
            _id: studentId,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
        };

        return Response.json(serialized, { status: 201 });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}