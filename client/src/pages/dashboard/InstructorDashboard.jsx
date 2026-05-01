import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign, BookOpen, Users, TrendingUp, PlusCircle, BarChart3, MessageCircle } from 'lucide-react';
import api from '@/lib/api';

export default function InstructorDashboard() {
  const [revenue, setRevenue] = useState({ totalPayout: 0, orderCount: 0 });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/payments/instructor-revenue').then(({ data }) => setRevenue(data.data)),
      api.get('/courses?instructor=me&limit=100').then(({ data }) => setCourses(data.data || [])),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const stats = [
    { icon: DollarSign, label: 'Total Earnings', value: `₹${revenue.totalPayout?.toLocaleString() || 0}`, color: '#10B981' },
    { icon: BookOpen, label: 'My Courses', value: courses.length, color: '#5C5FEF' },
    { icon: Users, label: 'Total Sales', value: revenue.orderCount || 0, color: '#F59E0B' },
    { icon: TrendingUp, label: 'Avg Rating', value: courses.length ? (courses.reduce((a, c) => a + (c.rating || 0), 0) / courses.length).toFixed(1) : '—', color: '#3B82F6' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Instructor Dashboard</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Manage your courses and earnings</p>
        </div>
        <Link to="/instructor/studio" className="btn btn-primary btn-sm no-underline"><PlusCircle className="w-4 h-4" /> New Course</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card p-5">
            <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center" style={{ background: `${color}15` }}><Icon className="w-5 h-5" style={{ color }} /></div>
            <p className="font-display text-2xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{value}</p>
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Quick Actions</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Link to="/instructor/qa" className="card p-5 flex items-center gap-4 no-underline group hover:border-primary/20" style={{ borderColor: 'var(--border)' }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#5C5FEF10' }}>
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Q&A Inbox</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>View student questions</p>
          </div>
        </Link>
      </div>

      <h2 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>My Courses</h2>
      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="card p-5"><div className="skeleton h-5 w-1/3 mb-2" /><div className="skeleton h-3 w-full" /></div>)}</div>
      ) : courses.length === 0 ? (
        <div className="card p-8 text-center">
          <BookOpen className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>You haven't created any courses yet</p>
          <Link to="/instructor/studio" className="btn btn-primary btn-sm no-underline">Create Your First Course</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((c) => (
            <div key={c._id} className="card p-5 flex items-center justify-between">
              <div className="flex items-center gap-4 min-w-0">
                {c.thumbnail ? <img src={c.thumbnail} alt="" className="w-16 h-10 rounded-lg object-cover flex-shrink-0" /> : <div className="w-16 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><BookOpen className="w-4 h-4 text-primary" /></div>}
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{c.title}</p>
                  <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span className="capitalize badge badge-neutral">{c.status}</span>
                    <span>{c.enrolledCount || 0} students</span>
                    <span>★ {c.rating || 'New'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/instructor/studio/${c._id}`} className="btn btn-ghost btn-sm no-underline">Edit</Link>
                <Link to={`/course/${c.slug}`} className="btn btn-secondary btn-sm no-underline">View</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
