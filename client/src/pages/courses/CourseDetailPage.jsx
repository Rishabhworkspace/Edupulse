import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import toast from 'react-hot-toast';

import CourseHero from '@/components/courses/CourseHero';
import CourseAbout from '@/components/courses/CourseAbout';
import CourseInstructor from '@/components/courses/CourseInstructor';
import CourseOutcomes from '@/components/courses/CourseOutcomes';
import CourseCurriculum from '@/components/courses/CourseCurriculum';
import CourseReviews from '@/components/courses/CourseReviews';
import CourseSidebar from '@/components/courses/CourseSidebar';

export default function CourseDetailPage() {
  const { slug } = useParams();
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ average: 0, count: 0 });

  useEffect(() => {
    let cancelled = false;

    const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
      for (let i = 0; i < retries; i++) {
        try {
          return await api.get(url);
        } catch (err) {
          const status = err.response?.status;
          // Retry on 429 (rate limit) or 5xx server errors
          if ((status === 429 || (status >= 500 && status < 600)) && i < retries - 1) {
            await new Promise(r => setTimeout(r, delay * (i + 1)));
            continue;
          }
          throw err;
        }
      }
    };

    const loadCourse = async () => {
      try {
        const { data } = await fetchWithRetry(`/courses/${slug}`);
        if (cancelled) return;
        setCourse(data.data);
        if (data.data._id) {
          try {
            const { data: reviewData } = await api.get(`/courses/${data.data._id}/reviews`);
            if (!cancelled) {
              setReviews(reviewData.data || []);
              setReviewStats(data.data.ratings || { average: data.data.rating, count: data.data.totalReviews });
            }
          } catch (e) {
            console.error('Failed to load reviews:', e);
          }
        }
      } catch (err) {
        if (cancelled) return;
        if (err.response?.status === 404) {
          setError('Course not found');
        } else if (err.response?.status === 429) {
          setError('Server is busy. Please try again in a moment.');
        } else {
          setError('Failed to load course');
        }
        console.error('Failed to load course:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadCourse();
    return () => { cancelled = true; };
  }, [slug]);

  const handleEnroll = async () => {
    if (!user) return navigate('/login');
    if (course.price > 0) return navigate(`/checkout/${course.slug}`);
    try {
      await api.post(`/courses/${course._id}/enroll`);
      toast.success('Enrolled successfully!');
      setCourse({ ...course, isEnrolled: true });
    } catch (err) { toast.error(err.response?.data?.message || 'Enrollment failed'); }
  };

  const handleReviewSubmit = async (newReview) => {
    const { data } = await api.post(`/courses/${course._id}/reviews`, newReview);
    setReviews([data.data, ...reviews.filter(r => r.user._id !== user?._id)]);
    toast.success('Review submitted successfully!');
  };

  if (loading) return (
    <div className="section">
      <div className="container">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-6 w-full" />)}
          </div>
          <div className="skeleton h-80 rounded-xl" />
        </div>
      </div>
    </div>
  );
  if (error || !course) return (
    <div className="section text-center py-16">
      <h2 className="font-display text-xl mb-2" style={{ color: 'var(--text-primary)' }}>{error || 'Course not found'}</h2>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Please try again later or return to the courses page.</p>
      <button onClick={() => window.location.reload()} className="btn btn-primary mt-4">Try Again</button>
    </div>
  );

  return (
    <div className="section">
      <div className="container">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <CourseHero course={course} reviewStats={reviewStats} />
              <CourseAbout longDescription={course.longDescription} />
              <CourseInstructor instructor={course.instructor} />
              <CourseOutcomes outcomes={course.outcomes} />
              <CourseCurriculum curriculum={course.curriculum} />
              <CourseReviews reviews={reviews} isEnrolled={course.isEnrolled} onSubmitReview={handleReviewSubmit} />
            </motion.div>
          </div>
          <CourseSidebar course={course} isEnrolled={course.isEnrolled} onEnroll={handleEnroll} />
        </div>
      </div>
    </div>
  );
}