"use client";

import { useEffect, useState } from 'react';

export default function Topbar() {
  const [greeting, setGreeting] = useState('Welcome');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <header className="h-[80px] bg-background/60 backdrop-blur-xl border-b border-border flex items-center justify-between px-8 sticky top-0 z-10 font-sans">
      <div className="flex-1">
        <h2 className="text-xl font-bold text-textDark tracking-tight animate-fadeIn">{greeting}, <span className="text-primary">Admin</span> 👋</h2>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 bg-surface/80 glass-card px-2 py-1.5 rounded-2xl border border-border shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 group">
          <div className="w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-white transition-colors duration-300 flex items-center justify-center text-primary font-bold text-sm">
            DS
          </div>
          <div className="hidden md:flex flex-col pr-4">
            <span className="text-sm font-semibold text-textDark leading-tight tracking-tight group-hover:text-primary transition-colors">Dr. Sterling</span>
            <span className="text-[10px] text-textMuted uppercase tracking-widest mt-0.5 font-bold">Admin</span>
          </div>
        </div>
        
        <div className="w-px h-8 bg-border border-l border-dashed"></div>
        
        <button className="text-sm font-bold text-textMuted hover:text-red-600 border border-transparent hover:border-red-200 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-all flex items-center gap-2">
          Logout
        </button>
      </div>
    </header>
  );
}
