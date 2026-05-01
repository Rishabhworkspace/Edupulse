import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Save, PlusCircle, Trash2, Upload, ArrowLeft, GripVertical, Plus, X } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const emptyQuestion = {
  question: '',
  options: [
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ],
  explanation: '',
};

const emptyLesson = { title: 'New Lesson', type: 'video', content: '', videoUrl: '', quiz: [] };

export default function CourseStudioPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!courseId;
  const [activeTab, setActiveTab] = useState('basic');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', shortDescription: '', description: '', category: '', level: 'beginner', language: 'English',
    price: 0, originalPrice: 0, outcomes: [''], requirements: [''], tags: '',
  });
const [curriculum, setCurriculum] = useState([{
  title: 'Section 1',
  lessons: [{ title: 'Lesson 1', type: 'video', content: '', videoUrl: '', quiz: [] }]
}]);

useEffect(() => {
  if (!isEdit) return;
  const load = async () => {
    try {
      const { data } = await api.get(`/courses/${courseId}/edit`);
      const c = data.data;
      setForm({
        title: c.title || '',
        shortDescription: c.shortDescription || '',
        description: c.description || '',
        category: c.category || '',
        level: c.level || 'beginner',
        language: c.language || 'English',
        price: c.price ?? 0,
        originalPrice: c.originalPrice ?? 0,
        outcomes: c.outcomes?.length ? c.outcomes : [''],
        requirements: c.requirements?.length ? c.requirements : [''],
        tags: c.tags?.join(', ') || '',
      });
      if (c.curriculum?.length) {
        setCurriculum(c.curriculum.map(sec => ({
          _id: sec._id,
          title: sec.title,
          lessons: (sec.lessons || []).map(les => ({
            _id: les._id,
            title: les.title,
            type: les.type || 'video',
            videoUrl: les.videoUrl || '',
            content: les.content || '',
            quiz: (les.questions || []).map(q => ({
              question: q.question || '',
              options: (q.options || []).map((opt, i) => ({
                text: opt,
                isCorrect: i === q.correctIndex,
              })),
              explanation: q.explanation || '',
            })),
          })),
        })));
      }
    } catch (err) {
      toast.error('Failed to load course');
    }
  };
  load();
}, [courseId, isEdit]);

const addOutcome = () => setForm({ ...form, outcomes: [...form.outcomes, ''] });
  const addSection = () => setCurriculum([...curriculum, { title: `Section ${curriculum.length + 1}`, lessons: [{ title: 'New Lesson', type: 'video', content: '', videoUrl: '', quiz: [] }] }]);
  const addLesson = (si) => { const c = [...curriculum]; c[si].lessons.push({ title: 'New Lesson', type: 'video', content: '', videoUrl: '', quiz: [] }); setCurriculum(c); };
  const addQuestion = (si, li) => {
    const c = [...curriculum];
    c[si].lessons[li].quiz.push({ ...emptyQuestion });
    setCurriculum(c);
  };
  const removeQuestion = (si, li, qi) => {
    const c = [...curriculum];
    c[si].lessons[li].quiz = c[si].lessons[li].quiz.filter((_, i) => i !== qi);
    setCurriculum(c);
  };
  const updateQuestion = (si, li, qi, field, value) => {
    const c = [...curriculum];
    c[si].lessons[li].quiz[qi][field] = value;
    setCurriculum(c);
  };
  const addOption = (si, li, qi) => {
    const c = [...curriculum];
    c[si].lessons[li].quiz[qi].options.push({ text: '', isCorrect: false });
    setCurriculum(c);
  };
  const removeOption = (si, li, qi, oi) => {
    const c = [...curriculum];
    c[si].lessons[li].quiz[qi].options = c[si].lessons[li].quiz[qi].options.filter((_, i) => i !== oi);
    setCurriculum(c);
  };
  const setCorrectOption = (si, li, qi, oi) => {
    const c = [...curriculum];
    c[si].lessons[li].quiz[qi].options = c[si].lessons[li].quiz[qi].options.map((o, i) => ({ ...o, isCorrect: i === oi }));
    setCurriculum(c);
  };

const handleSave = async (status) => {
    try {
      setSaving(true);
      let cId = courseId;
      
      // 1. Save Course Basic Info
      if (isEdit) {
        await api.patch(`/courses/${cId}`, { ...form });
      } else {
        const { data } = await api.post('/courses', { ...form });
        cId = data.data._id;
      }

      // 2. Format curriculum for sync
      const formattedCurriculum = curriculum.map(sec => ({
        title: sec.title,
        lessons: sec.lessons.map(les => {
          let questions = undefined;
          if (les.type === 'quiz') {
            questions = les.quiz.map(q => ({
              question: q.question,
              options: q.options.map(o => o.text),
              correctIndex: q.options.findIndex(o => o.isCorrect),
              explanation: q.explanation
            }));
          }
          return { ...les, questions };
        })
      }));

      // 3. Sync Curriculum
      await api.put(`/courses/${cId}/curriculum`, { curriculum: formattedCurriculum });

      // 4. Publish if needed
      if (status === 'published') {
        await api.patch(`/courses/${cId}/publish`);
      }
      
      toast.success(isEdit ? 'Course updated' : 'Course created');
      navigate('/instructor');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'pricing', label: 'Pricing' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/instructor')} className="btn btn-ghost btn-sm"><ArrowLeft className="w-4 h-4" /></button>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{isEdit ? 'Edit Course' : 'Create Course'}</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleSave('draft')} disabled={saving} className="btn btn-secondary btn-sm">Save Draft</button>
          <button onClick={() => handleSave('published')} disabled={saving} className="btn btn-primary btn-sm"><Save className="w-4 h-4" /> Publish</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-white text-primary shadow-sm' : ''}`} style={activeTab !== t.id ? { background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' } : { border: 'none', cursor: 'pointer' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Basic Info */}
      {activeTab === 'basic' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 space-y-4">
          <div><label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>Title *</label><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Complete Web Development Bootcamp" /></div>
          <div><label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>Short Description</label><input className="input" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} placeholder="Brief overview (1-2 sentences)" /></div>
          <div><label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>Full Description</label>
          <div className="rich-text-editor" style={{ background: 'var(--bg-card)' }}>
            <ReactQuill theme="snow" value={form.description} onChange={(value) => setForm({ ...form, description: value })} modules={{ toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link'], ['clean']] }} />
          </div>
        </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div><label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>Category</label><input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Web Development" /></div>
            <div><label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>Level</label><select className="input" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}><option>beginner</option><option>intermediate</option><option>advanced</option></select></div>
            <div><label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>Language</label><input className="input" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} /></div>
          </div>
          <div><label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>Learning Outcomes</label>
            {form.outcomes.map((o, i) => (<div key={i} className="flex gap-2 mb-2"><input className="input flex-1" value={o} onChange={(e) => { const a = [...form.outcomes]; a[i] = e.target.value; setForm({ ...form, outcomes: a }); }} placeholder={`Outcome ${i + 1}`} />{i > 0 && <button onClick={() => setForm({ ...form, outcomes: form.outcomes.filter((_, j) => j !== i) })} className="btn btn-ghost btn-sm text-danger"><Trash2 className="w-4 h-4" /></button>}</div>))}
            <button onClick={addOutcome} className="btn btn-ghost btn-sm text-primary"><PlusCircle className="w-4 h-4" /> Add Outcome</button>
          </div>
          <div><label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>Tags</label><input className="input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="react, javascript, web (comma separated)" /></div>
        </motion.div>
      )}

      {/* Curriculum */}
      {activeTab === 'curriculum' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {curriculum.map((sec, si) => (
            <div key={si} className="card p-5">
              <div className="flex items-center gap-3 mb-4">
                <GripVertical className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input className="input flex-1 font-semibold" value={sec.title} onChange={(e) => { const c = [...curriculum]; c[si].title = e.target.value; setCurriculum(c); }} />
                {curriculum.length > 1 && <button onClick={() => setCurriculum(curriculum.filter((_, j) => j !== si))} className="btn btn-ghost btn-sm text-danger"><Trash2 className="w-4 h-4" /></button>}
              </div>
              <div className="space-y-2 ml-7">
                {sec.lessons.map((les, li) => (
                  <div key={li} className="border rounded-lg p-3" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{si + 1}.{li + 1}</span>
                      <input className="input flex-1 text-sm" value={les.title} onChange={(e) => { const c = [...curriculum]; c[si].lessons[li].title = e.target.value; setCurriculum(c); }} />
                      <select className="input text-xs" style={{ width: 'auto' }} value={les.type} onChange={(e) => { const c = [...curriculum]; c[si].lessons[li].type = e.target.value; setCurriculum(c); }}>
                        <option value="video">Video</option><option value="text">Text</option><option value="quiz">Quiz</option>
                      </select>
                      {sec.lessons.length > 1 && <button onClick={() => { const c = [...curriculum]; c[si].lessons = c[si].lessons.filter((_, j) => j !== li); setCurriculum(c); }} className="btn btn-ghost btn-sm text-danger"><Trash2 className="w-3 h-3" /></button>}
                    </div>

                    {/* Video/Text content */}
                    {les.type === 'video' && (
                      <div className="mt-2 ml-6">
                        <input className="input text-xs" placeholder="Video URL (Cloudinary)" value={les.videoUrl || ''} onChange={(e) => { const c = [...curriculum]; c[si].lessons[li].videoUrl = e.target.value; setCurriculum(c); }} />
                      </div>
                    )}
                    {les.type === 'text' && (
                      <div className="mt-2 ml-6">
                        <textarea className="input text-xs" rows={3} placeholder="Lesson content..." value={les.content || ''} onChange={(e) => { const c = [...curriculum]; c[si].lessons[li].content = e.target.value; setCurriculum(c); }} />
                      </div>
                    )}

                    {/* Quiz Builder */}
                    {les.type === 'quiz' && (
                      <div className="mt-2 ml-6 space-y-3">
                        <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Questions</p>
                        {(les.quiz || []).map((q, qi) => (
                          <div key={qi} className="p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                            <div className="flex items-start gap-2">
                              <div className="flex-1 space-y-2">
                                <input className="input text-sm" placeholder={`Question ${qi + 1}`} value={q.question} onChange={(e) => updateQuestion(si, li, qi, 'question', e.target.value)} />
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Options (select the correct answer)</p>
                                {q.options.map((opt, oi) => (
                                  <div key={oi} className="flex items-center gap-2">
                                    <input type="radio" name={`quiz-${si}-${li}-${qi}`} checked={opt.isCorrect} onChange={() => setCorrectOption(si, li, qi, oi)} className="w-4 h-4" />
                                    <input className="input text-sm flex-1" placeholder={`Option ${oi + 1}`} value={opt.text} onChange={(e) => { const c = [...curriculum]; c[si].lessons[li].quiz[qi].options[oi].text = e.target.value; setCurriculum(c); }} />
                                    {q.options.length > 2 && <button onClick={() => removeOption(si, li, qi, oi)} className="text-danger"><X className="w-3 h-3" /></button>}
                                  </div>
                                ))}
                                <button onClick={() => addOption(si, li, qi)} className="btn btn-ghost btn-xs text-primary"><Plus className="w-3 h-3" /> Add Option</button>
                                <input className="input text-xs mt-2" placeholder="Explanation (shown after answer)" value={q.explanation || ''} onChange={(e) => updateQuestion(si, li, qi, 'explanation', e.target.value)} />
                              </div>
                              <button onClick={() => removeQuestion(si, li, qi)} className="text-danger"><X className="w-4 h-4" /></button>
                            </div>
                          </div>
                        ))}
                        <button onClick={() => addQuestion(si, li)} className="btn btn-secondary btn-sm"><Plus className="w-4 h-4" /> Add Question</button>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{les.quiz?.length || 0} question(s) in this quiz</p>
                      </div>
                    )}
                  </div>
                ))}
                <button onClick={() => addLesson(si)} className="btn btn-ghost btn-sm text-primary"><PlusCircle className="w-3.5 h-3.5" /> Add Lesson</button>
              </div>
            </div>
          ))}
          <button onClick={addSection} className="btn btn-secondary w-full"><PlusCircle className="w-4 h-4" /> Add Section</button>
        </motion.div>
      )}

      {/* Pricing */}
      {activeTab === 'pricing' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>Price (₹)</label><input type="number" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
            <div><label className="text-xs font-semibold block mb-1" style={{ color: 'var(--text-secondary)' }}>Original Price (₹)</label><input type="number" className="input" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })} /></div>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Set price to 0 for a free course. The original price is used to show the strikethrough price.</p>
        </motion.div>
      )}
    </div>
  );
}
