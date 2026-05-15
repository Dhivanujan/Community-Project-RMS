'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import StudentDashboardLayout from "@/components/Student/StudentDashboardLayout";
import StatsCards from "@/components/Student/StatsCards";
import RecentUpdates from "@/components/Student/RecentUpdates";
import SemesterTable from "@/components/Student/SemesterTable";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    const fetchDashboardData = async () => {
      if (!session?.user) return;
      
      try {
        const response = await fetch(`/api/student/dashboard?email=${session.user.email}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
             setDashboardData(result.data);
          } else {
             setError(result.message || 'Failed to load dashboard.');
          }
        } else {
          setError('Failed to fetch dashboard data.');
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setError('Error loading dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <StudentDashboardLayout>
      <section className="mb-7">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {dashboardData?.student?.name?.split(' ')[0] || session?.user?.username || 'Student'}
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
