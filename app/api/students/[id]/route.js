import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
    try {
        const { authorized, response: authResponse } = await requireAdmin();
        if (!authorized) return authResponse;

        const { id } = params; // This is the StudentProfile ID
        const body = await request.json();
        
        const studentProfile = await prisma.studentProfile.findUnique({
            where: { id }
        });

        if (!studentProfile) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        // Parse name into firstName and lastName if name is provided
        let firstName = studentProfile.firstName;
        let lastName = studentProfile.lastName;
        
        if (body.name) {
            const parts = body.name.split(' ');
            firstName = parts[0];
            lastName = parts.slice(1).join(' ') || studentProfile.lastName;
        }

        const updatedProfile = await prisma.studentProfile.update({
            where: { id },
            data: {
                firstName: firstName,
                lastName: lastName,
                department: body.department !== undefined ? body.department : studentProfile.department,
                enrollmentYear: body.enrollmentYear !== undefined ? body.enrollmentYear : studentProfile.enrollmentYear,
            }
        });

        if (body.email) {
            await prisma.user.update({
                where: { id: studentProfile.userId },
                data: { email: body.email }
            });
        }
        
        // Return formatted student to match what the frontend expects
        return NextResponse.json({
            id: updatedProfile.id,
            name: `${updatedProfile.firstName} ${updatedProfile.lastName}`,
            rollNumber: updatedProfile.indexNumber,
            department: updatedProfile.department,
            enrollmentYear: updatedProfile.enrollmentYear,
            email: body.email || undefined // frontend uses this
        }, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { authorized, response: authResponse } = await requireAdmin();
        if (!authorized) return authResponse;

        const { id } = params; // This is the StudentProfile ID
        
        const studentProfile = await prisma.studentProfile.findUnique({
            where: { id }
        });

        if (!studentProfile) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }
        
        // Delete the user completely (Prisma Cascade will also delete StudentProfile)
        await prisma.user.delete({
            where: { id: studentProfile.userId }
        });
        
        // Delete related results for cleanup
        await prisma.result.deleteMany({ 
            where: { studentId: studentProfile.userId } 
        });
        
        return NextResponse.json({ message: 'Student deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
