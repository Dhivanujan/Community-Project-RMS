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
    <div className="space-y-8 max-w-3xl">
      {/* Page Header */}
      <div>
        <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">
          Settings
        </h1>
        <p className="text-slate-500 text-[15px] mt-1">
          Manage your account preferences and profile settings.
        </p>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#3856c4]" />
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Profile Information
            </h3>
          </div>
        </div>
        <div className="p-6">
          {/* Avatar + Name */}
          <div className="flex items-center gap-5 mb-6 pb-6 border-b border-slate-50">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3856c4] to-[#6882e0] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[#3856c4]/20">
              AT
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-800">
                Alex Thompson
              </h4>
              <p className="text-sm text-slate-400 font-medium">
                Student • Faculty of Computing
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Full Name
              </label>
              <p className="text-sm font-semibold text-slate-700 mt-1 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                Alex Thompson
              </p>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Student ID
              </label>
              <p className="text-sm font-semibold text-slate-700 mt-1 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                CS-2024-089
              </p>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Email Address
              </label>
              <p className="text-sm font-semibold text-slate-700 mt-1 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                alex.thompson@foc.sab.ac.lk
              </p>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Department
              </label>
              <p className="text-sm font-semibold text-slate-700 mt-1 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                Computer Science
              </p>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Batch
              </label>
              <p className="text-sm font-semibold text-slate-700 mt-1 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                2022/2023
              </p>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Academic Year
              </label>
              <p className="text-sm font-semibold text-slate-700 mt-1 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                3rd Year
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#3856c4]" />
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Change Password
            </h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Current Password
            </label>
            <div className="relative mt-1">
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter current password"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 pr-11 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3856c4]/20 focus:border-[#3856c4]/40 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                New Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 pr-11 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3856c4]/20 focus:border-[#3856c4]/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3856c4]/20 focus:border-[#3856c4]/40 transition-all"
              />
            </div>
          </div>

          <button className="bg-[#3856c4] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#2d47a8] transition-colors shadow-sm shadow-[#3856c4]/20 mt-2">
            Update Password
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#3856c4]" />
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Notification Preferences
            </h3>
          </div>
        </div>
        <div className="p-6 space-y-1">
          {/* Toggle Items */}
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
                className="flex items-center justify-between py-4 px-2 rounded-lg hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700">
                      {item.label}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
                {/* Toggle */}
                <button
                  onClick={() => item.setState(!item.state)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
                    item.state ? "bg-[#3856c4]" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      item.state ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#3856c4]" />
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Appearance
            </h3>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-500 mb-4">
            Choose your preferred theme for the dashboard.
          </p>
          <div className="flex gap-4">
            {[
              { name: "Light", bg: "bg-white", border: "border-[#3856c4]", active: true },
              { name: "Dark", bg: "bg-slate-800", border: "border-slate-200", active: false },
              { name: "System", bg: "bg-gradient-to-br from-white to-slate-800", border: "border-slate-200", active: false },
            ].map((theme) => (
              <button
                key={theme.name}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                  theme.active
                    ? `${theme.border} bg-[#3856c4]/5`
                    : `${theme.border} hover:border-slate-300`
                }`}
              >
                <div
                  className={`w-16 h-12 ${theme.bg} rounded-lg border border-slate-200 shadow-inner`}
                ></div>
                <span
                  className={`text-xs font-semibold ${
                    theme.active ? "text-[#3856c4]" : "text-slate-500"
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
