"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Star,
  BarChart3,
  Bell,
  Settings,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/student/dashboard" },
  { name: "Results", icon: Star, path: "/student/results" },
  { name: "GPA Summary", icon: BarChart3, path: "/student/gpa-summary" },
  { name: "Notifications", icon: Bell, path: "/student/notifications" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-[#f8fafc] flex flex-col z-30 border-r border-slate-100">
      {/* Branding */}
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-[17px] font-bold text-[#3856c4] italic leading-tight">
          Faculty of Computing
        </h1>
        <p className="text-[11px] text-slate-400 mt-0.5 font-medium tracking-wide">
          Results Management
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-white text-[#3856c4] font-semibold shadow-sm border border-slate-100"
                    : "text-slate-500 hover:text-[#3856c4] hover:bg-white/60"
                }
              `}
            >
              <Icon
                className={`w-[18px] h-[18px] ${
                  isActive ? "text-[#3856c4]" : "text-slate-400"
                }`}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="px-4 pb-8">
        <Link
          href="/student/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:text-[#3856c4] hover:bg-white/60 transition-all duration-200"
        >
          <Settings className="w-[18px] h-[18px] text-slate-400" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
