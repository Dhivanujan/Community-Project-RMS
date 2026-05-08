import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-[#f8f9fc] font-sans">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col relative">
                <Topbar />
                <main className="flex-1 px-8 py-7 max-w-[1400px] animate-fadeInUp">
                    {children}
                </main>
            </div>
        </div>
    );
}