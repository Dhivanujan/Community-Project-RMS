"use client";

import { useEffect, useMemo, useState } from "react";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Departments from "@/components/home/Departments";
import DashboardPreview from "@/components/home/DashboardPreview";
import CTA from "@/components/home/CTA";

const FALLBACK_SUMMARY = {
  overallGpa: 0,
  totalStudents: 0,
  activeCourses: 0,
  firstClassEligible: 0,
  atRisk: 0,
  topPerformers: [],
  departmentStats: [],
  gpaDistribution: {
    below2: 0,
    between2And24: 0,
    between25And29: 0,
    between30And34: 0,
    above35: 0,
  },
};

function Banner({ type, message }) {
  const styles =
    type === "loading"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className={`border rounded-lg px-4 py-2 text-sm font-medium ${styles}`}>
        {message}
      </div>
    </div>
  );
}

export default function HomepageContent() {
  const [summary, setSummary] = useState(FALLBACK_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSummary() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/home/summary", { cache: "no-store" });
        const payload = await res.json().catch(() => null);

        if (!res.ok || !payload?.success) {
          throw new Error(payload?.message || "Unable to load live academic data.");
        }

        if (!cancelled) {
          setSummary({ ...FALLBACK_SUMMARY, ...payload.data });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Database is currently unreachable.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSummary();

    return () => {
      cancelled = true;
    };
  }, []);

  const banner = useMemo(() => {
    if (loading) {
      return <Banner type="loading" message="Loading live academic data..." />;
    }

    if (error) {
      return (
        <Banner
          type="error"
          message="Live data is unavailable right now. Showing default homepage data."
        />
      );
    }

    return null;
  }, [loading, error]);

  return (
    <>
      {banner}
      <Hero summary={summary} />
      <Features />
      <Departments departmentStats={summary.departmentStats} />
      <DashboardPreview summary={summary} />
      <CTA />
    </>
  );
}
