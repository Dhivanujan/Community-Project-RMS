import StudentDashboardLayout from "@/components/Student/StudentDashboardLayout";
import SettingsPage from "@/components/Student/SettingsPage";

export const metadata = {
  title: "Settings — SUSL MeritMatrix",
  description: "Manage your account preferences and profile settings.",
};

export default function SettingsRoute() {
  return (
    <StudentDashboardLayout>
      <SettingsPage />
    </StudentDashboardLayout>
  );
}
