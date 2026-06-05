"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  User,
  Lock,
  Bell,
  Palette,
  Mail,
  Shield,
  Smartphone,
  Eye,
  EyeOff,
  GraduationCap,
} from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [student, setStudent] = useState({
    name: "Loading...",
    rollNumber: "...",
    email: "...",
    department: "...",
    enrollmentYear: "...",
    initials: "??"
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!session?.user?.email) return;
      try {
        const response = await fetch(`/api/student/dashboard?email=${session.user.email}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data?.student) {
            const s = result.data.student;
            setStudent({
              name: s.name || "N/A",
              rollNumber: s.rollNumber || "N/A",
              email: s.email || "N/A",
              department: s.department || "N/A",
              enrollmentYear: s.enrollmentYear || "N/A",
              initials: (s.name || "ST").split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data for settings", error);
      }
    };
    
    if (session?.user) {
      fetchStudentData();
    }
  }, [session]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPasswordValue, setNewPasswordValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState({ type: "", message: "" });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handlePasswordChange = async () => {
    setPasswordStatus({ type: "", message: "" });
    if (!currentPassword || !newPasswordValue || !confirmPassword) {
      setPasswordStatus({ type: "error", message: "All fields are required." });
      return;
    }
    if (newPasswordValue !== confirmPassword) {
      setPasswordStatus({ type: "error", message: "New passwords do not match." });
      return;
    }
    if (newPasswordValue.length < 6) {
      setPasswordStatus({ type: "error", message: "Password must be at least 6 characters long." });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const response = await fetch('/api/student/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.user?.email,
          currentPassword,
          newPassword: newPasswordValue
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setPasswordStatus({ type: "success", message: "Password updated successfully." });
        setCurrentPassword("");
        setNewPasswordValue("");
        setConfirmPassword("");
      } else {
        setPasswordStatus({ type: "error", message: data.message || "Failed to update password." });
      }
    } catch (error) {
      setPasswordStatus({ type: "error", message: "An error occurred. Please try again." });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [resultAlerts, setResultAlerts] = useState(true);
  const [academicUpdates, setAcademicUpdates] = useState(true);
  const [generalNews, setGeneralNews] = useState(false);
  const [activeTheme, setActiveTheme] = useState("light");

  useEffect(() => {
    // Initialize theme from localStorage or document
    const savedDark = localStorage.getItem('student-dark-mode');
    const currentTheme = savedDark === 'true' ? 'dark' : 'light';
    setActiveTheme(currentTheme);
    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleThemeChange = (themeName) => {
    const newTheme = themeName.toLowerCase();
    setActiveTheme(newTheme);
    const isDark = newTheme === 'dark';
    localStorage.setItem('student-dark-mode', String(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Dispatch event so layout/topbar can sync
    window.dispatchEvent(new Event('darkModeChanged'));
    
    // Optional: send to backend API
    if (session?.user?.email) {
      fetch('/api/student/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          preferences: { theme: newTheme }
        })
      }).catch(console.error);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Settings
        </h1>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
          Manage your account preferences and profile settings.
        </p>
      </div>

      {/* Profile Information */}
      <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden transition-colors">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary-900/[0.07] dark:bg-primary-900/20 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-primary-900 dark:text-primary-400" />
            </div>
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-[0.1em]">
              Profile Information
            </h3>
          </div>
        </div>
        <div className="p-5">
          {/* Avatar + Name */}
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100/60 dark:border-slate-700/60">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-900 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-[primary-900]/15 uppercase">
              {student.initials}
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-800 dark:text-white">
                {student.name}
              </h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <GraduationCap className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  Student • Faculty of Computing
                </p>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Full Name", value: student.name },
              { label: "Student ID", value: student.rollNumber },
              { label: "Email Address", value: student.email },
              { label: "Department", value: student.department },
              { label: "Enrollment Year", value: student.enrollmentYear },
            ].map((field) => (
              <div key={field.label}>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.12em]">
                  {field.label}
                </label>
                <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-200 mt-1 bg-slate-50/80 dark:bg-slate-800/80 px-3.5 py-2.5 rounded-lg border border-slate-100/80 dark:border-slate-700/80">
                  {field.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden transition-colors">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary-900/[0.07] dark:bg-primary-900/20 flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 text-primary-900 dark:text-primary-400" />
            </div>
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-[0.1em]">
              Change Password
            </h3>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.12em]">
              Current Password
            </label>
            <div className="relative mt-1">
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-lg py-2.5 px-3.5 pr-10 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-900/15 focus:border-primary-900/30 dark:focus:ring-primary-900/40 dark:focus:border-primary-900/50 focus:bg-white dark:focus:bg-[#1e293b] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.12em]">
                New Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPasswordValue}
                  onChange={(e) => setNewPasswordValue(e.target.value)}
                  className="w-full bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-lg py-2.5 px-3.5 pr-10 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-900/15 focus:border-primary-900/30 dark:focus:ring-primary-900/40 dark:focus:border-primary-900/50 focus:bg-white dark:focus:bg-[#1e293b] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.12em]">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-1 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-lg py-2.5 px-3.5 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-900/15 focus:border-primary-900/30 dark:focus:ring-primary-900/40 dark:focus:border-primary-900/50 focus:bg-white dark:focus:bg-[#1e293b] transition-all"
              />
            </div>
          </div>

          {passwordStatus.message && (
            <p className={`text-xs font-medium ${passwordStatus.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
              {passwordStatus.message}
            </p>
          )}

          <button 
            onClick={handlePasswordChange}
            disabled={isUpdatingPassword}
            className="bg-primary-900 text-white text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-[#163050] transition-colors shadow-sm shadow-[primary-900]/15 mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isUpdatingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden transition-colors">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary-900/[0.07] dark:bg-primary-900/20 flex items-center justify-center">
              <Bell className="w-3.5 h-3.5 text-primary-900 dark:text-primary-400" />
            </div>
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-[0.1em]">
              Notification Preferences
            </h3>
          </div>
        </div>
        <div className="p-5 space-y-0.5">
          {[
            {
              icon: Mail,
              label: "Email Notifications",
              desc: "Receive notification emails about your results and updates",
              state: emailNotifications,
              setState: setEmailNotifications,
            },
            {
              icon: Smartphone,
              label: "Push Notifications",
              desc: "Get push notifications on your browser",
              state: pushNotifications,
              setState: setPushNotifications,
            },
            {
              icon: Shield,
              label: "Result Alerts",
              desc: "Get notified when new results are published",
              state: resultAlerts,
              setState: setResultAlerts,
            },
            {
              icon: Bell,
              label: "Academic Updates",
              desc: "GPA changes, dean's list nominations, and academic notices",
              state: academicUpdates,
              setState: setAcademicUpdates,
            },
            {
              icon: Mail,
              label: "General News",
              desc: "System maintenance, registration deadlines, and announcements",
              state: generalNews,
              setState: setGeneralNews,
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5" />
                  <div>
                    <h4 className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                      {item.label}
                    </h4>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
                {/* Toggle */}
                <button
                  onClick={() => item.setState(!item.state)}
                  className={`relative w-10 h-[22px] rounded-full transition-colors duration-200 flex-shrink-0 ${
                    item.state ? "bg-primary-900 dark:bg-primary-700" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-[2px] left-[2px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      item.state ? "translate-x-[18px]" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden transition-colors">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary-900/[0.07] dark:bg-primary-900/20 flex items-center justify-center">
              <Palette className="w-3.5 h-3.5 text-primary-900 dark:text-primary-400" />
            </div>
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-[0.1em]">
              Appearance
            </h3>
          </div>
        </div>
        <div className="p-5">
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
            Choose your preferred theme for the dashboard.
          </p>
          <div className="flex gap-3">
            {[
              { name: "Light", bg: "bg-white", id: "light" },
              { name: "Dark", bg: "bg-slate-800", id: "dark" },
            ].map((theme) => {
              const isActive = activeTheme === theme.id;
              return (
              <button
                key={theme.name}
                onClick={() => handleThemeChange(theme.name)}
                className={`flex flex-col items-center gap-2 p-3.5 rounded-lg border-2 transition-all duration-200 ${
                  isActive
                    ? "border-primary-900 dark:border-primary-500 bg-primary-900/[0.03] dark:bg-primary-900/[0.2]"
                    : "border-slate-200/60 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <div
                  className={`w-14 h-10 ${theme.bg} rounded-md border border-slate-200 dark:border-slate-600 shadow-inner`}
                />
                <span
                  className={`text-[11px] font-semibold ${
                    isActive ? "text-primary-900 dark:text-primary-400" : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {theme.name}
                </span>
              </button>
            )})}
          </div>
        </div>
      </div>
    </div>
  );
}
