"use client";

export default function StatusBadge({ status }) {
    if (status === 'published') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 text-xs font-bold rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Published
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 text-xs font-bold rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Draft
        </span>
    );
}
