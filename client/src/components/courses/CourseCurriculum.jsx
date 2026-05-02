import { useState } from 'react';
import { Play, FileText, HelpCircle, ClipboardList, ChevronDown, ChevronUp, Lock } from 'lucide-react';

const typeIcons = {
  video: Play,
  article: FileText,
  quiz: HelpCircle,
  assignment: ClipboardList,
};

export default function CourseCurriculum({ curriculum, isEnrolled }) {
  const [openSection, setOpenSection] = useState(0);

  if (!curriculum?.length) return null;

  const formatDuration = (les) => {
    if (les.type === 'video') {
      if (!les.videoDuration) return '';
      return `${Math.floor(les.videoDuration / 60)}:${String(les.videoDuration % 60).padStart(2, '0')}`;
    }
    return `${les.estimatedMinutes || 10} min`;
  };

  return (
    <div className="mb-8">
      <h3 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Course Curriculum</h3>
      <div className="space-y-2">
        {curriculum.map((sec, si) => {
          const totalMinutes = sec.lessons?.reduce((acc, curr) => acc + (curr.estimatedMinutes || (curr.videoDuration ? curr.videoDuration / 60 : 10)), 0) || 0;
          
          return (
            <div key={sec._id} className="card overflow-hidden">
              <button
                onClick={() => setOpenSection(openSection === si ? -1 : si)}
                className="w-full flex items-center justify-between p-4 text-left"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
              >
                <div>
                  <span className="font-semibold text-sm">{sec.title}</span>
                  <div className="flex gap-2 mt-1">
                     <span className="text-[10px] text-text-muted">{sec.lessons?.length || 0} lessons • {Math.round(totalMinutes)} mins total</span>
                  </div>
                </div>
                {openSection === si ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === si && sec.lessons?.map((les) => {
                const Icon = typeIcons[les.type] || Play;
                const isLocked = !isEnrolled && !les.isPreview;

                return (
                  <div key={les._id} className="flex items-center justify-between px-4 py-2.5 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: les.isPreview ? '#F4845F' : 'var(--text-muted)' }} />
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>{les.title}</span>
                        {les.description && <span className="text-[10px] text-text-muted truncate">{les.description}</span>}
                      </div>
                      {les.isPreview && <span className="badge badge-primary text-[10px] flex-shrink-0">Preview</span>}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDuration(les)}</span>
                      {isLocked && <Lock className="w-3 h-3 text-text-muted" />}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}