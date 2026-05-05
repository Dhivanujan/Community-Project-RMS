import dbConnect from '@/lib/dbConnect';
import { requireAdmin } from '@/lib/auth';
import Student from '@/models/Student';
import Result from '@/models/Result';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
    try {
        // Require admin authentication
        const { authorized, response: authResponse } = await requireAdmin(request);
        if (!authorized) return authResponse;

        await dbConnect();
        
        const { id } = params;
        const body = await request.json();
        
        // Prevent updates to sensitive fields
        delete body.rollNumber; // rollNumber should not be changed
        delete body._id;
        
        const student = await Student.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        ).lean();
        
        if (!student) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }
        
        return NextResponse.json(student, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        // Require admin authentication
        const { authorized, response: authResponse } = await requireAdmin(request);
        if (!authorized) return authResponse;

        await dbConnect();
        
        const { id } = params;
        
        const student = await Student.findByIdAndDelete(id);
        
        if (!student) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }
        
        // Delete related results for cleanup
        await Result.deleteMany({ student: id });
        
        return NextResponse.json({ message: 'Student deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
