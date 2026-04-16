"use client";

import { useState } from "react";
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
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [resultAlerts, setResultAlerts] = useState(true);
  const [academicUpdates, setAcademicUpdates] = useState(true);
  const [generalNews, setGeneralNews] = useState(false);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your account preferences and profile settings.
        </p>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#1e3a5f]/[0.07] flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-[#1e3a5f]" />
            </div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-[0.1em]">
              Profile Information
            </h3>
          </div>
        </div>
        <div className="p-5">
          {/* Avatar + Name */}
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100/60">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8e] flex items-center justify-center text-white font-bold text-lg shadow-md shadow-[#1e3a5f]/15">
              AT
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-800">
                Alex Thompson
              </h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <GraduationCap className="w-3 h-3 text-slate-400" />
                <p className="text-xs text-slate-400 font-medium">
                  Student • Faculty of Computing
                </p>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Full Name", value: "Alex Thompson" },
              { label: "Student ID", value: "CS-2024-089" },
              { label: "Email Address", value: "alex.thompson@foc.sab.ac.lk" },
              { label: "Department", value: "Computer Science" },
              { label: "Batch", value: "2022/2023" },
              { label: "Academic Year", value: "3rd Year" },
            ].map((field) => (
              <div key={field.label}>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em]">
                  {field.label}
                </label>
                <p className="text-[13px] font-semibold text-slate-700 mt-1 bg-slate-50/80 px-3.5 py-2.5 rounded-lg border border-slate-100/80">
                  {field.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#1e3a5f]/[0.07] flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 text-[#1e3a5f]" />
            </div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-[0.1em]">
              Change Password
            </h3>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em]">
              Current Password
            </label>
            <div className="relative mt-1">
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter current password"
                className="w-full bg-slate-50/80 border border-slate-200/80 rounded-lg py-2.5 px-3.5 pr-10 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/15 focus:border-[#1e3a5f]/30 focus:bg-white transition-all"
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
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em]">
                New Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="w-full bg-slate-50/80 border border-slate-200/80 rounded-lg py-2.5 px-3.5 pr-10 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/15 focus:border-[#1e3a5f]/30 focus:bg-white transition-all"
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
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em]">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full mt-1 bg-slate-50/80 border border-slate-200/80 rounded-lg py-2.5 px-3.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/15 focus:border-[#1e3a5f]/30 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button className="bg-[#1e3a5f] text-white text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-[#163050] transition-colors shadow-sm shadow-[#1e3a5f]/15 mt-1">
            Update Password
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#1e3a5f]/[0.07] flex items-center justify-center">
              <Bell className="w-3.5 h-3.5 text-[#1e3a5f]" />
            </div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-[0.1em]">
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
                className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <Icon className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <h4 className="text-[13px] font-semibold text-slate-700">
                      {item.label}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
                {/* Toggle */}
                <button
                  onClick={() => item.setState(!item.state)}
                  className={`relative w-10 h-[22px] rounded-full transition-colors duration-200 flex-shrink-0 ${
                    item.state ? "bg-[#1e3a5f]" : "bg-slate-200"
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
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#1e3a5f]/[0.07] flex items-center justify-center">
              <Palette className="w-3.5 h-3.5 text-[#1e3a5f]" />
            </div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-[0.1em]">
              Appearance
            </h3>
          </div>
        </div>
        <div className="p-5">
          <p className="text-xs text-slate-400 mb-4">
            Choose your preferred theme for the dashboard.
          </p>
          <div className="flex gap-3">
            {[
              { name: "Light", bg: "bg-white", active: true },
              { name: "Dark", bg: "bg-slate-800", active: false },
              { name: "System", bg: "bg-gradient-to-br from-white to-slate-800", active: false },
            ].map((theme) => (
              <button
                key={theme.name}
                className={`flex flex-col items-center gap-2 p-3.5 rounded-lg border-2 transition-all duration-200 ${
                  theme.active
                    ? "border-[#1e3a5f] bg-[#1e3a5f]/[0.03]"
                    : "border-slate-200/60 hover:border-slate-300"
                }`}
              >
                <div
                  className={`w-14 h-10 ${theme.bg} rounded-md border border-slate-200 shadow-inner`}
                />
                <span
                  className={`text-[11px] font-semibold ${
                    theme.active ? "text-[#1e3a5f]" : "text-slate-500"
                  }`}
                >
                  {theme.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
