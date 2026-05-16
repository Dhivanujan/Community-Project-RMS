"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Search, Bell, HelpCircle, ChevronDown } from "lucide-react";

export default function Topbar() {
  const { data: session, status } = useSession();
  const [student, setStudent] = useState({
    name: "Loading...",
    rollNumber: "...",
    initials: "??"
  });

  useEffect(() => {
    // Fetch accurate data from API
    const fetchStudentData = async () => {
      if (!session?.user?.email && !session?.user?.username) return;
      
      // We pass email to the API to resolve the student
      const queryParam = session?.user?.email ? `email=${session.user.email}` : `rollNumber=${session.user.username}`;
      
      try {
        const response = await fetch(`/api/student/dashboard?${queryParam}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data?.student) {
            const s = result.data.student;
            setStudent({
              name: s.name,
              rollNumber: s.rollNumber || s.email || session.user.username,
              initials: s.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data for topbar", error);
      }
    };

    if (status === 'authenticated') {
      fetchStudentData();
    }
  }, [session, status]);

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 transition-colors duration-200">
      <div className="flex items-center justify-between px-8 h-16">
        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search subjects, results, reports..."
            className="w-full bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-900/15 focus:border-primary-900/30 dark:focus:ring-primary-900/40 dark:focus:border-primary-900/50 focus:bg-white dark:focus:bg-[#1e293b] transition-all duration-200"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <button className="relative p-2 rounded-lg hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors group">
            <Bell className="w-[18px] h-[18px] text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </button>

          {/* Help */}
          <button className="p-2 rounded-lg hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors group">
            <HelpCircle className="w-[18px] h-[18px] text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors" />
          </button>

          {/* Divider */}
          <div className="w-px h-7 bg-slate-200 dark:bg-slate-700 mx-1.5 transition-colors" />

          {/* User Profile */}
          <button className="flex items-center gap-2.5 pl-1 pr-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-900 to-primary-600 flex items-center justify-center text-white font-bold text-xs shadow-sm uppercase">
              {student.initials}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 leading-tight transition-colors">
                {student.name}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[120px] transition-colors">
                {student.rollNumber}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 hidden sm:block transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
}
