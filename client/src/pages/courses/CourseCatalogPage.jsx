import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Star, Clock, Users, BookOpen, ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import api from '@/lib/api';
import CourseCard from '@/components/shared/CourseCard';

const levels = ['All', 'beginner', 'intermediate', 'advanced'];
const categories = ['All', 'Web Development', 'Data Science', 'Mobile Development', 'UI/UX Design', 'Cloud & DevOps', 'Cybersecurity'];

export default function CourseCatalogPage() {
  const [params, setParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(params.get('search') || '');
  const [level, setLevel] = useState(params.get('level') || 'All');
  const [category, setCategory] = useState(params.get('category') || 'All');
  const [priceRange, setPriceRange] = useState(params.get('priceMax') || 'all');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.set('search', search);
      if (level !== 'All') q.set('level', level);
      if (category !== 'All') q.set('category', category);
      if (priceRange !== 'all') {
        if (priceRange === 'free') q.set('priceMax', '0');
        else if (priceRange === 'paid') { q.set('priceMin', '1'); q.set('priceMax', '999999'); }
        else if (priceRange === '0-500') { q.set('priceMin', '0'); q.set('priceMax', '500'); }
        else if (priceRange === '500-1000') { q.set('priceMin', '500'); q.set('priceMax', '1000'); }
        else if (priceRange === '1000+') { q.set('priceMin', '1000'); }
      }
      q.set('page', params.get('page') || '1');
      const { data } = await api.get(`/courses?${q}`);
      setCourses(data.data);
      setTotal(data.pagination?.total || 0);
      setPagination({
        page: parseInt(data.pagination?.page || 1),
        totalPages: Math.ceil((data.pagination?.total || 0) / (data.pagination?.limit || 12))
      });
    } catch {} finally { setLoading(false); }
  };

  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    const newParams = new URLSearchParams(params);
    newParams.set('page', newPage.toString());
    setParams(newParams);
  };

  useEffect(() => { fetchCourses(); }, [search, level, category, priceRange, params.get('page')]);

  return (
    <div className="section">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Explore Courses</h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>Discover {total} courses across all categories</p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input type="text" className="input" style={{ paddingLeft: '2.5rem' }} placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="btn btn-secondary flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="card p-4 mb-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-2" style={{ color: 'var(--text-secondary)' }}>Level</label>
                <div className="flex flex-wrap gap-2">
                  {levels.map((l) => (
                    <button key={l} onClick={() => { setLevel(l); setParams(new URLSearchParams({ ...Object.fromEntries(params), level: l === 'All' ? '' : l })); }} className={`btn btn-sm ${level === l ? 'btn-primary' : 'btn-secondary'}`} style={{ textTransform: 'capitalize' }}>{l}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold block mb-2" style={{ color: 'var(--text-secondary)' }}>Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button key={c} onClick={() => { setCategory(c); const newParams = new URLSearchParams(params); c === 'All' ? newParams.delete('category') : newParams.set('category', c); setParams(newParams); }} className={`btn btn-sm ${category === c ? 'btn-primary' : 'btn-secondary'}`}>{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold block mb-2" style={{ color: 'var(--text-secondary)' }}>Price</label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { setPriceRange('all'); const newParams = new URLSearchParams(params); newParams.delete('priceMin'); newParams.delete('priceMax'); setParams(newParams); }} className={`btn btn-sm ${priceRange === 'all' ? 'btn-primary' : 'btn-secondary'}`}>All</button>
                  <button onClick={() => { setPriceRange('free'); const newParams = new URLSearchParams(params); newParams.set('priceMax', '0'); setParams(newParams); }} className={`btn btn-sm ${priceRange === 'free' ? 'btn-primary' : 'btn-secondary'}`}>Free</button>
                  <button onClick={() => { setPriceRange('0-500'); const newParams = new URLSearchParams(params); newParams.set('priceMin', '0'); newParams.set('priceMax', '500'); setParams(newParams); }} className={`btn btn-sm ${priceRange === '0-500' ? 'btn-primary' : 'btn-secondary'}`}>₹0-500</button>
                  <button onClick={() => { setPriceRange('500-1000'); const newParams = new URLSearchParams(params); newParams.set('priceMin', '500'); newParams.set('priceMax', '1000'); setParams(newParams); }} className={`btn btn-sm ${priceRange === '500-1000' ? 'btn-primary' : 'btn-secondary'}`}>₹500-1000</button>
                  <button onClick={() => { setPriceRange('1000+'); const newParams = new URLSearchParams(params); newParams.set('priceMin', '1000'); setParams(newParams); }} className={`btn btn-sm ${priceRange === '1000+' ? 'btn-primary' : 'btn-secondary'}`}>₹1000+</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Level buttons (simplified when filters hidden) */}
        {!showFilters && (
          <div className="flex gap-2 mb-6">
            {levels.map((l) => (
              <button key={l} onClick={() => { setLevel(l); const newParams = new URLSearchParams(params); level === 'All' ? newParams.delete('level') : newParams.set('level', l); setParams(newParams); }} className={`btn btn-sm ${level === l ? 'btn-primary' : 'btn-secondary'}`} style={level !== l ? { textTransform: 'capitalize' } : { textTransform: 'capitalize' }}>
                {l}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="skeleton h-44 rounded-none" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-4 w-2/3" />
                  <div className="skeleton h-3 w-full" />
                  <div className="skeleton h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-14 h-14 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <h3 className="font-display text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No courses found</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course, i) => (
              <motion.div key={course._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button onClick={() => goToPage(pagination.page - 1)} disabled={pagination.page === 1} className="btn btn-secondary btn-sm" style={{ opacity: pagination.page === 1 ? 0.5 : 1 }}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm px-3" style={{ color: 'var(--text-secondary)' }}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button onClick={() => goToPage(pagination.page + 1)} disabled={pagination.page === pagination.totalPages} className="btn btn-secondary btn-sm" style={{ opacity: pagination.page === pagination.totalPages ? 0.5 : 1 }}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
