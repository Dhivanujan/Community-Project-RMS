"use client";

import { useEffect, useState, useRef } from 'react';
import { Search, Bell, Menu, ChevronDown, CheckCircle2, AlertCircle } from "lucide-react";

export default function Topbar({ onMenuClick }) {
  const [greeting, setGreeting] = useState('Welcome');
  const [admin, setAdmin] = useState({
    name: "System Administrator",
    initials: "SA"
  });
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setAdmin({
        name: storedName,
        initials: storedName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      });
    }
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-slate-200/60">
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        {/* Left Section / Search */}
        <div className="flex items-center gap-4 lg:gap-6 w-full max-w-md">
          <button 
             onClick={onMenuClick}
             className="p-2 -ml-2 lg:hidden text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors"
          >
             <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold tracking-tight text-slate-800 animate-fadeIn whitespace-nowrap hidden md:block">
            {greeting}, <span className="text-rose-600">{admin.name.split(' ')[0]}</span> 👋
          </h2>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs, users..."
              className="w-full bg-slate-50/80 border border-slate-200/80 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/15 focus:border-rose-500/30 focus:bg-white transition-all duration-200"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* User Profile */}
          <div className="relative">
            <div className="flex items-center gap-2.5 pl-1 pr-2 py-1.5 rounded-lg group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-600 to-rose-800 flex items-center justify-center text-white font-bold text-xs shadow-sm uppercase">
                {admin.initials}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[13px] font-semibold text-slate-800 leading-tight">
                  {admin.name}
                </p>
                <p className="text-[10px] text-slate-400 font-medium truncate max-w-[120px] uppercase tracking-wider">
                  Super Admin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
