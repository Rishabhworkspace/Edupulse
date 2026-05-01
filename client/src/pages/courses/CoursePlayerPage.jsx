import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, CheckCircle, ChevronDown, ChevronUp, ArrowLeft, Menu, X, MessageCircle, Send, ThumbsUp, Check, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function CoursePlayerPage() {
  const { courseSlug } = useParams();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [openSections, setOpenSections] = useState([0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showQA, setShowQA] = useState(false);
  const [discussions, setDiscussions] = useState([]);
  const [qaLoading, setQaLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/courses/${courseSlug}`);
        setCourse(data.data);
        // Find first lesson
        const firstSection = data.data.curriculum?.[0];
        if (firstSection?.lessons?.[0]) setActiveLesson(firstSection.lessons[0]);
        // Get enrollment for progress
        const { data: enrollData } = await api.get(`/users/me/enrollments`);
        const found = enrollData.data?.find((e) => e.course?._id === data.data._id || e.course?.slug === courseSlug);
        if (found) setEnrollment(found);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, [courseSlug]);

  useEffect(() => {
    if (showQA && course?._id) loadDiscussions();
  }, [showQA, course?._id, activeLesson?._id]);

  useEffect(() => {
    // Reset quiz when switching lessons
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  }, [activeLesson?._id]);

  const toggleSection = (i) => setOpenSections((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);

  const markComplete = async (lessonId) => {
    if (!course) return;
    try {
      const { data } = await api.patch(`/courses/${course._id}/lessons/${lessonId}/progress`);
      setEnrollment((prev) => ({ ...prev, ...data.data, completedLessons: [...(prev?.completedLessons || []), lessonId] }));
      toast.success('Lesson completed!');
    } catch {}
  };

  const isCompleted = (lessonId) => enrollment?.completedLessons?.includes(lessonId);

  const loadDiscussions = async () => {
    if (!course?._id) return;
    setQaLoading(true);
    try {
      const { data } = await api.get(`/courses/${course._id}/discussions${activeLesson?._id ? `?lessonId=${activeLesson._id}` : ''}`);
      setDiscussions(data.data || []);
    } catch {} finally { setQaLoading(false); }
  };

  const postQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    try {
      const { data } = await api.post(`/courses/${course._id}/discussions`, {
        content: newQuestion,
        lessonId: activeLesson?._id,
      });
      setDiscussions([data.data, ...discussions]);
      setNewQuestion('');
      toast.success('Question posted!');
    } catch { toast.error('Failed to post'); }
  };

  const upvoteQuestion = async (id) => {
    try {
      const { data } = await api.post(`/courses/${course._id}/discussions/${id}/upvote`);
      setDiscussions(discussions.map((d) => d._id === id ? { ...d, upvotes: data.data.upvotes } : d));
    } catch {}
  };

  const handleQuizSubmit = () => {
    if (!activeLesson?.questions) return;
    let score = 0;
    activeLesson.questions.forEach((q, i) => {
      if (quizAnswers[i] === q.correctIndex) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    if (score === activeLesson.questions.length) {
      markComplete(activeLesson._id);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" /></div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center"><p>Course not found</p></div>;

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside className={`fixed lg:relative top-0 left-0 bottom-0 z-40 w-80 border-r flex flex-col transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden'}`} style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="h-14 flex items-center justify-between px-4 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <Link to={`/course/${courseSlug}`} className="flex items-center gap-2 text-sm font-medium no-underline" style={{ color: 'var(--text-secondary)' }}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X className="w-5 h-5" /></button>
        </div>

        {/* Progress */}
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Progress</span>
            <span className="text-xs font-bold text-primary">{enrollment?.progressPercent || 0}%</span>
          </div>
          <div className="progress-track"><div className="progress-bar" style={{ width: `${enrollment?.progressPercent || 0}%` }} /></div>
          {enrollment?.isCompleted && enrollment?.certificateUrl && (
            <a href={enrollment.certificateUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary w-full mt-3 flex items-center justify-center gap-2">
              🏆 View Certificate
            </a>
          )}
        </div>

        {/* Curriculum */}
        <div className="flex-1 overflow-y-auto">
          {course.curriculum?.map((sec, si) => (
            <div key={sec._id}>
              <button onClick={() => toggleSection(si)} className="w-full flex items-center justify-between px-4 py-3 text-left border-b" style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-primary)' }}>
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{sec.title}</span>
                {openSections.includes(si) ? <ChevronUp className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} /> : <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />}
              </button>
              {openSections.includes(si) && sec.lessons?.map((les) => (
                <button
                  key={les._id}
                  onClick={() => { setActiveLesson(les); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${activeLesson?._id === les._id ? 'bg-primary/8' : 'hover:bg-[var(--bg-secondary)]'}`}
                  style={{ background: activeLesson?._id === les._id ? '#5C5FEF10' : 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
                >
                  {isCompleted(les._id) ? <CheckCircle className="w-4 h-4 text-success flex-shrink-0" /> : <Play className="w-4 h-4 flex-shrink-0" style={{ color: activeLesson?._id === les._id ? '#5C5FEF' : 'var(--text-muted)' }} />}
                  <span className="flex-1 truncate">{les.title}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="h-14 flex items-center gap-3 px-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><Menu className="w-5 h-5" /></button>
          <h2 className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{activeLesson?.title || 'Select a lesson'}</h2>
        </div>

        <div className="p-6 max-w-4xl mx-auto">
          {/* Media/Quiz Area */}
          <div className="rounded-xl overflow-hidden mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            {activeLesson?.type === 'quiz' ? (
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Quiz: {activeLesson.title}</h3>
                {!activeLesson.questions || activeLesson.questions.length === 0 ? (
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No questions available for this quiz.</p>
                ) : (
                  <div className="space-y-6">
                    {activeLesson.questions.map((q, qIndex) => (
                      <div key={qIndex} className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                        <p className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                          {qIndex + 1}. {q.question}
                        </p>
                        <div className="space-y-2">
                          {q.options.map((opt, oIndex) => {
                            const isSelected = quizAnswers[qIndex] === oIndex;
                            const isCorrect = q.correctIndex === oIndex;
                            const isWrong = quizSubmitted && isSelected && !isCorrect;
                            const showSuccess = quizSubmitted && isCorrect;

                            return (
                              <label
                                key={oIndex}
                                className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors border ${
                                  showSuccess ? 'border-success bg-success/10' :
                                  isWrong ? 'border-error bg-error/10' :
                                  isSelected ? 'border-primary bg-primary/5' :
                                  'border-transparent hover:bg-black/5 dark:hover:bg-white/5'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${qIndex}`}
                                  value={oIndex}
                                  checked={isSelected}
                                  onChange={() => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [qIndex]: oIndex })}
                                  disabled={quizSubmitted}
                                  className="w-4 h-4 text-primary"
                                />
                                <span className={`text-sm ${showSuccess ? 'text-success' : isWrong ? 'text-error' : ''}`} style={{ color: (!showSuccess && !isWrong) ? 'var(--text-secondary)' : undefined }}>
                                  {opt}
                                </span>
                                {showSuccess && <CheckCircle className="w-4 h-4 text-success ml-auto" />}
                                {isWrong && <X className="w-4 h-4 text-error ml-auto" />}
                              </label>
                            );
                          })}
                        </div>
                        {quizSubmitted && q.explanation && (
                          <div className="mt-3 p-3 rounded-md text-sm border border-primary/20 bg-primary/5" style={{ color: 'var(--text-secondary)' }}>
                            <strong className="text-primary">Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                      {quizSubmitted ? (
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                            Score: {quizScore} / {activeLesson.questions.length}
                          </span>
                          {quizScore === activeLesson.questions.length ? (
                            <span className="badge badge-success">Perfect! Lesson Completed.</span>
                          ) : (
                            <button
                              onClick={() => {
                                setQuizSubmitted(false);
                                setQuizAnswers({});
                              }}
                              className="btn btn-secondary btn-sm"
                            >
                              Retry Quiz
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={handleQuizSubmit}
                          disabled={Object.keys(quizAnswers).length < activeLesson.questions.length}
                          className="btn btn-primary"
                        >
                          Submit Quiz
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full" style={{ background: '#000', aspectRatio: '16/9' }}>
                {activeLesson?.videoUrl ? (
                  <video src={activeLesson.videoUrl} controls className="w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Play className="w-16 h-16 text-white/30 mx-auto mb-3" />
                      <p className="text-white/50 text-sm">Video content</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Lesson info */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{activeLesson?.title}</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{activeLesson?.type || 'video'} • {activeLesson?.videoDuration ? `${Math.floor(activeLesson.videoDuration / 60)} min` : ''}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowQA(!showQA)} className={`btn btn-sm ${showQA ? 'btn-primary' : 'btn-secondary'}`}>
                <MessageCircle className="w-4 h-4" /> Q&A
              </button>
              {activeLesson && !isCompleted(activeLesson._id) && (
                <button onClick={() => markComplete(activeLesson._id)} className="btn btn-primary btn-sm">
                  <CheckCircle className="w-4 h-4" /> Mark Complete
                </button>
              )}
              {activeLesson && isCompleted(activeLesson._id) && (
                <span className="badge badge-success"><CheckCircle className="w-3 h-3" /> Completed</span>
              )}
            </div>
          </div>

          {/* Q&A Panel */}
          {showQA && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-4 mb-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <HelpCircle className="w-4 h-4" /> Questions & Answers
              </h4>
              
              {/* Post Question */}
              <form onSubmit={postQuestion} className="flex gap-2 mb-4">
                <input className="input flex-1" placeholder="Ask a question about this lesson..." value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} />
                <button type="submit" className="btn btn-primary btn-sm"><Send className="w-4 h-4" /></button>
              </form>

              {/* Questions List */}
              {qaLoading ? (
                <div className="text-center py-4"><div className="w-6 h-6 rounded-full border-2 border-primary/20 border-t-primary animate-spin mx-auto" /></div>
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
                            <button onClick={() => upvoteQuestion(d._id)} className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
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
          )}

          {activeLesson?.content && (
            <div className="card p-6">
              <div className="prose prose-sm max-w-none" style={{ color: 'var(--text-secondary)' }}>{activeLesson.content}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
