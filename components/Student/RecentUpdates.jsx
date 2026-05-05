"use client";

import { CheckCircle, Calculator, Mail } from "lucide-react";


export default function RecentUpdates({ updates = [] }) {
  return (
    <div className="flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Recent Updates
        </h3>
        <button className="text-[11px] font-semibold text-slate-400 hover:text-primary-900 uppercase tracking-wider transition-colors">
          View All
        </button>
      </div>

      {/* Updates List — Timeline Style */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-3 bottom-3 w-px bg-slate-100" />

        <div className="space-y-0">
          {updates.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500 font-medium">
              No recent updates available.
            </div>
          ) : (
            updates.map((update, i) => {
              // Map API payload to UI configs
              // For now, API only returns type: 'results'
              let Icon = CheckCircle;
              let iconBg = "bg-primary-900/[0.07]";
              let iconColor = "text-primary-900";

              if (update.type === "gpa") {
                Icon = Calculator;
                iconBg = "bg-amber-50";
                iconColor = "text-amber-600";
              } else if (update.type === "notification") {
                Icon = Mail;
                iconBg = "bg-emerald-50";
                iconColor = "text-emerald-600";
              }

              // Simple date formatting
              const formattedTime = update.createdAt 
                ? new Date(update.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : "Recently";

              return (
                <div
                  key={update.id || i}
                  className="relative flex gap-4 p-3.5 rounded-xl hover:bg-white hover:shadow-sm hover:border-slate-200/60 border border-transparent transition-all duration-200 cursor-pointer group"
                >
                  {/* Icon with timeline dot */}
                  <div className="relative z-10">
                    <div
                      className={`w-[38px] h-[38px] rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0 ring-4 ring-[#f8f9fc] group-hover:ring-white transition-all`}
                    >
                      <Icon className={`w-4 h-4 ${iconColor}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h4 className="text-[13px] font-semibold text-slate-700 group-hover:text-primary-900 transition-colors leading-tight">
                      {update.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                      {update.description}
                    </p>
                    <p className="text-[10px] text-slate-400/80 font-medium mt-1.5">
                      {formattedTime}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
