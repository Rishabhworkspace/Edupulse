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
import ArticleViewer from '@/components/courses/ArticleViewer';
import AssignmentViewer from '@/components/courses/AssignmentViewer';
import NotesPanel from '@/components/courses/NotesPanel';
import ResourcesList from '@/components/courses/ResourcesList';

export default function CoursePlayerPage() {
  const { courseSlug } = useParams();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [openSections, setOpenSections] = useState([0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    let cancelled = false;

    // Guard: if slug is missing or literally 'undefined', skip the API call
    if (!courseSlug || courseSlug === 'undefined') {
      toast.error('Invalid course link');
      setLoading(false);
      return;
    }

    const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
      for (let i = 0; i < retries; i++) {
        try {
          return await api.get(url);
        } catch (err) {
          const status = err.response?.status;
          if ((status === 429 || (status >= 500 && status < 600)) && i < retries - 1) {
            await new Promise(r => setTimeout(r, delay * (i + 1)));
            continue;
          }
          throw err;
        }
      }
    };

    // Add a timeout to prevent infinite spinner
    const timeout = setTimeout(() => {
      if (!cancelled) {
        setLoading(false);
        toast.error('Loading timed out. Please refresh the page.');
      }
    }, 15000);

    const load = async () => {
      try {
        const { data } = await fetchWithRetry(`/courses/${courseSlug}`);
        if (cancelled) return;
        setCourse(data.data);
        const firstSection = data.data.curriculum?.[0];
        if (firstSection?.lessons?.[0]) setActiveLesson(firstSection.lessons[0]);
        
        try {
          const { data: enrollData } = await fetchWithRetry(`/courses/${data.data._id}/enrollment`);
          if (!cancelled) setEnrollment(enrollData.data);
        } catch (enrollErr) {
          // Enrollment fetch can fail if user is not logged in - that's OK
          console.warn('Could not fetch enrollment:', enrollErr.response?.status);
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load course:', err);
        toast.error(err.response?.status === 429 ? 'Server is busy, please try again' : 'Failed to load course');
      } finally {
        clearTimeout(timeout);
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; clearTimeout(timeout); };
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
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'var(--bg)' }}>
      <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading course...</p>
    </div>
  );
  if (!course) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'var(--bg)' }}>
      <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Course not found</p>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>The course may have been removed or the link is invalid.</p>
      <button onClick={() => window.history.back()} className="btn btn-primary mt-2">Go Back</button>
    </div>
  );

  const tabs = ['Overview', 'Notes', 'Q&A', 'Resources'];

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      <PlayerSidebar
        course={course}
        enrollment={enrollment}
        activeLesson={activeLesson}
        openSections={openSections}
        onToggleSection={toggleSection}
        onSelectLesson={(les) => { 
          setActiveLesson(les); 
          if (window.innerWidth < 1024) setSidebarOpen(false); 
          setActiveTab('Overview'); 
        }}
        onClose={() => setSidebarOpen(false)}
        courseSlug={courseSlug}
        isOpen={sidebarOpen}
      />

      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <div className="h-14 flex items-center gap-3 px-6 border-b flex-shrink-0" style={{ borderColor: 'var(--border)', background: 'var(--color-surface)' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{activeLesson?.title || 'Select a lesson'}</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-4xl mx-auto pb-20">
            {/* Player View */}
            <div className="mb-8">
              {activeLesson?.type === 'quiz' && (
                <QuizPlayer lesson={activeLesson} onComplete={markComplete} />
              )}
              {activeLesson?.type === 'article' && (
                <ArticleViewer lesson={activeLesson} />
              )}
              {activeLesson?.type === 'assignment' && (
                <AssignmentViewer lesson={activeLesson} onComplete={markComplete} />
              )}
              {activeLesson?.type === 'video' && (
                <VideoPlayer lesson={activeLesson} />
              )}
              {!activeLesson?.type && <VideoPlayer lesson={activeLesson} />}
            </div>

            {/* Header & Controls */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{activeLesson?.title}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="badge badge-secondary capitalize">{activeLesson?.type || 'video'}</span>
                  <span className="text-xs text-text-muted">
                    {activeLesson?.type === 'video' 
                      ? (activeLesson.videoDuration ? `${Math.floor(activeLesson.videoDuration / 60)} min` : '')
                      : `${activeLesson?.estimatedMinutes || 10} min read`
                    }
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {activeLesson && !isCompleted(activeLesson._id) && (
                  <button onClick={() => markComplete(activeLesson._id)} className="btn btn-primary">
                    <CheckCircle className="w-4 h-4" /> Mark Complete
                  </button>
                )}
                {activeLesson && isCompleted(activeLesson._id) && (
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b mb-8" style={{ borderColor: 'var(--border)' }}>
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === tab 
                      ? 'border-coral text-coral' 
                      : 'border-transparent text-text-muted hover:text-text-primary'
                  }`}
                  style={{ background: 'transparent', cursor: 'pointer' }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'Overview' && (
                <div className="card p-6">
                  <div className="prose prose-sm max-w-none text-text-body leading-relaxed">
                    {activeLesson?.content || 'No detailed overview available for this lesson.'}
                  </div>
                </div>
              )}
              
              {activeTab === 'Notes' && (
                <NotesPanel courseId={course._id} lessonId={activeLesson?._id} />
              )}
              
              {activeTab === 'Q&A' && (
                <QAPanel courseId={course._id} activeLessonId={activeLesson?._id} show />
              )}
              
              {activeTab === 'Resources' && (
                <ResourcesList resources={activeLesson?.resources} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}