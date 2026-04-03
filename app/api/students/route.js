import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';

// ✅ GET all students
export async function GET() {
    try {
        await dbConnect();
        const students = await Student.find();
        return Response.json(students);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

// Add new student
export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const student = await Student.create(body);
        return Response.json(student, { status: 201 });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}