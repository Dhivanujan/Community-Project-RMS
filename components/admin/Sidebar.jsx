"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Building2, BookOpen, FileText, BarChart3 } from 'lucide-react';

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Students', icon: Users, path: '/admin/students' },
    { name: 'Departments', icon: Building2, path: '/admin/departments' },
    { name: 'Subjects', icon: BookOpen, path: '/admin/subjects' },
    { name: 'Results', icon: FileText, path: '/admin/results' },
    { name: 'GPA Reports', icon: BarChart3, path: '/admin/gpa-reports' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 w-64 h-screen bg-surface/80 backdrop-blur-xl border-r border-border flex flex-col shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] font-sans z-50">
            <div className="p-6 border-b border-border flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm card-glow">
                    <BarChart3 className="text-white w-5 h-5 animate-pulse-glow" />
                </div>
                <h2 className="text-xl font-bold text-textDark tracking-tight">RMS Admin</h2>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    // For exact match on dashboard, or prefix match for sub-pages
                    const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));

                    return (
                        <Link
                            key={item.name}
                            href={item.path}
                            className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm ${
                                isActive
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'text-textMuted hover:bg-primary/10 hover:text-primary hover:translate-x-1'
                            }`}
                        >
                            <Icon 
                                className={`w-5 h-5 transition-colors duration-300 ${
                                    isActive ? 'text-white' : 'text-textMuted group-hover:text-primary'
                                }`} 
                            />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
            {/* Sidebar Footer element matching your login footer logic */}
            <div className="p-6 border-t border-border mt-auto backdrop-blur-md">
                <p className="text-xs text-textMuted text-center font-medium">© 2024 Faculty of Computing</p>
            </div>
        </aside>
    );
}
