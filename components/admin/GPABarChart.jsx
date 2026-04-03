"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function GPABarChart({ data = [] }) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-surface rounded-3xl p-6 border border-border h-72 flex flex-col items-center justify-center">
                <h3 className="text-textDark font-bold mb-2">GPA Trend</h3>
                <p className="text-textMuted text-sm">No data available yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-surface rounded-3xl p-6 border border-border h-72">
            <h3 className="text-textDark font-bold mb-4">GPA Trend</h3>
            <ResponsiveContainer width="100%" height="80%">
                <BarChart data={data}>
                    <XAxis dataKey="semester" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" domain={[0, 4]} />
                    <Tooltip />
                    <Bar dataKey="GPA" fill="#2563EB" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}