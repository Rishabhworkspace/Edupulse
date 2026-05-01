import { Play } from 'lucide-react';

export default function VideoPlayer({ lesson }) {
  if (!lesson) return null;

  return (
    <div className="rounded-xl overflow-hidden mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="w-full" style={{ background: '#000', aspectRatio: '16/9' }}>
        {lesson.videoUrl ? (
          <video src={lesson.videoUrl} controls className="w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Play className="w-16 h-16 text-white/30 mx-auto mb-3" />
              <p className="text-white/50 text-sm">Video content</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}