"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Star,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  GraduationCap,
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
    <aside className="fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] flex flex-col z-30">
      {/* University Branding */}
      <div className="px-6 pt-7 pb-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4a843] to-[#b8912e] flex items-center justify-center shadow-lg shadow-[#d4a843]/20">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-[14px] font-bold text-white leading-tight tracking-wide">
              SUSL MeritMatrix
            </h1>
            <p className="text-[10px] text-[#d4a843] mt-0.5 font-semibold tracking-widest uppercase">
              Faculty of Computing
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-6 space-y-1">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] px-3 mb-3">
          Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`
                relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-white/[0.08] text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                }
              `}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#d4a843] rounded-r-full" />
              )}
              <Icon
                className={`w-[18px] h-[18px] ${
                  isActive ? "text-[#d4a843]" : "text-slate-500"
                }`}
              />
              <span>{item.name}</span>
              {item.name === "Notifications" && (
                <span className="ml-auto w-5 h-5 rounded-full bg-rose-500/90 text-[10px] font-bold text-white flex items-center justify-center">
                  2
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 pb-4 space-y-1">
        <div className="border-t border-white/[0.06] mb-3" />
        <Link
          href="/student/settings"
          className={`
            relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200
            ${
              pathname === "/student/settings"
                ? "bg-white/[0.08] text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
            }
          `}
        >
          {pathname === "/student/settings" && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#d4a843] rounded-r-full" />
          )}
          <Settings
            className={`w-[18px] h-[18px] ${
              pathname === "/student/settings"
                ? "text-[#d4a843]"
                : "text-slate-500"
            }`}
          />
          <span>Settings</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-500 hover:text-rose-400 hover:bg-rose-500/[0.06] transition-all duration-200">
          <LogOut className="w-[18px] h-[18px]" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
