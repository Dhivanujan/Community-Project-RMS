import StudentDashboardLayout from "@/components/Student/StudentDashboardLayout";
import StatsCards from "@/components/Student/StatsCards";
import RecentUpdates from "@/components/Student/RecentUpdates";
import SemesterTable from "@/components/Student/SemesterTable";

export const metadata = {
  title: "Student Dashboard — SUSL MeritMatrix",
  description: "View your academic performance, GPA, and semester results.",
};

export default function DashboardPage() {
  return (
    <StudentDashboardLayout>
      {/* Welcome Section */}
      <section className="mb-7">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, Alex
          </h1>
          <span className="text-xl">👋</span>
        </div>
        <p className="text-slate-400 text-sm">
          Here&apos;s the latest snapshot of your academic performance.
        </p>
      </section>

      {/* Stats Cards */}
      <section className="mb-8">
        <StatsCards />
      </section>

      {/* Bottom Section: Recent Updates + Semester Table */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentUpdates />
        <SemesterTable />
      </section>
    </StudentDashboardLayout>
  );
}