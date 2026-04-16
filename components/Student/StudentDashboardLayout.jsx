"use client";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function StudentDashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8f9fc] font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64">
        <Topbar />
        <main className="px-8 py-7 max-w-[1400px]">{children}</main>
      </div>
    </div>
  );
}
