import { useState } from 'react';
import { Play, ChevronDown, ChevronUp } from 'lucide-react';

export default function CourseCurriculum({ curriculum }) {
  const [openSection, setOpenSection] = useState(0);

  if (!curriculum?.length) return null;

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  };

  return (
    <div className="mb-8">
      <h3 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Course Curriculum</h3>
      <div className="space-y-2">
        {curriculum.map((sec, si) => (
          <div key={sec._id} className="card overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === si ? -1 : si)}
              className="w-full flex items-center justify-between p-4 text-left"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
            >
              <span className="font-semibold text-sm">{sec.title}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{sec.lessons?.length || 0} lessons</span>
                {openSection === si ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>
            {openSection === si && sec.lessons?.map((les) => (
              <div key={les._id} className="flex items-center justify-between px-4 py-2.5 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2.5">
                  <Play className="w-3.5 h-3.5" style={{ color: les.isPreview ? '#F4845F' : 'var(--text-muted)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{les.title}</span>
                  {les.isPreview && <span className="badge badge-primary text-[10px]">Preview</span>}
                </div>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDuration(les.videoDuration)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}