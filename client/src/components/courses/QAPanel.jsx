import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Send, ThumbsUp, Check } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function QAPanel({ courseId, activeLessonId, show }) {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');

  useEffect(() => {
    if (show && courseId) loadDiscussions();
  }, [show, courseId, activeLessonId]);

  const loadDiscussions = async () => {
    setLoading(true);
    try {
      const url = activeLessonId ? `/courses/${courseId}/discussions?lessonId=${activeLessonId}` : `/courses/${courseId}/discussions`;
      const { data } = await api.get(url);
      setDiscussions(data.data || []);
    } catch (err) {
      console.error('Failed to load discussions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    try {
      const { data } = await api.post(`/courses/${courseId}/discussions`, {
        content: newQuestion,
        lessonId: activeLessonId,
      });
      setDiscussions([data.data, ...discussions]);
      setNewQuestion('');
      toast.success('Question posted!');
    } catch (err) {
      console.error('Failed to post question:', err);
      toast.error('Failed to post question');
    }
  };

  const handleUpvote = async (id) => {
    try {
      const { data } = await api.post(`/courses/${courseId}/discussions/${id}/upvote`);
      setDiscussions(discussions.map((d) => d._id === id ? { ...d, upvotes: data.data.upvotes } : d));
    } catch (err) {
      console.error('Failed to upvote:', err);
    }
  };

  if (!show) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-4 mb-6">
      <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
        <HelpCircle className="w-4 h-4" /> Questions & Answers
      </h4>

      <form onSubmit={handlePost} className="flex gap-2 mb-4">
        <input
          className="input flex-1"
          placeholder="Ask a question about this lesson..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <button type="submit" className="btn btn-primary btn-sm"><Send className="w-4 h-4" /></button>
      </form>

      {loading ? (
        <div className="text-center py-4">
          <div className="w-6 h-6 rounded-full border-2 border-primary/20 border-t-primary animate-spin mx-auto" />
        </div>
      ) : discussions.length === 0 ? (
        <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>No questions yet. Be the first to ask!</p>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {discussions.map((d) => (
            <div key={d._id} className="p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">{d.user?.name?.[0] || '?'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{d.user?.name}</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{d.content}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => handleUpvote(d._id)} className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <ThumbsUp className="w-3 h-3" /> {d.upvotes?.length || 0}
                    </button>
                    {d.isResolved && <span className="badge badge-success text-xs"><Check className="w-3 h-3" /> Resolved</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}