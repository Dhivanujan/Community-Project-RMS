"use client";

import { Search, Bell, HelpCircle } from "lucide-react";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="flex items-center justify-between px-8 h-[72px]">
        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search for subjects or reports..."
            className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3856c4]/20 focus:border-[#3856c4]/40 transition-all"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <button className="relative p-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
            <Bell className="w-5 h-5 text-slate-500 group-hover:text-slate-700 transition-colors" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* Help */}
          <button className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
            <HelpCircle className="w-5 h-5 text-slate-500 group-hover:text-slate-700 transition-colors" />
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-slate-200 mx-1"></div>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-1">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 leading-tight">
                Alex Thompson
              </p>
              <p className="text-[11px] text-slate-400 font-medium">
                CS-2024-089
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3856c4] to-[#6882e0] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#3856c4]/20">
              AT
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
