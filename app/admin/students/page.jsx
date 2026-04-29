import StudentManager from '@/components/admin/student/StudentManager';
import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';
import { Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StudentsPage() {
    await dbConnect();
    
    // Fetch initial student data to pass to the client component
    const initialStudents = await Student.find({})
                                        .sort({ createdAt: -1 })
                                        .lean();

    // Serialize _id to string for Client Component
    const serializedStudents = initialStudents.map(student => ({
        ...student,
        _id: student._id.toString(),
        createdAt: student.createdAt?.toISOString(),
        updatedAt: student.updatedAt?.toISOString()
    }));

    return (
        <div className="w-full h-full space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-textDark tracking-tight leading-[1.15] flex items-center gap-3">
                        <Users className="w-8 h-8 text-primary" />
                        Students
                    </h1>
                    <p className="mt-2 text-textMuted text-sm font-medium">
                        Manage university students, enrollments, and academic records.
                    </p>
                </div>
            </header>

            {/* We pass the initial students to the Manager which handles state & forms */}
            <StudentManager initialStudents={serializedStudents} />
        </div>
    );
}
