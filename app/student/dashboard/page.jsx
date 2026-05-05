
'use client';

import { useState, useEffect } from 'react';
import StudentDashboardLayout from "@/components/Student/StudentDashboardLayout";
import StatsCards from "@/components/Student/StatsCards";
import RecentUpdates from "@/components/Student/RecentUpdates";
import SemesterTable from "@/components/Student/SemesterTable";

export default function DashboardPage() {
  const [userName, setUserName] = useState('Student');
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
          setUserName(storedName);
        }

        const response = await fetch('/api/student/dashboard', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          },
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
             setDashboardData(result.data);
             if (result.data.student?.name) {
                 setUserName(result.data.student.name);
             }
          } else {
             setError(result.message || 'Failed to load dashboard.');
          }
        } else {
          setError('Authentication failed. Please login again.');
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setError('Error loading dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <StudentDashboardLayout>
      <section className="mb-7">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {isLoading ? '...' : userName}
          </h1>
          <span className="text-xl">👋</span>
        </div>
        <p className="text-slate-400 text-sm">
          Here is the latest snapshot of your academic performance.
        </p>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </section>

      <section className="mb-8">
        <StatsCards data={dashboardData?.cards || null} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentUpdates updates={dashboardData?.recentUpdates || []} />
        <SemesterTable currentSemester={dashboardData?.currentSemester || null} />
      </section>
    </StudentDashboardLayout>
  );
}
