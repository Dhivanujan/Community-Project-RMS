import DashboardCard from '@/components/admin/DashboardCard';
import { Users, FileText, BarChart3, CheckCircle2, Clock, Building2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';
import Result from '@/models/Result';
import ResultUpload from '@/models/ResultUpload';



const GPABarChart = dynamic(
    () => import('@/components/admin/GPABarChart'),
    { ssr: false }
);

export default async function AdminDashboard() {
    // 1. Connect to Database directly in this Server Component
    await dbConnect();

    // 2. Fetch counts
    const totalStudents = await Student.countDocuments();
    const totalResults = await Result.countDocuments();
    const publishedUploads = await ResultUpload.countDocuments({ status: 'published' });

    // 2b. Fetch recent published uploads for activity feed
    const recentActivity = await ResultUpload.find({ status: 'published' })
        .sort({ publishedAt: -1 })
        .limit(5)
        .select('subjectName department semester publishedAt batch academicYear')
        .lean();
    const serializedActivity = recentActivity.map((a) => ({
        ...a,
        _id: a._id.toString(),
        publishedAt: a.publishedAt?.toISOString() || a.updatedAt?.toISOString() || null,
    }));

    // 3. Compute overall Average GPA and Trend Data
    const results = await Result.find({}, 'gpa semester').lean();

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

        // Format for Recharts: { semester: "Sem 1", GPA: 3.5 }
        chartData = Object.entries(bySemester).map(([sem, data]) => ({
            semester: `Sem ${sem}`,
            GPA: parseFloat((data.sum / data.count).toFixed(2))
        }));

        // Sort by semester alphabetically/numerically
        chartData.sort((a, b) => a.semester.localeCompare(b.semester));
    }

    return (
        <div className="w-full h-full space-y-8">
            <header>
                <h1 className="text-3xl lg:text-4xl font-bold text-textDark tracking-tight leading-[1.15]">
                    Dashboard Overview
                </h1>
                <p className="mt-3 text-textMuted text-sm font-medium">
                    Monitor your university&apos;s real-time performance, results statistics, and recent activity.
                </p>
            </header>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard
                    title="Total Students"
                    value={totalStudents.toString()}
                    icon={<Users className="w-5 h-5" />}
                    bgColor="bg-primary"
                />
                <DashboardCard
                    title="Result Entries"
                    value={totalResults.toString()}
                    icon={<FileText className="w-5 h-5" />}
                    bgColor="bg-blue-500/80"
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
            <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                    <Clock className="w-4 h-4 text-primary" />
                    <p className="text-sm font-bold text-textDark">Recent Published Results</p>
                </div>
                {serializedActivity.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                        <CheckCircle2 className="w-10 h-10 text-primary/20" />
                        <p className="text-sm text-textMuted">No published results yet.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {serializedActivity.map((item) => (
                            <div
                                key={item._id}
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors border border-transparent hover:border-border"
                            >
                                <div className="mt-0.5 w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-textDark truncate">{item.subjectName}</p>
                                    <p className="text-xs text-textMuted mt-0.5">
                                        {item.department} · {item.semester} · Batch {item.batch}
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xs text-textMuted font-medium">
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