import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, CheckCircle, Search, Filter, Clock, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function QADashboardPage() {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchDiscussions = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      q.set('page', pagination.page);
      q.set('limit', '15');
      if (filter !== 'all') q.set('status', filter);
      const { data } = await api.get(`/courses/instructor/discussions?${q}`);
      setDiscussions(data.data || []);
      setPagination({
        page: parseInt(data.pagination?.page || 1),
        totalPages: Math.ceil((data.pagination?.total || 0) / 15),
        total: data.pagination?.total || 0
      });
    } catch (err) {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDiscussions(); }, [filter, pagination.page]);

  const handleResolve = async (discussion) => {
    try {
      await api.patch(`/courses/${discussion.course._id}/discussions/${discussion._id}/resolve`);
      toast.success('Question marked as resolved');
      fetchDiscussions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resolve');
    }
  };

  const filteredDiscussions = search 
    ? discussions.filter(d => 
        d.content?.toLowerCase().includes(search.toLowerCase()) ||
        d.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.course?.title?.toLowerCase().includes(search.toLowerCase())
      )
    : discussions;

  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Q&A Dashboard</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>View and answer questions from your students</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input 
            className="input" 
            style={{ paddingLeft: '2.5rem' }} 
            placeholder="Search questions..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['all', 'unresolved', 'resolved'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn btn-sm capitalize ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            >
              {f === 'all' ? 'All' : f === 'unresolved' ? 'Open' : 'Resolved'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {pagination.total} question{pagination.total !== 1 ? 's' : ''} total
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card p-5">
              <div className="skeleton h-4 w-3/4 mb-3" />
              <div className="skeleton h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredDiscussions.length === 0 ? (
        <div className="card p-12 text-center">
          <MessageCircle className="w-14 h-14 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h3 className="font-display text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No questions found</h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {filter === 'resolved' ? 'No resolved questions yet' : 
             filter === 'unresolved' ? 'All questions have been answered!' : 
             'Students haven\'t asked any questions yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDiscussions.map((d) => (
            <motion.div 
              key={d._id} 
              initial={{ opacity: 0, y: 8 }} 
              animate={{ opacity: 1, y: 0 }}
              className="card p-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {d.user?.avatar ? (
                    <img src={d.user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-primary">{d.user?.name?.[0] || '?'}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{d.user?.name || 'Anonymous'}</span>
                    {d.isResolved ? (
                      <span className="badge badge-success text-xs flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Resolved
                      </span>
                    ) : (
                      <span className="badge badge-warning text-xs">Open</span>
                    )}
                  </div>
                  
                  <Link 
                    to={`/course/${d.course?.slug}`} 
                    className="text-xs font-medium text-primary hover:underline mb-2 block"
                  >
                    {d.course?.title || 'Course'}
                    {d.lesson && <span className="text-text-muted font-normal"> • {d.lesson.title}</span>}
                  </Link>
                  
                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{d.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(d.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {d.upvotes?.length || 0} upvotes</span>
                    </div>
                    
                    {!d.isResolved && (
                      <div className="flex gap-2">
                        <Link 
                          to={`/learn/${d.course?.slug}`} 
                          className="btn btn-secondary btn-sm"
                        >
                          Reply
                        </Link>
                        <button 
                          onClick={() => handleResolve(d)}
                          className="btn btn-primary btn-sm flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" /> Mark Resolved
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button 
            onClick={() => goToPage(pagination.page - 1)} 
            disabled={pagination.page === 1} 
            className="btn btn-secondary btn-sm"
            style={{ opacity: pagination.page === 1 ? 0.5 : 1 }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm px-3" style={{ color: 'var(--text-secondary)' }}>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button 
            onClick={() => goToPage(pagination.page + 1)} 
            disabled={pagination.page === pagination.totalPages} 
            className="btn btn-secondary btn-sm"
            style={{ opacity: pagination.page === pagination.totalPages ? 0.5 : 1 }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}