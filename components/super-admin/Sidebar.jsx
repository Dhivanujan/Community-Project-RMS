"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LayoutDashboard, Users, ShieldAlert, Settings, LogOut, Server, X, ChevronRight } from 'lucide-react';

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/super-admin/dashboard' },
    { name: 'User Management', icon: Users, path: '/super-admin/users' },
    { name: 'Audit Logs', icon: ShieldAlert, path: '/super-admin/audit-logs' },
    { name: 'System Settings', icon: Settings, path: '/super-admin/settings' },
];

export default function Sidebar({ isOpen, setIsOpen }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push('/login');
        router.refresh();
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden animate-fadeIn"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-[#0c111d] via-[#151d2e] to-[#0c111d] flex flex-col z-[70] transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Decorative gradient line at top */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent" />
                
                {/* Branding */}
                <div className="px-6 pt-7 pb-6 border-b border-white/[0.06] flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center shadow-lg shadow-rose-500/25 ring-1 ring-rose-400/20">
                            <Server className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-[14px] font-bold text-white leading-tight tracking-wide">
                                Super Admin
                            </h1>
                            <p className="text-[10px] text-rose-400/80 mt-0.5 font-semibold tracking-[0.2em] uppercase">
                                System Control
                            </p>
                        </div>
                    </div>
                    <button
                        className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 pt-6 space-y-1 overflow-y-auto scrollbar-hide">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] px-3 mb-3">
                        Navigation
                    </p>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path || (item.path !== '/super-admin/dashboard' && pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                onClick={() => setIsOpen && setIsOpen(false)}
                                className={`
                                    group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200
                                    ${
                                      isActive
                                        ? "bg-gradient-to-r from-rose-500/15 to-rose-500/5 text-white shadow-sm"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                                    }
                                `}
                            >
                                {/* Active indicator bar */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-rose-500 rounded-r-full shadow-sm shadow-rose-500/50" />
                                )}
                                <Icon
                                    className={`w-[18px] h-[18px] transition-colors ${
                                        isActive ? 'text-rose-400' : 'text-slate-500 group-hover:text-slate-400'
                                    }`}
                                />
                                <span className="flex-1">{item.name}</span>
                                {isActive && (
                                    <ChevronRight className="w-3.5 h-3.5 text-rose-400/60" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="px-3 pb-5 space-y-3">
                    {/* System Status */}
                    <div className="mx-1 p-3 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/10">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[11px] font-semibold text-emerald-400">System Online</span>
                        </div>
                        <p className="text-[10px] text-slate-500">All services operational</p>
                    </div>

                    <div className="border-t border-white/[0.06]" />
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-500 hover:text-rose-400 hover:bg-rose-500/[0.08] transition-all duration-200"
                    >
                        <LogOut className="w-[18px] h-[18px]" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
