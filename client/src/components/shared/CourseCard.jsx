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
    <Link to={`/course/${course.slug}`} className="card overflow-hidden group block no-underline hover:-translate-y-1 transition-transform">
      <div className="relative h-44 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-10 h-10" style={{ color: 'var(--text-muted)' }} />
          </div>
        )}
        <span className="badge badge-primary absolute top-3 left-3 capitalize">{course.level}</span>
        <button 
          onClick={toggleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
        >
          <Heart className="w-4 h-4" style={{ fill: isWishlisted ? '#EC4899' : 'transparent', color: isWishlisted ? '#EC4899' : 'var(--text-secondary)' }} />
        </button>
      </div>
      <div className="p-5">
        <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>{course.category || 'General'}</p>
        <h3 className="font-display text-base font-semibold mb-2 line-clamp-2" style={{ color: 'var(--text-primary)' }}>{course.title}</h3>
        <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{course.shortDescription}</p>
        <div className="flex items-center gap-3 text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-secondary" /> {course.rating || 'New'}</span>
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.enrolledCount || 0}</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.totalLessons || 0} lessons</span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary">{course.instructor?.name?.[0]}</span>
            </div>
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{course.instructor?.name}</span>
          </div>
          <span className="font-display text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            {course.price === 0 ? 'Free' : `₹${course.price}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
