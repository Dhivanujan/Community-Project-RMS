import StudentDashboardLayout from "@/components/Student/StudentDashboardLayout";
import GPASummaryPage from "@/components/Student/GPASummaryPage";

export const metadata = {
  title: "GPA Summary — SUSL MeritMatrix",
  description: "Track your academic GPA trends and credit progress.",
};

export default function GPASummaryRoute() {
  return (
    <StudentDashboardLayout>
      <GPASummaryPage />
    </StudentDashboardLayout>
  );
}
