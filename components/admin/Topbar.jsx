"use client";

import { useEffect, useState, useRef } from 'react';
import { Search, Bell, HelpCircle, ChevronDown, Edit3 } from "lucide-react";
import EditProfileModal from './EditProfileModal';

export default function Topbar() {
  const [greeting, setGreeting] = useState('Welcome');
  const [admin, setAdmin] = useState({
    name: "Loading...",
    email: "",
    initials: "AD"
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Try loading from localStorage first for immediate display
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setAdmin(prev => ({
        ...prev,
        name: storedName,
        initials: storedName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      }));
    }

    // Fetch Admin Data
    const fetchAdminData = async () => {
      try {
        const res = await fetch('/api/admin/profile');
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data) {
            const s = result.data;
            setAdmin({
              name: s.name,
              email: s.email,
              initials: s.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
            });
            localStorage.setItem('userName', s.name);
          }
        }
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      }
    };

    fetchAdminData();
  }, []);

  // Handle clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileUpdate = (updatedData) => {
    setAdmin({
      name: updatedData.name,
      email: updatedData.email,
      initials: updatedData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    });
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-slate-200/60">
      <div className="flex items-center justify-between px-8 h-16">
        {/* Left Section / Search */}
        <div className="flex items-center gap-6 w-full max-w-md">
          <h2 className="text-xl font-bold tracking-tight text-slate-800 animate-fadeIn whitespace-nowrap hidden md:block">
            {greeting}, <span className="text-primary-900">{admin.name.split(' ')[0]}</span> 👋
          </h2>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports, students..."
              className="w-full bg-slate-50/80 border border-slate-200/80 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-900/15 focus:border-primary-900/30 focus:bg-white transition-all duration-200"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <button className="relative p-2 rounded-lg hover:bg-slate-100/80 transition-colors group">
            <Bell className="w-[18px] h-[18px] text-slate-500 group-hover:text-slate-700 transition-colors" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Help */}
          <button className="p-2 rounded-lg hover:bg-slate-100/80 transition-colors group">
            <HelpCircle className="w-[18px] h-[18px] text-slate-500 group-hover:text-slate-700 transition-colors" />
          </button>

          {/* Divider */}
          <div className="w-px h-7 bg-slate-200 mx-1.5" />

          {/* User Profile */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 pl-1 pr-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-900 to-primary-600 flex items-center justify-center text-white font-bold text-xs shadow-sm uppercase">
                {admin.initials}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[13px] font-semibold text-slate-800 leading-tight group-hover:text-primary-900 transition-colors">
                  {admin.name}
                </p>
                <p className="text-[10px] text-slate-400 font-medium truncate max-w-[120px] uppercase tracking-wider">
                  Admin
                </p>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 hidden sm:block transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 animate-fadeIn">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-900 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditProfileModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleProfileUpdate}
        initialData={admin}
      />
    </header>
  );
}
