import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Star, Clock, Users, BookOpen, CheckCircle, Play, ChevronDown, ChevronUp, Award, Globe, BarChart3 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function CourseDetailPage() {
  const { slug } = useParams();
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ average: 0, count: 0 });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    api.get(`/courses/${slug}`).then(async ({ data }) => {
      setCourse(data.data);
      if (data.data._id) {
        try {
          const { data: reviewData } = await api.get(`/courses/${data.data._id}/reviews`);
          setReviews(reviewData.data || []);
          setReviewStats(data.data.ratings || { average: data.data.rating, count: data.data.totalReviews });
        } catch (e) {
          console.error('Failed to load reviews');
        }
      }
      setLoading(false);
    }).catch(() => { setLoading(false); toast.error('Course not found'); });
  }, [slug]);

  const handleEnroll = async () => {
    if (!user) return navigate('/login');
    if (course.price > 0) return navigate(`/checkout/${course._id}`);
    try {
      await api.post(`/courses/${course._id}/enroll`);
      toast.success('Enrolled successfully!');
      setCourse({ ...course, isEnrolled: true });
    } catch (err) { toast.error(err.response?.data?.message || 'Enrollment failed'); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/courses/${course._id}/reviews`, newReview);
      setReviews([data.data, ...reviews.filter(r => r.user._id !== user?._id)]);
      setShowReviewModal(false);
      toast.success('Review submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <div className="section"><div className="container"><div className="grid lg:grid-cols-3 gap-8"><div className="lg:col-span-2 space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-6 w-full" />)}</div><div className="skeleton h-80 rounded-xl" /></div></div></div>;
  if (!course) return <div className="section text-center"><h2 className="font-display text-xl" style={{ color: 'var(--text-primary)' }}>Course not found</h2></div>;

  return (
    <div className="section">
      <div className="container">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <span className="badge badge-primary mb-3 capitalize">{course.level}</span>
              <h1 className="font-display text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{course.title}</h1>
              <p className="text-base mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{course.description || course.shortDescription}</p>

              <div className="flex flex-wrap items-center gap-4 mb-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-secondary" /><b>{reviewStats?.average || course.rating || 'New'}</b> ({reviewStats?.count || course.totalReviews || 0} reviews)</span>
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{course.enrolledCount} enrolled</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{course.totalLessons} lessons</span>
                <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" />{course.language || 'English'}</span>
              </div>

              {/* Instructor */}
              <div className="card p-4 flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">{course.instructor?.avatar ? <img src={course.instructor.avatar} alt="" className="w-12 h-12 rounded-full object-cover" /> : <span className="text-lg font-bold text-primary">{course.instructor?.name?.[0]}</span>}</div>
                <div><p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{course.instructor?.name}</p><p className="text-xs" style={{ color: 'var(--text-muted)' }}>Instructor</p></div>
              </div>

              {/* What you'll learn */}
              {course.outcomes?.length > 0 && (
                <div className="card p-6 mb-8">
                  <h3 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>What you'll learn</h3>
                  <div className="grid md:grid-cols-2 gap-3">{course.outcomes.map((o, i) => (<div key={i} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" /><span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{o}</span></div>))}</div>
                </div>
              )}

              {/* Curriculum */}
              {course.curriculum?.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Course Curriculum</h3>
                  <div className="space-y-2">
                    {course.curriculum.map((sec, si) => (
                      <div key={sec._id} className="card overflow-hidden">
                        <button onClick={() => setOpenSection(openSection === si ? -1 : si)} className="w-full flex items-center justify-between p-4 text-left" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
                          <span className="font-semibold text-sm">{sec.title}</span>
                          <div className="flex items-center gap-2"><span className="text-xs" style={{ color: 'var(--text-muted)' }}>{sec.lessons?.length || 0} lessons</span>{openSection === si ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</div>
                        </button>
                        {openSection === si && sec.lessons?.map((les) => (
                          <div key={les._id} className="flex items-center justify-between px-4 py-2.5 border-t" style={{ borderColor: 'var(--border)' }}>
                            <div className="flex items-center gap-2.5"><Play className="w-3.5 h-3.5" style={{ color: les.isPreview ? '#5C5FEF' : 'var(--text-muted)' }} /><span className="text-sm" style={{ color: 'var(--text-primary)' }}>{les.title}</span>{les.isPreview && <span className="badge badge-primary text-[10px]">Preview</span>}</div>
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{les.videoDuration ? `${Math.floor(les.videoDuration / 60)}:${String(les.videoDuration % 60).padStart(2, '0')}` : ''}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Student Reviews</h3>
                  {course.isEnrolled && (
                    <button onClick={() => setShowReviewModal(true)} className="btn btn-secondary btn-sm">Leave a Review</button>
                  )}
                </div>
                
                {reviews.length === 0 ? (
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to review this course!</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map(review => (
                      <div key={review._id} className="card p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {review.user?.avatar ? <img src={review.user.avatar} className="w-8 h-8 rounded-full object-cover" /> : <span className="font-bold text-primary text-xs">{review.user?.name?.[0]}</span>}
                          </div>
                          <div>
                            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{review.user?.name}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-secondary fill-secondary' : 'text-gray-300'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        {review.comment && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{review.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="w-full h-44 object-cover rounded-lg mb-5" />}
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-display text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{course.price === 0 ? 'Free' : `₹${course.price}`}</span>
                {course.originalPrice > course.price && <span className="text-base line-through" style={{ color: 'var(--text-muted)' }}>₹{course.originalPrice}</span>}
              </div>
              {course.originalPrice > course.price && (<p className="text-sm font-semibold text-success mb-4">{Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% off</p>)}
              
              {course.isEnrolled ? (
                <Link to={`/learn/${course.slug}`} className="btn btn-primary w-full btn-lg no-underline mb-4">Continue Learning</Link>
              ) : (
                <button onClick={handleEnroll} className="btn btn-primary w-full btn-lg mb-4">{course.price === 0 ? 'Enroll Now — Free' : 'Buy Now'}</button>
              )}

              <div className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex items-center gap-2.5"><BookOpen className="w-4 h-4" />{course.totalLessons} lessons</div>
                <div className="flex items-center gap-2.5"><BarChart3 className="w-4 h-4" />{course.level} level</div>
                <div className="flex items-center gap-2.5"><Globe className="w-4 h-4" />{course.language || 'English'}</div>
                {course.certificate && <div className="flex items-center gap-2.5"><Award className="w-4 h-4 text-secondary" />Certificate of completion</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Leave a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="bg-transparent border-none cursor-pointer"
                    >
                      <Star className={`w-8 h-8 ${star <= newReview.rating ? 'text-secondary fill-secondary' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Comment (optional)</label>
                <textarea
                  className="input min-h-[100px] py-2"
                  placeholder="Share your experience with this course..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowReviewModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Review</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
