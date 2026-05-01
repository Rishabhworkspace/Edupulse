import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import api from '@/lib/api';

export function useEnrollment(courseId) {
  const { user } = useSelector((s) => s.auth);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEnrollment = useCallback(async () => {
    if (!user || !courseId) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/users/me/enrollments');
      const found = data.data?.find((e) => e.course?._id === courseId);
      setEnrollment(found || null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load enrollment');
    } finally {
      setLoading(false);
    }
  }, [user, courseId]);

  useEffect(() => {
    fetchEnrollment();
  }, [fetchEnrollment]);

  const markComplete = useCallback(async (lessonId) => {
    if (!courseId) return;
    try {
      const { data } = await api.patch(`/courses/${courseId}/lessons/${lessonId}/progress`);
      setEnrollment((prev) => ({ ...prev, ...data.data }));
      return data.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to mark complete');
    }
  }, [courseId]);

  const enroll = useCallback(async () => {
    if (!courseId) return;
    try {
      const { data } = await api.post(`/courses/${courseId}/enroll`);
      await fetchEnrollment();
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to enroll');
    }
  }, [courseId, fetchEnrollment]);

  return { enrollment, loading, error, refetch: fetchEnrollment, markComplete, enroll };
}