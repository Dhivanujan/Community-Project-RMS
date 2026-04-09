"use client";

import { CheckCircle, Calculator, Mail } from "lucide-react";

const updates = [
  {
    icon: CheckCircle,
    iconBg: "bg-[#3856c4]/10",
    iconColor: "text-[#3856c4]",
    title: "CS102 Results Published",
    description:
      "Introduction to Algorithms final grades are now available in your results portal.",
    time: "2 HOURS AGO",
  },
  {
    icon: Calculator,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    title: "GPA Calculation Updated",
    description:
      "Semester 1 summary has been refreshed with new transfer credits.",
    time: "YESTERDAY",
  },
  {
    icon: Mail,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    title: "Dean's List Nomination",
    description:
      "Congratulations! You have been nominated for the Faculty Excellence Award.",
    time: "OCT 12, 2023",
  },
];

export default function RecentUpdates() {
  return (
    <div className="flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-bold text-slate-800">Recent Updates</h3>
        <button className="text-xs font-bold text-slate-400 hover:text-[#3856c4] uppercase tracking-wider transition-colors">
          Clear All
        </button>
      </div>

      {/* Updates List */}
      <div className="space-y-3">
        {updates.map((update, i) => {
          const Icon = update.icon;
          return (
            <div
              key={i}
              className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200 cursor-pointer group"
            >
              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-xl ${update.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}
              >
                <Icon className={`w-5 h-5 ${update.iconColor}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#3856c4] transition-colors">
                  {update.title}
                </h4>
                <p className="text-[13px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  {update.description}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">
                  {update.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
