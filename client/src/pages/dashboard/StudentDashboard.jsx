import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Clock, Award, Play, Zap, Flame, Calendar } from 'lucide-react';
import api from '@/lib/api';

export default function StudentDashboard() {
  const { user } = useSelector((s) => s.auth);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/me/enrollments')
      .then(({ data }) => { setEnrollments(data.data || []); setLoading(false); })
      .catch(() => setLoading(false));
    
    // Preload CoursePlayerPage chunk so "Continue Learning" navigates instantly
    import('@/pages/courses/CoursePlayerPage').catch(() => {});
  }, []);

  const inProgress = enrollments.filter((e) => !e.isCompleted);
  const completed = enrollments.filter((e) => e.isCompleted);

  const avgProgress = enrollments.length > 0 
    ? Math.round(enrollments.reduce((acc, curr) => acc + curr.progressPercent, 0) / enrollments.length)
    : 0;
  
  // Pick the most recently accessed or highest progress course as the featured one
  const featuredCourse = inProgress.length > 0 ? inProgress[0] : null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-4xl text-text-primary mb-2">
          Welcome back, <span className="text-coral">{user?.name?.split(' ')[0]}</span>!
        </h1>
        <p className="text-text-body text-lg">
          {enrollments.length === 0 
            ? "Ready to start your learning journey? Explore our courses today!" 
            : `You've completed ${avgProgress}% of your overall learning goals. Keep it up!`}
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Featured Course Banner */}
          {featuredCourse && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-coral-light/30 rounded-[20px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-coral-light"
            >
              <div>
                <h3 className="font-display text-2xl text-text-primary mb-2">
                  {featuredCourse.course?.title}
                </h3>
                <p className="text-text-body mb-4">
                  Created by <span className="font-semibold text-text-primary">{featuredCourse.course?.instructor?.name || 'EduPulse Expert'}</span>
                </p>
                <Link to={`/learn/${featuredCourse.course?.slug || featuredCourse.course?._id}`} className="btn btn-primary inline-flex items-center gap-2">
                  Continue Learning <Play className="w-4 h-4 fill-current" />
                </Link>
              </div>
              <div className="flex-shrink-0 relative w-24 h-24 flex items-center justify-center rounded-full bg-surface shadow-soft border-4 border-coral">
                <span className="font-display text-xl text-coral">{featuredCourse.progressPercent}%</span>
              </div>
            </motion.div>
          )}

          {/* Courses in Progress Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl text-text-primary">Courses In Progress</h2>
              <Link to="/dashboard/enrolled" className="text-coral font-semibold hover:underline">View All</Link>
            </div>
            
            {loading ? (
               <div className="grid sm:grid-cols-2 gap-4">
                 {[...Array(2)].map((_, i) => <div key={i} className="bg-surface rounded-[20px] p-5 h-48 animate-pulse" />)}
               </div>
            ) : inProgress.length === 0 ? (
              <div className="bg-surface rounded-[20px] p-8 text-center border border-gray-100">
                <p className="text-text-body mb-4">You have no active courses right now.</p>
                <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-5">
                {inProgress.map((e) => (
                  <div key={e._id} className="bg-surface rounded-[20px] p-5 border border-gray-100 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform">
                    <div className="mb-4">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold mb-3">Deadline approaching</span>
                      <h3 className="font-display text-lg text-text-primary leading-tight mb-2 line-clamp-2">
                        {e.course?.title}
                      </h3>
                      <p className="text-sm text-text-muted line-clamp-2">
                        {e.course?.description || 'Resume your learning journey and complete upcoming modules.'}
                      </p>
                    </div>
                    
                    <div className="mt-auto">
                      <div className="flex items-center gap-2 text-sm text-text-primary font-semibold mb-4">
                        <Clock className="w-4 h-4" /> 
                        <span>{e.completedLessons?.length || 0} / {e.course?.lessons?.length || 10} Modules</span>
                      </div>
                      
                      <div className="flex items-center justify-between gap-4">
                        <Link to={`/learn/${e.course?.slug || e.course?._id}`} className="btn btn-outline flex-1 text-center py-2">
                          Go to course
                        </Link>
                        <div className="w-12 h-12 rounded-full border-2 border-sage flex items-center justify-center text-sm font-bold text-sage">
                          {e.progressPercent}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Sidebar Widgets) */}
        <div className="space-y-6">
          
          {/* Today's Schedule */}
          <div className="bg-surface rounded-[20px] p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center text-sage">
                <Calendar className="w-5 h-5" />
              </div>
              <h2 className="font-display text-xl text-text-primary">Today's Schedule</h2>
            </div>
            
            <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-gray-100">
              {inProgress.length > 0 ? (
                inProgress.slice(0, 3).map((e, idx) => (
                  <div key={e._id} className="relative pl-8">
                    <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-surface ${idx === 0 ? 'bg-coral' : idx === 1 ? 'bg-sage' : 'bg-gray-300'}`} />
                    <h4 className="font-bold text-text-primary text-sm line-clamp-1">{e.course?.title}</h4>
                    <p className="text-xs text-text-muted">
                      {e.completedLessons?.length || 0} / {e.course?.totalLessons || e.course?.lessons?.length || 10} Lessons Completed
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-text-muted pl-4">No active courses scheduled for today.</p>
              )}
            </div>
          </div>

          {/* Gamification / Stats */}
          <div className="bg-surface rounded-[20px] p-6 border border-gray-100 shadow-sm">
            <h2 className="font-display text-xl text-text-primary mb-4">Your Stats</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-coral-light/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-coral flex items-center justify-center text-white">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-text-primary">Total XP</span>
                </div>
                <span className="font-display text-xl text-coral">{user?.xpPoints || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-sage-light/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center text-white">
                    <Flame className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-text-primary">Day Streak</span>
                </div>
                <span className="font-display text-xl text-sage">{user?.streak || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-text-primary">Completed</span>
                </div>
                <span className="font-display text-xl text-yellow-600">{completed.length}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
