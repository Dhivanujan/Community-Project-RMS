"use client";

import { useEffect, useState, useRef } from 'react';
import { Search, Bell, HelpCircle, ChevronDown, Edit3, Menu, CheckCircle2, AlertCircle } from "lucide-react";
import EditProfileModal from './EditProfileModal';
import HelpModal from './HelpModal';

export default function Topbar({ onMenuClick }) {
  const [greeting, setGreeting] = useState('Welcome');
  const [admin, setAdmin] = useState({
    name: "Loading...",
    email: "",
    initials: "AD"
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  const mockNotifications = [
    { id: 1, type: 'success', title: 'Results Published', message: 'Software Engineering Batch 21 results are now live.', time: '2 mins ago' },
    { id: 2, type: 'alert', title: 'System Maintenance', message: 'Scheduled maintenance this Sunday at 2 AM.', time: '5 hours ago' },
    { id: 3, type: 'info', title: 'New Registration', message: '5 new students registered in CS department.', time: '1 day ago' },
  ];

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

  // Handle clicking outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (hasUnread) setHasUnread(false);
  };

  const handleProfileUpdate = (updatedData) => {
    setAdmin({
      name: updatedData.name,
      email: updatedData.email,
      initials: updatedData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    });
  };

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
          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={handleNotificationClick}
              className="relative p-2 rounded-lg hover:bg-slate-100/80 transition-colors group"
            >
              <Bell className={`w-[18px] h-[18px] transition-colors ${isNotificationsOpen ? 'text-primary-900' : 'text-slate-500 group-hover:text-slate-700'}`} />
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 py-2 z-50 animate-fadeInUp">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                  <span className="text-xs font-semibold text-primary-900 bg-primary-50 px-2 py-0.5 rounded-full">
                    {mockNotifications.length} New
                  </span>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto">
                  {mockNotifications.map((notif) => (
                    <div key={notif.id} className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0 flex items-start gap-3">
                      <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 
                        notif.type === 'alert' ? 'bg-rose-100 text-rose-600' : 
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {notif.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 leading-tight">{notif.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-snug">{notif.message}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wide">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="px-4 py-2 border-t border-slate-100 text-center">
                  <button className="text-xs font-bold text-primary-900 hover:text-primary-700 transition-colors">
                    View All Activity
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Help */}
          <button 
            onClick={() => setIsHelpOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100/80 transition-colors group"
          >
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

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <EditProfileModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleProfileUpdate}
        initialData={admin}
      />
    </header>
  );
}
