import { Link } from 'react-router-dom';
import { ArrowLeft, X, ChevronDown, ChevronUp, Play, CheckCircle } from 'lucide-react';

export default function PlayerSidebar({ course, enrollment, activeLesson, openSections, onToggleSection, onSelectLesson, onClose, courseSlug }) {
  return (
    <aside className={`fixed lg:relative top-0 left-0 bottom-0 z-40 w-80 border-r flex flex-col transition-transform duration-200 ${
      true ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden'
    }`} style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      <div className="h-14 flex items-center justify-between px-4 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
        <Link to={`/course/${courseSlug}`} className="flex items-center gap-2 text-sm font-medium no-underline" style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <button onClick={onClose} className="lg:hidden" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Progress</span>
          <span className="text-xs font-bold text-primary">{enrollment?.progressPercent || 0}%</span>
        </div>
        <div className="progress-track"><div className="progress-bar" style={{ width: `${enrollment?.progressPercent || 0}%` }} /></div>
        {enrollment?.isCompleted && enrollment?.certificateUrl && (
          <a href={enrollment.certificateUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary w-full mt-3 flex items-center justify-center gap-2">
            View Certificate
          </a>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {course.curriculum?.map((sec, si) => (
          <div key={sec._id}>
            <button
              onClick={() => onToggleSection(si)}
              className="w-full flex items-center justify-between px-4 py-3 text-left border-b"
              style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-primary)' }}
            >
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{sec.title}</span>
              {openSections.includes(si) ? <ChevronUp className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} /> : <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />}
            </button>
            {openSections.includes(si) && sec.lessons?.map((les) => {
              const isActive = activeLesson?._id === les._id;
              const completed = enrollment?.completedLessons?.includes(les._id);
              return (
                <button
                  key={les._id}
                  onClick={() => { onSelectLesson(les); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${isActive ? 'bg-primary/8' : 'hover:bg-[var(--bg-secondary)]'}`}
                  style={{ background: isActive ? '#F4845F10' : 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
                >
                  {completed ? (
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                  ) : (
                    <Play className="w-4 h-4 flex-shrink-0" style={{ color: isActive ? '#F4845F' : 'var(--text-muted)' }} />
                  )}
                  <span className="flex-1 truncate">{les.title}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
}