import { useState, useEffect } from 'react';
import { BookOpen, GraduationCap } from 'lucide-react';
import api from '@/lib/api';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/courses?limit=100').then(({ data }) => { setCourses(data.data || []); setLoading(false); }).catch(() => setLoading(false)); }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Course Management</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>{['Course', 'Instructor', 'Status', 'Price', 'Enrolled', 'Rating'].map((h) => <th key={h} className="text-left text-xs font-semibold px-5 py-3" style={{ color: 'var(--text-muted)' }}>{h}</th>)}</tr></thead>
            <tbody>
              {loading ? [...Array(5)].map((_, i) => <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}><td colSpan={6} className="px-5 py-3"><div className="skeleton h-4 w-full" /></td></tr>) :
              courses.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
                    <GraduationCap className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <p className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No courses yet</p>
                  <p className="text-sm max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>Courses will appear here once instructors publish them</p>
                </td></tr>
              ) :
              courses.map((c) => (
                <tr key={c._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="px-5 py-3"><div className="flex items-center gap-3"><div className="w-10 h-7 rounded bg-primary/10 flex items-center justify-center flex-shrink-0"><BookOpen className="w-3.5 h-3.5 text-primary" /></div><span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)', maxWidth: 200, display: 'inline-block' }}>{c.title}</span></div></td>
                  <td className="px-5 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{c.instructor?.name || '—'}</td>
                  <td className="px-5 py-3"><span className={`badge capitalize ${c.status === 'published' ? 'badge-success' : c.status === 'draft' ? 'badge-neutral' : 'badge-warning'}`}>{c.status}</span></td>
                  <td className="px-5 py-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{c.price === 0 ? 'Free' : `₹${c.price}`}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{c.enrolledCount || 0}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>★ {c.rating || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
