import { BarChart3 } from 'lucide-react';
import dynamic from 'next/dynamic';

const GPAReportsManager = dynamic(
  () => import('@/components/admin/gpa-reports/GPAReportsManager'),
  { ssr: false }
);

export const dynamic_config = 'force-dynamic';

export default function GPAReportsPage() {
  return (
    <div className="w-full h-full space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeInUp">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-textDark tracking-tight leading-[1.15] flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl card-glow">
              <BarChart3 className="w-8 h-8 text-primary animate-pulse-glow" />
            </div>
            GPA Reports
          </h1>
          <p className="mt-3 text-textMuted text-sm font-medium">
            Analyze published results — grade distribution, department comparison, and top performers.
          </p>
        </div>
      </header>

      <GPAReportsManager />
    </div>
  );
}
