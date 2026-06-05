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
  Loader2,
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
    case 'results': return { bg: "bg-[#d4a843]/10 dark:bg-[#d4a843]/20", text: "text-[#b8912e] dark:text-[#d4a843]" };
    case 'academic': return { bg: "bg-emerald-50 dark:bg-emerald-950/20", text: "text-emerald-600 dark:text-emerald-400" };
    case 'general': return { bg: "bg-sky-50 dark:bg-sky-950/20", text: "text-sky-500 dark:text-sky-400" };
    default: return { bg: "bg-slate-50 dark:bg-slate-800/50", text: "text-slate-500 dark:text-slate-400" };
  }
};

const tabs = ["All", "Results", "Academic", "General"];

const categoryColors = {
  Results: "bg-primary-900/[0.06] dark:bg-blue-900/20 text-primary-900 dark:text-blue-400 border-primary-900/10 dark:border-blue-900/30",
  Academic: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/30",
  General: "bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/60",
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/student/notifications', window.location.origin);
      if (activeTab !== "All") {
        url.searchParams.append('category', activeTab);
      }
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': 'Bearer ' + (localStorage.getItem('token') || ''),
        },
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setNotifications(result.data.notifications || []);
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
  }, [activeTab]);

  const handleMarkAsRead = async (id) => {
    try {
      const response = await fetch('/api/student/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + (localStorage.getItem('token') || ''),
        },
        body: JSON.stringify({
          notificationId: id,
          read: true
        })
      });
      if (response.ok) {
        setNotifications(prev =>
          prev.map(item => (item.id === id ? { ...item, read: true } : item))
        );
        // Dispatch custom event to notify Sidebar unread count
        window.dispatchEvent(new Event('notificationsUpdated'));
      }
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const response = await fetch('/api/student/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + (localStorage.getItem('token') || ''),
        },
        body: JSON.stringify({
          markAllRead: true
        })
      });
      if (response.ok) {
        setNotifications(prev => prev.map(item => ({ ...item, read: true })));
        // Dispatch custom event to notify Sidebar unread count
        window.dispatchEvent(new Event('notificationsUpdated'));
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Notifications
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
            Stay updated with your results and academic announcements.
          </p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-900 dark:text-blue-400 hover:text-primary-705 dark:hover:text-blue-300 transition-colors uppercase tracking-wider bg-primary-900/[0.04] dark:bg-blue-900/10 px-3 py-1.5 rounded-lg border border-primary-900/10 dark:border-blue-900/20"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          Mark all as read
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200/60 dark:border-slate-800 gap-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-semibold transition-all relative uppercase tracking-wider text-[11px] ${
              activeTab === tab
                ? "text-primary-900 dark:text-blue-400 font-bold"
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary-900 dark:bg-blue-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-sm transition-colors duration-200">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary-900 dark:text-blue-500 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-700">
              <Bell className="w-5 h-5 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">All caught up!</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              You have no {activeTab !== "All" ? activeTab.toLowerCase() : ""} notifications.
            </p>
          </div>
        ) : (
          notifications.map((notification, i) => {
            const Icon = getIconForCategory(notification.category);
            const iconColors = getIconColorForCategory(notification.category);
            const catColor = categoryColors[notification.category] || categoryColors.General;

            const timeStr = notification.createdAt
              ? new Date(notification.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : "Recently";

            return (
              <div
                key={notification.id}
                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                className={`p-5 flex gap-4 transition-all duration-200 border-b border-slate-100 dark:border-slate-800 last:border-b-0 hover:bg-slate-50/60 dark:hover:bg-slate-850/40 cursor-pointer group ${
                  !notification.read ? "bg-primary-900/[0.01] dark:bg-blue-900/[0.02]" : ""
                }`}
              >
                {/* Action indicator on hover */}
                {!notification.read && (
                  <div className="flex items-center justify-center shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                      className="text-slate-300 dark:text-slate-700 hover:text-emerald-500 dark:hover:text-emerald-450 transition-colors bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border border-slate-200/80 dark:border-slate-700 p-1.5 rounded-lg shadow-sm"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Icon */}
                <div className="shrink-0">
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
                        className={`text-[13px] font-semibold group-hover:text-primary-900 dark:group-hover:text-blue-450 transition-colors ${
                          notification.read
                            ? "text-slate-600 dark:text-slate-400"
                            : "text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        {notification.title}
                      </h4>
                      <p className="text-xs text-slate-400 dark:text-slate-550 mt-1 leading-relaxed">
                        {notification.description}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap mt-0.5">
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
