import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

export function useCourse(slug) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourse = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/courses/${slug}`);
      setCourse(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const refetch = useCallback(() => {
    fetchCourse();
  }, [fetchCourse]);

  return { course, loading, error, refetch };
}

export function useCourses(query = {}) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/courses', { params: query });
      setCourses(data.data);
      setMeta(data.meta);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(query)]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, loading, error, meta, refetch: fetchCourses };
}