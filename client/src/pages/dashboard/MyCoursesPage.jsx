import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ChevronRight } from 'lucide-react';
import SectionHeading from '@/components/shared/SectionHeading';
import api from '@/lib/api';

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/me/enrollments')
      .then(({ data }) => {
        setEnrollments(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    
    // Preload CoursePlayerPage chunk so "Continue" navigates instantly
    import('@/pages/courses/CoursePlayerPage').catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeading title="My Courses" subtitle="Resume learning from where you left off." />
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6 h-24 animate-pulse bg-surface" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeading title="My Courses" subtitle="Resume learning from where you left off." />

      {enrollments.length === 0 ? (
        <div className="bg-surface rounded-[20px] p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-coral-light rounded-full flex items-center justify-center text-coral mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="font-display text-2xl text-text-primary mb-2">No courses yet</h3>
          <p className="text-text-body max-w-md mx-auto mb-6">
            You haven't enrolled in any courses yet. Browse our catalog to find your next learning adventure!     
          </p>
          <Link to="/courses" className="btn btn-primary no-underline">Browse Courses</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {enrollments.map((e) => (
            <div key={e._id} className="card p-5 flex items-center justify-between hover:border-coral/30 transition-colors">
              <div className="flex items-center gap-5 min-w-0">
                {e.course?.thumbnail ? (
                  <img src={e.course.thumbnail} alt="" className="w-24 h-16 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="w-24 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-semibold text-text-primary mb-1 truncate">{e.course?.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {e.progressPercent}% Complete
                    </span>
                    <span>•</span>
                    <span>{e.completedLessons?.length || 0} / {e.course?.totalLessons || 1} Modules</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
                    <div 
                      className="h-full bg-coral transition-all duration-500" 
                      style={{ width: `${e.progressPercent}%` }} 
                    />
                  </div>
                </div>
              </div>
              <Link 
                to={`/learn/${e.course?.slug || e.course?._id}`} 
                className="btn btn-ghost btn-sm flex items-center gap-1 no-underline whitespace-nowrap"
              >
                {e.isCompleted ? 'Review' : 'Continue'} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
