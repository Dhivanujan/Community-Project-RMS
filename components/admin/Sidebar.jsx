"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Building2, BookOpen, FileText, BarChart3, LogOut, GraduationCap, X } from 'lucide-react';

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Students', icon: Users, path: '/admin/students' },
    { name: 'Subjects', icon: BookOpen, path: '/admin/subjects' },
    { name: 'Results', icon: FileText, path: '/admin/results' },
    { name: 'GPA Analytics', icon: BarChart3, path: '/admin/gpa-reports' },
];

export default function Sidebar({ isOpen, setIsOpen }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } finally {
            router.push('/login');
            router.refresh();
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300 animate-fadeIn"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] flex flex-col z-[70] transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* University Branding */}
                <div className="px-6 pt-7 pb-6 border-b border-white/[0.06] flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4a843] to-[#b8912e] flex items-center justify-center shadow-lg shadow-[#d4a843]/20">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-[14px] font-bold text-white leading-tight tracking-wide">
                                RMS Admin
                            </h1>
                            <p className="text-[10px] text-[#d4a843] mt-0.5 font-semibold tracking-widest uppercase">
                                Faculty of Computing
                            </p>
                        </div>
                    </div>
                    {/* Close button for mobile */}
                    <button 
                        className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 px-3 pt-6 space-y-1 overflow-y-auto">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] px-3 mb-3">
                        Menu
                    </p>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        // For exact match on dashboard, or prefix match for sub-pages
                        const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                onClick={() => setIsOpen && setIsOpen(false)}
                                className={`
                                    relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200
                                    ${
                                      isActive
                                        ? "bg-white/[0.08] text-white shadow-sm"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                                    }
                                `}
                            >
                                {/* Active indicator bar */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#d4a843] rounded-r-full" />
                                )}
                                <Icon 
                                    className={`w-[18px] h-[18px] ${
                                        isActive ? 'text-[#d4a843]' : 'text-slate-500'
                                    }`} 
                                />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
                {/* Bottom Section */}
                <div className="px-3 pb-4 space-y-1">
                    <div className="border-t border-white/[0.06] mb-3" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-500 hover:text-rose-400 hover:bg-rose-500/[0.06] transition-all duration-200">
                        <LogOut className="w-[18px] h-[18px]" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
