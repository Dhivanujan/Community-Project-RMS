export default function AdminDashboard() {
    return (
        <div className="w-full h-full space-y-8">
            <header>
                <h1 className="text-3xl lg:text-4xl font-bold text-textDark tracking-tight leading-[1.15]">
                    Dashboard Overview
                </h1>
                <p className="mt-3 text-textMuted text-sm font-medium">
                    Monitor your university&apos;s real-time performance, results statistics, and recent activity.
                </p>
            </header>

            <div className="h-64 rounded-3xl border-2 border-dashed border-border flex items-center justify-center">
                <p className="text-textMuted font-bold">Analytics going here in Step 2...</p>
            </div>
        </div>
    );
}