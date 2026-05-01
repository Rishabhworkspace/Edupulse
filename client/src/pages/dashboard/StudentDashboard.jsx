import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, TrendingUp, Play, Zap, Flame, Star, Download } from 'lucide-react';
import api from '@/lib/api';

export default function StudentDashboard() {
  const { user } = useSelector((s) => s.auth);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/me/enrollments').then(({ data }) => { setEnrollments(data.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const inProgress = enrollments.filter((e) => !e.isCompleted);
  const completed = enrollments.filter((e) => e.isCompleted);
  const avgProgress = enrollments.length ? Math.round(enrollments.reduce((a, e) => a + e.progressPercent, 0) / enrollments.length) : 0;

  const stats = [
    { icon: BookOpen, label: 'Enrolled Courses', value: enrollments.length, color: '#5C5FEF' },
    { icon: TrendingUp, label: 'Avg. Progress', value: `${avgProgress}%`, color: '#10B981' },
    { icon: Award, label: 'Completed', value: completed.length, color: '#F59E0B' },
    { icon: Clock, label: 'In Progress', value: inProgress.length, color: '#3B82F6' },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>My Dashboard</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Track your learning journey</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card p-5">
            <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center" style={{ background: `${color}15` }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <p className="font-display text-2xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{value}</p>
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Gamification */}
      {(user?.xpPoints > 0 || user?.badges?.length > 0) && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5 mb-8">
          <h2 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Your Achievements</h2>
          <div className="flex flex-wrap gap-4">
            {user?.xpPoints > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: '#5C5FEF15' }}>
                <Zap className="w-5 h-5 text-primary" />
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{user.xpPoints} XP</span>
              </div>
            )}
            {user?.streak > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: '#F59E0B15' }}>
                <Flame className="w-5 h-5" style={{ color: '#F59E0B' }} />
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{user.streak} day streak</span>
              </div>
            )}
            {user?.badges?.map((badge, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: '#10B98115' }}>
                <Star className="w-5 h-5" style={{ color: '#10B981' }} />
                <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{badge.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* In Progress */}
      <h2 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Continue Learning</h2>
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">{[...Array(3)].map((_, i) => <div key={i} className="card p-5"><div className="skeleton h-4 w-2/3 mb-3" /><div className="skeleton h-3 w-full mb-2" /><div className="skeleton h-2 w-full" /></div>)}</div>
      ) : inProgress.length === 0 ? (
        <div className="card p-8 text-center mb-8">
          <BookOpen className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>No courses in progress</p>
          <Link to="/courses" className="btn btn-primary btn-sm no-underline">Browse Courses</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {inProgress.map((e) => (
            <Link key={e._id} to={`/learn/${e.course?.slug || e.course?._id}`} className="card p-5 no-underline group hover:-translate-y-0.5 transition-transform">
              <div className="flex items-center gap-3 mb-3">
                {e.course?.thumbnail ? <img src={e.course.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover" /> : <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"><BookOpen className="w-5 h-5 text-primary" /></div>}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{e.course?.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{e.completedLessons?.length || 0} lessons done</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
                <span>Progress</span><span className="font-bold text-primary">{e.progressPercent}%</span>
              </div>
              <div className="progress-track"><div className="progress-bar" style={{ width: `${e.progressPercent}%` }} /></div>
            </Link>
          ))}
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <>
          <h2 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Completed Courses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completed.map((e) => (
              <div key={e._id} className="card p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0"><Award className="w-5 h-5 text-success" /></div>
                <div className="flex-1 min-w-0"><p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{e.course?.title}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Completed</p>
                  {e.certificateUrl && (
                    <a href={e.certificateUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary font-medium">
                      <Download className="w-3 h-3" /> Certificate
                    </a>
                  )}
                </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
