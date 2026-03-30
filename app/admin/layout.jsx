import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-background font-sans">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col relative">
                <Topbar />
                <main className="flex-1 p-8 lg:p-12 animate-fadeInUp">
                    {children}
                </main>
            </div>
        </div>
    );
}