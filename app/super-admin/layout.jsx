"use client";

import { useState } from 'react';
import Sidebar from '@/components/super-admin/Sidebar';
import Topbar from '@/components/super-admin/Topbar';

export default function SuperAdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#f8f9fc] font-sans">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 ml-0 lg:ml-64 flex flex-col relative transition-all duration-300">
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 px-4 lg:px-8 py-7 max-w-[1400px] animate-fadeInUp overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
