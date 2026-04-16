import StudentDashboardLayout from "@/components/Student/StudentDashboardLayout";
import NotificationsPage from "@/components/Student/NotificationsPage";

export const metadata = {
  title: "Notifications — SUSL MeritMatrix",
  description: "View your academic notifications and announcements.",
};

export default function NotificationsRoute() {
  return (
    <StudentDashboardLayout>
      <NotificationsPage />
    </StudentDashboardLayout>
  );
}
