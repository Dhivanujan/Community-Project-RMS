export default function DashboardCard({ title, value, icon, bgColor = "bg-primary" }) {
    return (
        <div className="flex items-center gap-4 p-6 bg-surface/80 glass-card rounded-3xl shadow-sm border border-border hover-lift card-glow cursor-pointer transition-all duration-300 group">
            <div className={`w-12 h-12 flex items-center justify-center rounded-xl text-white shadow-md ${bgColor} group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <div>
                <p className="text-textMuted font-medium text-sm group-hover:text-primary transition-colors">{title}</p>
                <h3 className="text-textDark font-bold text-xl">{value}</h3>
            </div>
        </div>
    );
}