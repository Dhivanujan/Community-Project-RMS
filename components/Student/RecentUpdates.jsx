"use client";

import { CheckCircle, Calculator, Mail } from "lucide-react";

const updates = [
  {
    icon: CheckCircle,
    iconBg: "bg-[#1e3a5f]/[0.07]",
    iconColor: "text-[#1e3a5f]",
    accentColor: "bg-[#1e3a5f]",
    title: "CS102 Results Published",
    description:
      "Introduction to Algorithms final grades are now available in your results portal.",
    time: "2 hours ago",
  },
  {
    icon: Calculator,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    accentColor: "bg-amber-500",
    title: "GPA Calculation Updated",
    description:
      "Semester 1 summary has been refreshed with new transfer credits.",
    time: "Yesterday",
  },
  {
    icon: Mail,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    accentColor: "bg-emerald-500",
    title: "Dean's List Nomination",
    description:
      "Congratulations! You have been nominated for the Faculty Excellence Award.",
    time: "Oct 12, 2023",
  },
];

export default function RecentUpdates() {
  return (
    <div className="flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Recent Updates
        </h3>
        <button className="text-[11px] font-semibold text-slate-400 hover:text-[#1e3a5f] uppercase tracking-wider transition-colors">
          View All
        </button>
      </div>

      {/* Updates List — Timeline Style */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-3 bottom-3 w-px bg-slate-100" />

        <div className="space-y-0">
          {updates.map((update, i) => {
            const Icon = update.icon;
            return (
              <div
                key={i}
                className="relative flex gap-4 p-3.5 rounded-xl hover:bg-white hover:shadow-sm hover:border-slate-200/60 border border-transparent transition-all duration-200 cursor-pointer group"
              >
                {/* Icon with timeline dot */}
                <div className="relative z-10">
                  <div
                    className={`w-[38px] h-[38px] rounded-lg ${update.iconBg} flex items-center justify-center flex-shrink-0 ring-4 ring-[#f8f9fc] group-hover:ring-white transition-all`}
                  >
                    <Icon className={`w-4 h-4 ${update.iconColor}`} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <h4 className="text-[13px] font-semibold text-slate-700 group-hover:text-[#1e3a5f] transition-colors leading-tight">
                    {update.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {update.description}
                  </p>
                  <p className="text-[10px] text-slate-400/80 font-medium mt-1.5">
                    {update.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
