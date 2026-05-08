export default function DashboardCard({ title, value, icon, bgColor = "bg-primary" }) {
    return (
        <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md cursor-pointer transition-all duration-300 group">
            <div className={`w-12 h-12 flex items-center justify-center rounded-xl text-white shadow-sm ${bgColor} group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <div>
                <p className="text-slate-500 font-medium text-sm group-hover:text-amber-600 transition-colors">{title}</p>
                <h3 className="text-slate-800 font-bold text-2xl">{value}</h3>
            </div>
        </div>
    );
}