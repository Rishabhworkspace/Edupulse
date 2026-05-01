import { Link } from 'react-router-dom';
import { BookOpen, Globe, Award, BarChart3 } from 'lucide-react';

export default function CourseSidebar({ course, isEnrolled, onEnroll }) {
  return (
    <div className="lg:col-span-1">
      <div className="card p-6 sticky top-24">
        {course.thumbnail && (
          <img src={course.thumbnail} alt={course.title} className="w-full h-44 object-cover rounded-lg mb-5" />
        )}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-display text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
            {course.price === 0 ? 'Free' : `₹${course.price}`}
          </span>
          {course.originalPrice > course.price && (
            <span className="text-base line-through" style={{ color: 'var(--text-muted)' }}>₹{course.originalPrice}</span>
          )}
        </div>
        {course.originalPrice > course.price && (
          <p className="text-sm font-semibold text-success mb-4">
            {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% off
          </p>
        )}

        {isEnrolled ? (
          <Link to={`/learn/${course.slug}`} className="btn btn-primary w-full btn-lg no-underline mb-4">
            Continue Learning
          </Link>
        ) : (
          <button onClick={onEnroll} className="btn btn-primary w-full btn-lg mb-4">
            {course.price === 0 ? 'Enroll Now — Free' : 'Buy Now'}
          </button>
        )}

        <div className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <div className="flex items-center gap-2.5"><BookOpen className="w-4 h-4" />{course.totalLessons} lessons</div>
          <div className="flex items-center gap-2.5"><BarChart3 className="w-4 h-4" />{course.level} level</div>
          <div className="flex items-center gap-2.5"><Globe className="w-4 h-4" />{course.language || 'English'}</div>
          {course.certificate && <div className="flex items-center gap-2.5"><Award className="w-4 h-4 text-secondary" />Certificate of completion</div>}
        </div>
      </div>
    </div>
  );
}