"use client";

import { ArrowRight } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";
import Link from "next/link";

const departments = [
  {
    title: "Department of Software Engineering",
    desc: "Focus on software architecture, agile development, and enterprise system design.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    slug: "software-engineering",
  },
  {
    title: "Department of Data Science",
    desc: "Artificial intelligence, machine learning, and data-driven decision systems.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    slug: "data-science",
  },
  {
    title: "Department of Information Systems",
    desc: "Enterprise systems, cybersecurity, and digital infrastructure management.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    slug: "information-systems",
  },
];

export default function Departments({ departmentStats = [] }) {
  const getDeptStats = (deptTitle) => {
    if (!departmentStats || departmentStats.length === 0) return null;
    const normalizedDept = deptTitle.toLowerCase().replace(/department\s+of\s+/g, "").trim();

    return departmentStats.find((stat) => {
      const normalizedStat = stat.title.toLowerCase().replace(/department\s+of\s+/g, "").trim();
      return (
        normalizedDept.includes(normalizedStat) ||
        normalizedStat.includes(normalizedDept) ||
        (normalizedDept === "information systems" && normalizedStat.includes("information system")) ||
        (normalizedDept === "information systems" && normalizedStat.includes("cis"))
      );
    });
  };

  return (
    <section
      id="departments"
      className="py-24 bg-slate-950 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <AnimateOnScroll variant="fadeUp">
          <div className="mb-14">
            <div className="border-l-4 border-blue-500 pl-5">
              <h2 className="text-3xl font-bold text-white">
                Academic Departments
              </h2>
              <p className="text-white/50 mt-3 text-sm max-w-3xl leading-relaxed">
                Core academic units of the Faculty of Computing responsible for
                teaching, research, and student performance evaluation within
                the university results management system.
              </p>
            </div>
          </div>
        </AnimateOnScroll>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {departments.map((dept, i) => {
            const stats = getDeptStats(dept.title);
            return (
              <AnimateOnScroll key={i} variant="fadeUp" delay={i * 120}>
                <div className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1">

                  {/* IMAGE */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={dept.image}
                      alt={dept.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  </div>

                  {/* CONTENT */}
                  <div className="p-6">

                    <h3 className="text-white font-semibold text-lg mb-2">
                      {dept.title}
                    </h3>

                    <p className="text-white/50 text-sm leading-relaxed mb-6">
                      {dept.desc}
                    </p>

                    {/* STATS */}
                    {stats && (
                      <div className="mt-4 pt-4 border-t border-white/10 mb-6 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-white/40">Avg GPA</span>
                          <span className="text-blue-400 font-bold">{stats.gpa.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${stats.gpaPercent}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-white/40">Enrolled Students</span>
                          <span className="text-white/70 font-semibold">{stats.students}</span>
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    <Link
                      href={`/departments/${dept.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 hover:text-blue-300 group/link"
                    >
                      Explore Department
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>

                  </div>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}