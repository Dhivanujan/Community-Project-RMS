"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { semester: 'Sem 1', GPA: 3.2 },
    { semester: 'Sem 2', GPA: 3.4 },
    { semester: 'Sem 3', GPA: 3.5 },
    { semester: 'Sem 4', GPA: 3.6 },
];

export default function GPABarChart() {
    return (
        <div className="bg-surface rounded-3xl p-6 border border-border h-72">
            <h3 className="text-textDark font-bold mb-4">GPA Trend</h3>
            <ResponsiveContainer width="100%" height="80%">
                <BarChart data={data}>
                    <XAxis dataKey="semester" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Bar dataKey="GPA" fill="#2563EB" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}