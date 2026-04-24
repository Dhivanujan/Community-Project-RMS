import ResultUploadManager from '@/components/admin/results/ResultUploadManager';
import { FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ResultsPage() {
    return (
        <div className="w-full h-full space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-textDark tracking-tight leading-[1.15] flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary" />
                        Result Upload
                    </h1>
                    <p className="mt-2 text-textMuted text-sm font-medium">
                        Upload, manage, and publish student results by subject.
                    </p>
                </div>
            </header>

            <ResultUploadManager />
        </div>
    );
}
