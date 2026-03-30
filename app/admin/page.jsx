import DashboardCard from '@/components/admin/DashboardCard';
import { Users, FileText, BarChart3 } from 'lucide-react';
import dynamic from 'next/dynamic';

// ✅ FIX (important)
const GPABarChart = dynamic(
    () => import('@/components/admin/GPABarChart'),
    { ssr: false }
);

export default function AdminDashboard() {
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
                    value="450"
                    icon={<Users className="w-5 h-5" />}
                    bgColor="bg-primary"
                />
                <DashboardCard
                    title="Total Results"
                    value="1200"
                    icon={<FileText className="w-5 h-5" />}
                    bgColor="bg-blue-500/80"
                />
                <DashboardCard
                    title="Average GPA"
                    value="3.6"
                    icon={<BarChart3 className="w-5 h-5" />}
                    bgColor="bg-green-500/80"
                />
            </div>

            {/* Chart */}
            <GPABarChart />
        </div>
    );
}