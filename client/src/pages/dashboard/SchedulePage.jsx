import { useState, useEffect } from 'react';
import { Calendar, Clock, Video, FileText, CheckCircle2, Bookmark, HelpCircle, ClipboardList } from 'lucide-react';
import SectionHeading from '@/components/shared/SectionHeading';
import api from '@/lib/api';
import { Link } from 'react-router-dom';

const typeIcons = {
  video: Video,
  article: FileText,
  quiz: HelpCircle,
  assignment: ClipboardList,
};

export default function SchedulePage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/me/enrollments')
      .then(({ data }) => {
        setEnrollments(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const scheduleItems = [];
  
  enrollments.filter(e => !e.isCompleted).forEach(e => {
    const allLessons = [];
    e.course?.curriculum?.forEach(sec => {
      sec.lessons?.forEach(l => allLessons.push(l));
    });

    const activeLessonIndex = allLessons.findIndex(l => !e.completedLessons?.includes(l._id));
    if (activeLessonIndex !== -1) {
      const current = allLessons[activeLessonIndex];
      scheduleItems.push({
        id: current._id,
        courseTitle: e.course.title,
        title: current.title,
        type: current.type,
        duration: current.estimatedMinutes || (current.videoDuration ? Math.round(current.videoDuration / 60) : 10),
        status: 'Next Up',
        icon: typeIcons[current.type] || Video,
        color: '#F4845F',
        slug: e.course.slug
      });

      if (allLessons[activeLessonIndex + 1]) {
        const next = allLessons[activeLessonIndex + 1];
        scheduleItems.push({
          id: next._id,
          courseTitle: e.course.title,
          title: next.title,
          type: next.type,
          duration: next.estimatedMinutes || (next.videoDuration ? Math.round(next.videoDuration / 60) : 10),
          status: 'Following',
          icon: typeIcons[next.type] || Video,
          color: '#8DB580',
          slug: e.course.slug
        });
      }
    }
  });

  if (loading) return (
    <div className="space-y-6">
      <SectionHeading title="My Schedule" subtitle="Stay organized and never miss a lesson." />
      <div className="grid gap-6">
        {[...Array(3)].map((_, i) => <div key={i} className="card h-24 animate-pulse bg-surface" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionHeading title="My Schedule" subtitle="Stay organized and never miss a lesson." />
      
      <div className="grid gap-6">
        {/* Weekly View Header */}
        <div className="bg-surface rounded-2xl p-4 flex justify-between items-center border border-gray-100 shadow-sm overflow-x-auto gap-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
            <div 
              key={day} 
              className={`flex flex-col items-center min-w-[60px] py-2 rounded-xl transition-colors ${i === 1 ? 'bg-coral text-white' : 'hover:bg-gray-50'}`}
            >
              <span className="text-xs opacity-80">{day}</span>
              <span className="font-bold text-lg">{new Date().getDate() + (i - 1)}</span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {scheduleItems.length === 0 ? (
            <div className="bg-surface rounded-[20px] p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-coral-light rounded-full flex items-center justify-center text-coral mb-4">
                <Bookmark className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl text-text-primary mb-2">Schedule is clear</h3>
              <p className="text-text-body max-w-md mx-auto mb-6">
                You've completed all lessons in your enrolled courses!
              </p>
              <Link to="/courses" className="btn btn-primary no-underline">Browse More Courses</Link>
            </div>
          ) : (
            scheduleItems.map((item) => (
              <div key={item.id} className="bg-surface rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-6 relative hover:border-coral/20 transition-colors">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}15` }}>
                  <item.icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{item.courseTitle}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${item.status === 'Next Up' ? 'bg-coral-light text-coral' : 'bg-green-light text-green-700'}`}>
                      {item.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-text-primary truncate">{item.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-text-muted mt-1">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.duration} mins</span>
                    <span>•</span>
                    <span className="capitalize">{item.type}</span>
                  </div>
                </div>
                <Link to={`/learn/${item.slug}`} className="btn btn-outline btn-sm no-underline whitespace-nowrap">
                   Start Lesson
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
