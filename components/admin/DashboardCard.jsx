export default function DashboardCard({ title, value, icon, bgColor = "bg-primary", trend = null }) {
    return (
        <div className="flex flex-col p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 scale-[2.5] group-hover:scale-[3] transform-gpu">
                {icon}
            </div>
            <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 flex items-center justify-center rounded-2xl text-white shadow-lg ${bgColor} group-hover:rotate-6 transition-all duration-500`}>
                    {icon}
                </div>
                {trend && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trend > 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>
            <div>
                <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">{title}</p>
                <h3 className="text-slate-900 dark:text-slate-100 font-black text-3xl tracking-tight">{value}</h3>
            </div>
        </div>
    );
}