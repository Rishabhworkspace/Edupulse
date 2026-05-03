import { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, PlusCircle, Trash2, ExternalLink, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = () => {
    setLoading(true);
    api.get('/courses?limit=100')
      .then(({ data }) => { setCourses(data.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;
    try {
      await api.delete(`/courses/${id}`);
      toast.success('Course deleted');
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete course');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Course Management</h1>
        <Link to="/instructor/studio" className="btn btn-primary btn-sm no-underline"><PlusCircle className="w-4 h-4" /> New Course</Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>{['Course', 'Instructor', 'Status', 'Price', 'Enrolled', 'Rating', 'Actions'].map((h) => <th key={h} className="text-left text-xs font-semibold px-5 py-3" style={{ color: 'var(--text-muted)' }}>{h}</th>)}</tr></thead>
            <tbody>
              {loading ? [...Array(5)].map((_, i) => <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}><td colSpan={7} className="px-5 py-3"><div className="skeleton h-4 w-full" /></td></tr>) :
              courses.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
                    <GraduationCap className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <p className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No courses yet</p>
                  <p className="text-sm max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>Courses will appear here once instructors publish them</p>
                </td></tr>
              ) :
              courses.map((c) => (
                <tr key={c._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="px-5 py-3"><div className="flex items-center gap-3"><div className="w-10 h-7 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">{c.thumbnail ? <img src={c.thumbnail} className="w-full h-full object-cover rounded" /> : <BookOpen className="w-3.5 h-3.5 text-primary" />}</div><span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)', maxWidth: 200, display: 'inline-block' }}>{c.title}</span></div></td>
                  <td className="px-5 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{c.instructor?.name || '—'}</td>
                  <td className="px-5 py-3"><span className={`badge capitalize ${c.status === 'published' ? 'badge-success' : c.status === 'draft' ? 'badge-neutral' : 'badge-warning'}`}>{c.status}</span></td>
                  <td className="px-5 py-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{c.price === 0 ? 'Free' : `₹${c.price}`}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{c.enrolledCount || 0}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>★ {c.rating || '—'}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link title="Edit" to={`/instructor/studio/${c._id}`} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: 'var(--text-muted)' }}><Edit className="w-4 h-4" /></Link>
                      <Link title="View" to={`/course/${c.slug}`} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: 'var(--text-muted)' }}><ExternalLink className="w-4 h-4" /></Link>
                      <button title="Delete" onClick={() => handleDelete(c._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
