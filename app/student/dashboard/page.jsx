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
      <section className="mb-8">
        <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">
          Welcome back, Alex
        </h1>
        <p className="text-slate-500 text-[15px] mt-1">
          Here is the latest snapshot of your academic performance.
        </p>
      </section>

      {/* Stats Cards */}
      <section className="mb-10">
        <StatsCards />
      </section>

      {/* Bottom Section: Recent Updates + Semester Table */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentUpdates />
        <SemesterTable />
      </section>
    </StudentDashboardLayout>
  );
}