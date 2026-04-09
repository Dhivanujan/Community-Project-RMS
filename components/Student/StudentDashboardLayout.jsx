"use client";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function StudentDashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64">
        <Topbar />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
