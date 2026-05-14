import AdminDashboard from "@/app/admin/page";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function StaffDashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user.role !== "STAFF" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/login");
  }

  return <AdminDashboard />;
}
