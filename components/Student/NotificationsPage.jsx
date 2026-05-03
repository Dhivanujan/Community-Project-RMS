"use client";

import { useState, useEffect } from "react";
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

// Helper function to pick an icon based on category or type
const getIconForCategory = (category) => {
  switch (category?.toLowerCase()) {
    case 'results': return Star;
    case 'academic': return Calculator;
    case 'general': return Info;
    default: return Bell;
  }
};

const getIconColorForCategory = (category) => {
  switch (category?.toLowerCase()) {
    case 'results': return { bg: "bg-[#d4a843]/10", text: "text-[#b8912e]" };
    case 'academic': return { bg: "bg-emerald-50", text: "text-emerald-600" };
    case 'general': return { bg: "bg-sky-50", text: "text-sky-500" };
    default: return { bg: "bg-slate-50", text: "text-slate-500" };
  }
};

const tabs = ["All", "Results", "Academic", "General"];

const categoryColors = {
  Results: "bg-[#1e3a5f]/[0.06] text-[#1e3a5f] border-[#1e3a5f]/10",
  Academic: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  General: "bg-slate-50 text-slate-600 border-slate-200/60",
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/student/notifications', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setNotifications(result.data.notifications);
        }
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filtered =
    activeTab === "All"
      ? notifications
      : notifications.filter((n) => n.category === activeTab);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    // Optimistic UI update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetch('/api/student/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({
          email: localStorage.getItem('userEmail'), // Passing an identifier just in case
          markAllRead: true 
        })
      });
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const toggleRead = async (id, currentStatus) => {
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !currentStatus } : n))
    );
    try {
      await fetch('/api/student/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({
          email: localStorage.getItem('userEmail'),
          notificationId: id,
          read: !currentStatus
        })
      });
    } catch (error) {
      console.error("Failed to toggle read status", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="bg-[#1e3a5f] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Stay updated with your academic activities and announcements.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-1.5 bg-white border border-slate-200/80 text-slate-600 text-xs font-semibold px-3.5 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-white border border-slate-200/60 rounded-lg p-1 w-fit shadow-sm">
        {tabs.map((tab) => {
          const count =
            tab === "All"
              ? notifications.length
              : notifications.filter((n) => n.category === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? "bg-[#1e3a5f] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              {tab}
              <span
                className={`ml-1 text-[10px] ${
                  activeTab === tab ? "text-white/60" : "text-slate-400"
                }`}
              >
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200/60 p-12 text-center shadow-sm">
            <h3 className="text-base font-bold text-slate-400">Loading notifications...</h3>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200/60 p-12 text-center shadow-sm">
            <Bell className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-400">
              No notifications
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              You&apos;re all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          filtered.map((notification) => {
            const Icon = getIconForCategory(notification.category);
            const iconColors = getIconColorForCategory(notification.category);
            const catColor = categoryColors[notification.category] || categoryColors["General"];
            
            // Format time simply
            const notifDate = new Date(notification.createdAt);
            const timeStr = notifDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            return (
              <div
                key={notification.id}
                onClick={() => toggleRead(notification.id, notification.read)}
                className={`flex gap-3.5 p-4 rounded-xl border transition-all duration-200 cursor-pointer group ${
                  notification.read
                    ? "bg-white border-slate-200/60 hover:border-slate-200 hover:shadow-sm"
                    : "bg-[#1e3a5f]/[0.015] border-[#1e3a5f]/15 hover:border-[#1e3a5f]/25 shadow-sm"
                }`}
              >
                {/* Icon with unread dot */}
                <div className="flex items-start gap-2 pt-0.5">
                  {!notification.read && (
                    <div className="w-2 h-2 bg-[#1e3a5f] rounded-full mt-2.5 flex-shrink-0" />
                  )}
                  <div
                    className={`w-9 h-9 rounded-lg ${iconColors.bg} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon
                      className={`w-4 h-4 ${iconColors.text}`}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4
                        className={`text-[13px] font-semibold group-hover:text-[#1e3a5f] transition-colors ${
                          notification.read
                            ? "text-slate-600"
                            : "text-slate-800"
                        }`}
                      >
                        {notification.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {notification.description}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap mt-0.5">
                      {timeStr}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${catColor}`}>
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
