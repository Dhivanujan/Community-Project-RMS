import StudentDashboardLayout from "@/components/Student/StudentDashboardLayout";
import ResultsPage from "@/components/Student/ResultsPage";

export const metadata = {
  title: "Results — SUSL MeritMatrix",
  description: "View your academic results across all semesters.",
};

export default function ResultsRoute() {
  return (
    <StudentDashboardLayout>
      <ResultsPage />
    </StudentDashboardLayout>
  );
}
