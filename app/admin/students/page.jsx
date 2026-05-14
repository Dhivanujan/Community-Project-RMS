import StudentManager from '@/components/admin/student/StudentManager';
import prisma from '@/lib/prisma';
import { Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StudentsPage() {
    // Fetch initial student data using Prisma
    const initialStudents = await prisma.studentProfile.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: true
        }
    });

    // Format for StudentManager component
    const serializedStudents = initialStudents.map(student => ({
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        firstName: student.firstName,
        lastName: student.lastName,
        rollNumber: student.indexNumber,
        indexNumber: student.indexNumber,
        email: student.user.email,
        username: student.user.username,
        department: student.department,
        enrollmentYear: student.enrollmentYear,
        createdAt: student.createdAt?.toISOString(),
        updatedAt: student.updatedAt?.toISOString()
    }));

    return (
        <div className="w-full h-full space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-[1.15] flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-2xl">
                            <Users className="w-8 h-8 text-blue-600" />
                        </div>
                        Students
                    </h1>
                    <p className="mt-3 text-slate-500 text-sm font-medium">
                        Manage university students, enrollments, and academic records.
                    </p>
                </div>
            </header>

            <StudentManager initialStudents={serializedStudents} />
        </div>
    );
}
