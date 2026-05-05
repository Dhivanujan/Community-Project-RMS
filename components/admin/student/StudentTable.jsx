"use client";

import { Edit3, Trash2, GraduationCap } from 'lucide-react';

export default function StudentTable({ students, onDelete, onEdit }) {
    return (
        <div className="bg-surface/80 glass-card rounded-3xl shadow-sm border border-border p-6 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border text-textMuted text-xs uppercase tracking-wider">
                            <th className="pb-4 font-semibold px-4">Student</th>
                            <th className="pb-4 font-semibold px-4">Contact</th>
                            <th className="pb-4 font-semibold px-4">Department & Year</th>
                            <th className="pb-4 font-semibold px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? (
                            students.map((student) => (
                                <tr key={student._id} className="border-b border-border/50 hover:bg-primary/5 transition-colors group">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm group-hover:scale-105 transition-transform">
                                                {student.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-textDark group-hover:text-primary transition-colors">
                                                    {student.name}
                                                </p>
                                                <p className="text-textMuted text-xs font-semibold">{student.rollNumber}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-textMuted text-sm">
                                        {student.email}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="w-fit px-3 py-1 bg-primary-500/10 text-primary-600 text-xs font-bold rounded-md">
                                                {student.department || 'N/A'}
                                            </span>
                                            <span className="flex items-center gap-1 text-textMuted text-xs font-medium">
                                                <GraduationCap className="w-3.5 h-3.5" />
                                                Class of {student.enrollmentYear || 'N/A'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => onEdit(student)}
                                                className="p-2 text-textMuted hover:text-primary hover:bg-primary/10 rounded-lg transition-all hover:scale-110"
                                                title="Edit Student"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => onDelete(student._id)}
                                                className="p-2 text-textMuted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all hover:scale-110"
                                                title="Delete Student"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-12 text-center text-textMuted text-sm font-medium">
                                    <div className="flex flex-col items-center justify-center gap-4 animate-fadeIn">
                                        <div className="p-4 bg-primary/5 rounded-full card-glow">
                                            <GraduationCap className="w-12 h-12 text-primary/40 animate-pulse-glow" />
                                        </div>
                                        <p>No students found.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
