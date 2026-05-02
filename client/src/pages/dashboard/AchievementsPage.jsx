import { Award } from 'lucide-react';
import SectionHeading from '@/components/shared/SectionHeading';

export default function AchievementsPage() {
  return (
    <div className="space-y-6">
      <SectionHeading title="Achievements" subtitle="Celebrate your learning milestones." />
      <div className="bg-surface rounded-[20px] p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-coral-light rounded-full flex items-center justify-center text-coral mb-4">
          <Award className="w-8 h-8" />
        </div>
        <h3 className="font-display text-2xl text-text-primary mb-2">Start earning badges</h3>
        <p className="text-text-body max-w-md mx-auto">
          Complete courses, participate in discussions, and maintain learning streaks to unlock exclusive achievements.
        </p>
      </div>
    </div>
  );
}
