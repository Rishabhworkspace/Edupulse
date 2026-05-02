import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';
import { Play } from 'lucide-react';

export default function VideoPlayer({ lesson }) {
  if (!lesson) return null;

  const plyrProps = {
    source: {
      type: 'video',
      sources: [
        {
          src: lesson.videoUrl,
          provider: lesson.videoUrl?.includes('youtube.com') || lesson.videoUrl?.includes('youtu.be') ? 'youtube' : 'html5',
        },
      ],
    },
    options: {
      autoplay: false,
      controls: [
        'play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'
      ],
    }
  };

  return (
    <div className="rounded-xl overflow-hidden mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="w-full" style={{ background: '#000', aspectRatio: '16/9' }}>
        {lesson.videoUrl ? (
          <Plyr {...plyrProps} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Play className="w-16 h-16 text-white/30 mx-auto mb-3" />
              <p className="text-white/50 text-sm">Video content not available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}