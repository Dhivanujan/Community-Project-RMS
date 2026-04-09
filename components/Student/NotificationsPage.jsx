"use client";

import { useState } from "react";
import {
  CheckCircle,
  Calculator,
  Mail,
  AlertCircle,
  Star,
  Info,
  Bell,
  CheckCheck,
} from "lucide-react";

const allNotifications = [
  {
    id: 1,
    icon: CheckCircle,
    iconBg: "bg-[#3856c4]/10",
    iconColor: "text-[#3856c4]",
    title: "CS102 Results Published",
    description:
      "Introduction to Algorithms final grades are now available in your results portal.",
    time: "2 hours ago",
    category: "Results",
    read: false,
  },
  {
    id: 2,
    icon: Calculator,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    title: "GPA Calculation Updated",
    description:
      "Semester 1 summary has been refreshed with new transfer credits.",
    time: "Yesterday",
    category: "Academic",
    read: false,
  },
  {
    id: 3,
    icon: Mail,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    title: "Dean's List Nomination",
    description:
      "Congratulations! You have been nominated for the Faculty Excellence Award.",
    time: "Oct 12, 2023",
    category: "Academic",
    read: true,
  },
  {
    id: 4,
    icon: AlertCircle,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
    title: "Registration Deadline Approaching",
    description:
      "Spring 2025 course registration closes on November 15, 2024. Complete your enrollment.",
    time: "Oct 10, 2023",
    category: "General",
    read: true,
  },
  {
    id: 5,
    icon: Star,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    title: "CS204 Results Published",
    description:
      "Database Management final grades have been released. Check your results now.",
    time: "Oct 8, 2023",
    category: "Results",
    read: true,
  },
  {
    id: 6,
    icon: Info,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-500",
    title: "System Maintenance Notice",
    description:
      "The results portal will undergo scheduled maintenance on October 20, 2023 from 2:00 AM to 6:00 AM.",
    time: "Oct 5, 2023",
    category: "General",
    read: true,
  },
  {
    id: 7,
    icon: CheckCircle,
    iconBg: "bg-[#3856c4]/10",
    iconColor: "text-[#3856c4]",
    title: "MT100 Results Published",
    description:
      "Calculus I final grades are available. You scored an A- in this subject.",
    time: "Sep 25, 2023",
    category: "Results",
    read: true,
  },
];

const tabs = ["All", "Results", "Academic", "General"];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [notifications, setNotifications] = useState(allNotifications);

  const filtered =
    activeTab === "All"
      ? notifications
      : notifications.filter((n) => n.category === activeTab);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="bg-[#3856c4] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-slate-500 text-[15px] mt-1">
            Stay updated with your academic activities and announcements.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-white border border-slate-100 rounded-xl p-1.5 w-fit shadow-sm">
        {tabs.map((tab) => {
          const count =
            tab === "All"
              ? notifications.length
              : notifications.filter((n) => n.category === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? "bg-[#3856c4] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              {tab}
              <span
                className={`ml-1.5 text-xs ${
                  activeTab === tab ? "text-white/70" : "text-slate-400"
                }`}
              >
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 p-12 text-center shadow-sm">
            <Bell className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-400">
              No notifications
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              You&apos;re all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          filtered.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                onClick={() => toggleRead(notification.id)}
                className={`flex gap-4 p-5 rounded-xl border transition-all duration-200 cursor-pointer group ${
                  notification.read
                    ? "bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm"
                    : "bg-[#3856c4]/[0.02] border-[#3856c4]/20 hover:border-[#3856c4]/30 shadow-sm"
                }`}
              >
                {/* Unread indicator */}
                <div className="flex items-start gap-3 pt-0.5">
                  {!notification.read && (
                    <div className="w-2 h-2 bg-[#3856c4] rounded-full mt-2 flex-shrink-0"></div>
                  )}
                  <div
                    className={`w-10 h-10 rounded-xl ${notification.iconBg} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon
                      className={`w-5 h-5 ${notification.iconColor}`}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4
                        className={`text-sm font-bold group-hover:text-[#3856c4] transition-colors ${
                          notification.read
                            ? "text-slate-700"
                            : "text-slate-900"
                        }`}
                      >
                        {notification.title}
                      </h4>
                      <p className="text-[13px] text-slate-500 mt-1 leading-relaxed">
                        {notification.description}
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap mt-0.5">
                      {notification.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                      {notification.category}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
