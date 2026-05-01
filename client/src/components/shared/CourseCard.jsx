import { Link } from 'react-router-dom';
import { Star, Users, Clock, BookOpen, Heart } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/store/slices/authSlice';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function CourseCard({ course }) {
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  const isWishlisted = user?.wishlist?.some((c) => (c._id || c) === course._id);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return toast.error('Please login to add to wishlist');

    try {
      const { data } = await api.patch(`/users/me/wishlist/${course._id}`);
      dispatch(setUser(data.data));
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <Link
      to={`/course/${course.slug}`}
      className="block no-underline group"
      style={{
        background: 'var(--color-surface)',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(26, 26, 46, 0.08)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(26,26,46,0.14)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(26,26,46,0.08)'; }}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/10', background: 'var(--gray-100)' }}>
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-10 h-10" style={{ color: 'var(--color-text-muted)' }} />
          </div>
        )}
        {/* Category tag */}
        <span
          className="absolute top-3 left-3 capitalize"
          style={{
            background: 'var(--color-coral-light)',
            color: 'var(--color-coral)',
            borderRadius: 6,
            padding: '3px 10px',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {course.level}
        </span>
        {/* Wishlist */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          style={{ background: 'var(--color-surface)', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(26,26,46,0.12)' }}
        >
          <Heart className="w-4 h-4" style={{ fill: isWishlisted ? '#EC4899' : 'transparent', color: isWishlisted ? '#EC4899' : 'var(--color-text-muted)' }} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: 16 }}>
        <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{course.category || 'General'}</p>
        <h3 className="line-clamp-2 mb-2" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 17, lineHeight: 1.4, color: 'var(--color-text-primary)' }}>{course.title}</h3>
        <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--color-text-body)', lineHeight: 1.5 }}>{course.shortDescription}</p>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5" style={{ color: 'var(--color-coral)' }} />
            {course.rating || 'New'}
          </span>
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.enrolledCount || 0}</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.totalLessons || 0} lessons</span>
        </div>

        {/* Instructor + Price */}
        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--gray-300)' }}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'var(--color-coral-light)' }}>
              <span className="text-[10px] font-bold" style={{ color: 'var(--color-coral)' }}>{course.instructor?.name?.[0]}</span>
            </div>
            <span className="text-xs font-medium" style={{ color: 'var(--color-text-body)' }}>{course.instructor?.name}</span>
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 18, color: 'var(--color-coral)' }}>
            {course.price === 0 ? 'Free' : `₹${course.price}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
