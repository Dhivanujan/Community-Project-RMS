export default function DashboardCard({ title, value, icon, bgColor = "bg-primary" }) {
    return (
        <div className="flex items-center gap-4 p-6 bg-surface rounded-3xl shadow-sm border border-border">
            <div className={`w-12 h-12 flex items-center justify-center rounded-xl text-white ${bgColor}`}>
                {icon}
            </div>
            <div>
                <p className="text-textMuted font-medium text-sm">{title}</p>
                <h3 className="text-textDark font-bold text-xl">{value}</h3>
            </div>
        </div>
    );
}