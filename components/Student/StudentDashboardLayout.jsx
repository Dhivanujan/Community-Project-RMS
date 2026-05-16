"use client";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function StudentDashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
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
