"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Search, Menu, Sun, Moon, Bell } from "lucide-react";

export default function Topbar({ onMenuClick, darkMode, toggleDarkMode }) {
  const { data: session } = useSession();
  const [greeting, setGreeting] = useState('Welcome');

  const userName = session?.user?.username || "Admin";
  const userRole = session?.user?.role || "SUPER_ADMIN";
  const initials = userName.substring(0, 2).toUpperCase();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60">
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        {/* Left Section */}
        <div className="flex items-center gap-4 lg:gap-6 flex-1">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 lg:hidden text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100 whitespace-nowrap hidden md:block">
            {greeting}, <span className="text-rose-600 dark:text-rose-400">{userName}</span> 👋
          </h2>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-all"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
          </button>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-all">
            <Bell className="w-[18px] h-[18px]" />
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {/* Separator */}
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-1 pr-2 py-1.5 rounded-xl">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-rose-500/25 uppercase">
              {initials}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                {userName}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[120px] uppercase tracking-wider">
                {userRole.replace("_", " ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
