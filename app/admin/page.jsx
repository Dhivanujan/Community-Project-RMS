import DashboardCard from '@/components/admin/DashboardCard';
import { Users, FileText, BarChart3 } from 'lucide-react';
import dynamic from 'next/dynamic';
import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';
import Result from '@/models/Result';

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

    // 3. Compute overall Average GPA and Trend Data
    const results = await Result.find({}, 'gpa semester').lean();

    let averageGpa = 0;
    let chartData = [];

    if (results.length > 0) {
        // Average
        const totalGpa = results.reduce((sum, r) => sum + r.gpa, 0);
        averageGpa = (totalGpa / results.length).toFixed(2);

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard
                    title="Total Students"
                    value={totalStudents.toString()}
                    icon={<Users className="w-5 h-5" />}
                    bgColor="bg-primary"
                />
                <DashboardCard
                    title="Total Results"
                    value={totalResults.toString()}
                    icon={<FileText className="w-5 h-5" />}
                    bgColor="bg-blue-500/80"
                />
                <DashboardCard
                    title="Average GPA"
                    value={averageGpa.toString()}
                    icon={<BarChart3 className="w-5 h-5" />}
                    bgColor="bg-green-500/80"
                />
            </div>

            {/* Chart */}
            <GPABarChart data={chartData} />
        </div>
    );
}