import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, CheckCircle, MessageCircle } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

import PlayerSidebar from '@/components/courses/PlayerSidebar';
import VideoPlayer from '@/components/courses/VideoPlayer';
import QuizPlayer from '@/components/courses/QuizPlayer';
import QAPanel from '@/components/courses/QAPanel';

export default function CoursePlayerPage() {
  const { courseSlug } = useParams();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [openSections, setOpenSections] = useState([0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showQA, setShowQA] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/courses/${courseSlug}`);
        setCourse(data.data);
        const firstSection = data.data.curriculum?.[0];
        if (firstSection?.lessons?.[0]) setActiveLesson(firstSection.lessons[0]);
        const { data: enrollData } = await api.get(`/users/me/enrollments`);
        const found = enrollData.data?.find((e) => e.course?._id === data.data._id || e.course?.slug === courseSlug);
        if (found) setEnrollment(found);
      } catch (err) {
        console.error('Failed to load course:', err);
        toast.error('Failed to load course');
      } finally { setLoading(false); }
    };
    load();
  }, [courseSlug]);

  const toggleSection = (i) => setOpenSections((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);

  const markComplete = async (lessonId) => {
    if (!course) return;
    try {
      const { data } = await api.patch(`/courses/${course._id}/lessons/${lessonId}/progress`);
      setEnrollment((prev) => ({ ...prev, ...data.data, completedLessons: [...(prev?.completedLessons || []), lessonId] }));
      toast.success('Lesson completed!');
    } catch (err) {
      console.error('Failed to mark complete:', err);
      toast.error('Failed to mark lesson complete');
    }
  };

  const isCompleted = (lessonId) => enrollment?.completedLessons?.includes(lessonId);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
    </div>
  );
  if (!course) return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Course not found</p>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      <PlayerSidebar
        course={course}
        enrollment={enrollment}
        activeLesson={activeLesson}
        openSections={openSections}
        onToggleSection={toggleSection}
        onSelectLesson={(les) => { setActiveLesson(les); setSidebarOpen(false); }}
        onClose={() => setSidebarOpen(false)}
        courseSlug={courseSlug}
      />

      <div className="flex-1 min-w-0">
        <div className="h-14 flex items-center gap-3 px-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{activeLesson?.title || 'Select a lesson'}</h2>
        </div>

        <div className="p-6 max-w-4xl mx-auto">
          {activeLesson?.type === 'quiz' ? (
            <QuizPlayer lesson={activeLesson} onComplete={markComplete} />
          ) : (
            <VideoPlayer lesson={activeLesson} />
          )}

          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{activeLesson?.title}</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                {activeLesson?.type || 'video'} • {activeLesson?.videoDuration ? `${Math.floor(activeLesson.videoDuration / 60)} min` : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowQA(!showQA)} className={`btn btn-sm ${showQA ? 'btn-primary' : 'btn-secondary'}`}>
                <MessageCircle className="w-4 h-4" /> Q&A
              </button>
              {activeLesson && !isCompleted(activeLesson._id) && (
                <button onClick={() => markComplete(activeLesson._id)} className="btn btn-primary btn-sm">
                  <CheckCircle className="w-4 h-4" /> Mark Complete
                </button>
              )}
              {activeLesson && isCompleted(activeLesson._id) && (
                <span className="badge badge-success"><CheckCircle className="w-3 h-3" /> Completed</span>
              )}
            </div>
          </div>

          <QAPanel courseId={course._id} activeLessonId={activeLesson?._id} show={showQA} />

          {activeLesson?.content && (
            <div className="card p-6">
              <div className="prose prose-sm max-w-none" style={{ color: 'var(--text-secondary)' }}>{activeLesson.content}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}