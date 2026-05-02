import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Save, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotesPanel({ courseId, lessonId }) {
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!courseId || !lessonId) return;
    
    // Fetch existing note for this lesson
    api.get(`/courses/${courseId}/enrollment`)
      .then(({ data }) => {
        const enrollment = data.data;
        const existing = enrollment?.notes?.find(n => n.lesson?.toString() === lessonId);
        if (existing) setNote(existing.content);
        else setNote('');
      })
      .catch(() => {});
  }, [courseId, lessonId]);

  const handleSave = async () => {
    if (!courseId || !lessonId) return;
    setSaving(true);
    try {
      await api.patch(`/courses/${courseId}/lessons/${lessonId}/notes`, { content: note });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast.error('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display text-lg font-bold text-text-primary">📝 My Notes</h4>
        <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Auto-saves on request</span>
      </div>
      
      <textarea 
        value={note} 
        onChange={e => setNote(e.target.value)} 
        placeholder="Type your notes here... use them to remember key concepts or code snippets."
        rows={12} 
        className="input w-full p-4 text-sm leading-relaxed resize-none bg-surface border-gray-100 mb-4"
      />

      <div className="flex justify-end">
        <button 
          onClick={handleSave} 
          disabled={saving}
          className={`btn btn-sm flex items-center gap-2 transition-all ${saved ? 'bg-green-50 text-green-600 border-green-200' : 'btn-primary'}`}
        >
          {saved ? (
            <><CheckCircle className="w-4 h-4" /> Saved!</>
          ) : (
            <><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Note'}</>
          )}
        </button>
      </div>
    </div>
  );
}