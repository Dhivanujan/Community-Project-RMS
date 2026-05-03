import { BookOpen } from 'lucide-react';
import SubjectsManager from '@/components/admin/subjects/SubjectsManager';

export default function SubjectsPage() {
  return (
    <div className="w-full h-full space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeInUp">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-textDark tracking-tight leading-[1.15] flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl card-glow">
              <BookOpen className="w-8 h-8 text-primary animate-pulse-glow" />
            </div>
            Subjects
          </h1>
          <p className="mt-3 text-textMuted text-sm font-medium">
            Browse and filter all subjects across departments and semesters.
          </p>
        </div>
      </header>

      <SubjectsManager />
    </div>
  );
}
