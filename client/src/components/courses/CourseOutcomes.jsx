import { CheckCircle } from 'lucide-react';

export default function CourseOutcomes({ outcomes }) {
  if (!outcomes?.length) return null;
  return (
    <div className="card p-6 mb-8">
      <h3 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>What you'll learn</h3>
      <div className="grid md:grid-cols-2 gap-3">
        {outcomes.map((o, i) => (
          <div key={i} className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{o}</span>
          </div>
        ))}
      </div>
    </div>
  );
}