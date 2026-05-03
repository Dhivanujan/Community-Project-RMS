'use client';

import { useState, useEffect } from 'react';
import StudentDashboardLayout from "@/components/Student/StudentDashboardLayout";
import StatsCards from "@/components/Student/StatsCards";
import RecentUpdates from "@/components/Student/RecentUpdates";
import SemesterTable from "@/components/Student/SemesterTable";

export default function DashboardPage() {
  const [userName, setUserName] = useState('Student');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch logged-in user's name from localStorage or API
    const fetchUserName = async () => {
      try {
        // Try to get from localStorage first (set during login)
        const storedName = localStorage.getItem('userName');
        if (storedName) {
          setUserName(storedName);
          setIsLoading(false);
          return;
        }

        // Or fetch from user profile API
        const response = await fetch('/api/student/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserName(data.firstName || 'Student');
        }
      } catch (error) {
        console.error('Failed to fetch user name:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserName();
  }, []);

  return (
    <StudentDashboardLayout>
      {/* Welcome Section */}
      <section className="mb-7">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {isLoading ? '...' : userName}
          </h1>
          <span className="text-xl">👋</span>
        </div>
        <p className="text-slate-400 text-sm">
          Here&apos;s the latest snapshot of your academic performance.
        </p>
      </section>

      {/* Stats Cards */}
      <section className="mb-8">
        <StatsCards />
      </section>

      {/* Bottom Section: Recent Updates + Semester Table */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentUpdates />
        <SemesterTable />
      </section>
    </StudentDashboardLayout>
  );
}