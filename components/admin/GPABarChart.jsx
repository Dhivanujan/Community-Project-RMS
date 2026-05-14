"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-lg font-black text-blue-600">
                    GPA: {payload[0].value}
                </p>
            </div>
        );
    }
    return null;
};

export default function GPABarChart({ data = [] }) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 h-80 flex flex-col items-center justify-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                    <BarChart className="w-8 h-8 text-slate-200" />
                </div>
                <h3 className="text-slate-900 font-bold mb-1">GPA Trends</h3>
                <p className="text-slate-400 text-sm">No academic data available yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 h-96 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-slate-900 font-black text-xl tracking-tight">Academic Performance</h3>
                    <p className="text-slate-400 text-xs font-medium mt-1">GPA distribution across semesters</p>
                </div>
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <div className="w-3 h-3 rounded-full bg-blue-200"></div>
                </div>
            </div>
            
            <ResponsiveContainer width="100%" height="80%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563EB" stopOpacity={1} />
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.6} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis 
                        dataKey="semester" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
                        domain={[0, 4.2]}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC', radius: 12 }} />
                    <Bar 
                        dataKey="GPA" 
                        fill="url(#barGradient)" 
                        radius={[10, 10, 10, 10]} 
                        barSize={40}
                        animationBegin={0}
                        animationDuration={1500}
                        animationEasing="ease-out"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}