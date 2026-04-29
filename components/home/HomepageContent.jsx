"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Departments from "@/components/home/Departments";
import DashboardPreview from "@/components/home/DashboardPreview";
import CTA from "@/components/home/CTA";

const FALLBACK_SUMMARY = {
  overallGpa: 3.42,
  totalStudents: 1450,
  activeCourses: 85,
  firstClassEligible: 128,
  atRisk: 34,
  topPerformers: [
    { name: "S. M. Perera", gpa: 3.98 },
    { name: "H. A. Fernando", gpa: 3.95 },
    { name: "K. D. Silva", gpa: 3.91 },
  ],
  departmentStats: [],
  gpaDistribution: {
    below2: 5,
    between2And24: 12,
    between25And29: 30,
    between30And34: 45,
    above35: 35,
  },
};

export default function HomepageContent() {
  const [summary, setSummary] = useState(FALLBACK_SUMMARY);

  useEffect(() => {
    let cancelled = false;

    async function loadSummary() {
      try {
        const res = await fetch("/api/home/summary", { cache: "no-store" });
        const payload = await res.json().catch(() => null);

        if (res.ok && payload?.success) {
          if (!cancelled) {
            // Only overwrite if the database actually has student records, otherwise keep using mock data
            if (payload.data?.totalStudents > 0) {
              setSummary({ ...FALLBACK_SUMMARY, ...payload.data });
            }
          }
        }
      } catch (err) {
        console.warn("Using fallback academic data, unable to connect to live DB.");
      }
    }

    loadSummary();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Hero summary={summary} />
      <Features />
      <Departments departmentStats={summary.departmentStats} />
      <DashboardPreview summary={summary} />
      <CTA />
    </>
  );
}
