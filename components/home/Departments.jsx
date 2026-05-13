"use client";

import { ArrowRight } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";
import Link from "next/link";
import Image from "next/image";

const departments = [
  {
    title: "Department of Software Engineering",
    desc: "Focusing on high-quality software development, agile methodologies, and enterprise-level system architecture.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    slug: "software-engineering",
  },
  {
    title: "Department of Data Science",
    desc: "Pioneering research in artificial intelligence, machine learning, and advanced statistical modeling.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    slug: "data-science",
  },
  {
    title: "Department of Computing and Information Systems",
    desc: "Dedicated to the study of information management, network security, and digital business systems.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    slug: "computing-information-systems",
  },
];

export default function Departments() {
  return (
    <section id="departments" className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — left-aligned with blue left border */}
        <AnimateOnScroll variant="fadeUp" className="mb-12">
          <div className="border-l-4 border-primary-600 pl-5">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Academic Departments
            </h2>
            <p className="text-slate-500 text-sm max-w-3xl leading-relaxed">
              Faculty of Computing – Supporting Software Engineering, Computing &amp; Information Systems,
              and Data Science with advanced academic analytics and result management.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Department Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {departments.map((dept, i) => (
            <AnimateOnScroll key={i} variant="fadeUp" delay={i * 120} className="h-full">
              <div className="bg-white border border-slate-200 hover:border-primary-200 hover:shadow-xl transition-all duration-300 flex flex-col h-full rounded-xl overflow-hidden group">
                {/* Department Image */}
                <div className="relative h-52 overflow-hidden bg-slate-100 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={dept.image}
                    alt={dept.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Subtle image overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-slate-900 mb-3 leading-snug">
                    {dept.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed flex-grow mb-6">
                    {dept.desc}
                  </p>

                  {/* CTA Button */}
                  <Link
                    href={`#departments-${dept.slug}`}
                    className="inline-flex items-center gap-2 border border-primary-600 text-primary-600 px-5 py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-primary-600 hover:text-white transition-all duration-200 group/btn self-start rounded"
                  >
                    EXPLORE DEPARTMENT
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}