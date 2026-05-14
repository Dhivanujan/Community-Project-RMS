import DashboardCard from '@/components/admin/DashboardCard';
import { Users, FileText, BarChart3, CheckCircle2, Clock } from 'lucide-react';
import dynamic from 'next/dynamic';
import prisma from '@/lib/prisma';

const GPABarChart = dynamic(
    () => import('@/components/admin/GPABarChart'),
    { ssr: false }
);

export default async function AdminDashboard() {
    // 2. Fetch counts using Prisma
    const totalStudents = await prisma.studentProfile.count();
    const totalResults = await prisma.result.count();
    const publishedUploads = await prisma.resultUpload.count({
        where: { status: 'published' }
    });

    // 2b. Fetch recent published uploads for activity feed
    const recentActivity = await prisma.resultUpload.findMany({
        where: { status: 'published' },
        orderBy: { publishedAt: 'desc' },
        take: 5,
        select: {
            id: true,
            subjectName: true,
            department: true,
            semester: true,
            publishedAt: true,
            batch: true,
            academicYear: true,
        }
    });

    // 3. Compute overall Average GPA and Trend Data
    const results = await prisma.result.findMany({
        select: {
            gpa: true,
            semester: true
        }
    });

    let averageGpa = 0;
    let chartData = [];

    if (results.length > 0) {
        // Average
        const totalGpa = results.reduce((sum, r) => sum + r.gpa, 0);
        averageGpa = Number((totalGpa / results.length).toFixed(2));

        // Group by Semester for the Chart Data
        const bySemester = results.reduce((acc, current) => {
            if (!acc[current.semester]) acc[current.semester] = { sum: 0, count: 0 };
            acc[current.semester].sum += current.gpa;
            acc[current.semester].count += 1;
            return acc;
        }, {});

        // Format for Recharts
        chartData = Object.entries(bySemester).map(([sem, data]) => ({
            semester: `Sem ${sem}`,
            GPA: parseFloat((data.sum / data.count).toFixed(2))
        }));

        // Sort by semester
        chartData.sort((a, b) => a.semester.localeCompare(b.semester));
    }

    return (
        <div className="w-full h-full space-y-8">
            <header>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-[1.15]">
                    Faculty of Computing RMS
                </h1>
                <p className="mt-3 text-slate-500 text-sm font-medium">
                    Welcome to the Result Management System. Monitor student performance, academic statistics, and recent activity.
                </p>
            </header>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard
                    title="Total Students"
                    value={totalStudents.toString()}
                    icon={<Users className="w-5 h-5" />}
                    bgColor="bg-blue-900"
                />
                <DashboardCard
                    title="Result Entries"
                    value={totalResults.toString()}
                    icon={<FileText className="w-5 h-5" />}
                    bgColor="bg-blue-600/80"
                />
                <DashboardCard
                    title="Average GPA"
                    value={averageGpa.toFixed(2)}
                    icon={<BarChart3 className="w-5 h-5" />}
                    bgColor="bg-green-500/80"
                />
                <DashboardCard
                    title="Published Results"
                    value={publishedUploads.toString()}
                    icon={<CheckCircle2 className="w-5 h-5" />}
                    bgColor="bg-violet-500/80"
                />
            </div>

            <div className="w-full">
                <GPABarChart data={chartData} />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                    <Clock className="w-4 h-4 text-blue-900" />
                    <p className="text-sm font-bold text-slate-900">Recent Published Results</p>
                </div>
                {recentActivity.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                        <CheckCircle2 className="w-10 h-10 text-blue-900/20" />
                        <p className="text-sm text-slate-500">No published results yet.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentActivity.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors border border-transparent hover:border-slate-100"
                            >
                                <div className="mt-0.5 w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 truncate">{item.subjectName}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {item.department} · {item.semester} · Batch {item.batch}
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xs text-slate-500 font-medium">
                                        {item.publishedAt
                                            ? new Date(item.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
                                            : '—'}
                                    </p>
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                        Published
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}