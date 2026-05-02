import { Link } from 'react-router-dom';
import { BookOpen, Globe, Award, BarChart3, FileText, HelpCircle, ClipboardList, Package } from 'lucide-react';

export default function CourseSidebar({ course, isEnrolled, onEnroll }) {
  // Count lesson types
  const counts = {
    article: 0,
    assignment: 0,
    quiz: 0,
    resources: 0,
  };

  course.curriculum?.forEach(sec => {
    sec.lessons?.forEach(les => {
      if (counts[les.type] !== undefined) counts[les.type]++;
      if (les.resources?.length) counts.resources += les.resources.length;
    });
  });

  return (
    <div className="lg:col-span-1">
      <div className="card p-6 sticky top-24">
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

        <div className="mb-6">
          <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">This course includes:</h4>
          <div className="space-y-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex items-center gap-2.5"><BookOpen className="w-4 h-4" />{course.totalLessons} modules</div>
            {counts.article > 0 && <div className="flex items-center gap-2.5"><FileText className="w-4 h-4" />{counts.article} articles</div>}
            {counts.assignment > 0 && <div className="flex items-center gap-2.5"><ClipboardList className="w-4 h-4" />{counts.assignment} assignments</div>}
            {counts.quiz > 0 && <div className="flex items-center gap-2.5"><HelpCircle className="w-4 h-4" />{counts.quiz} quizzes</div>}
            {counts.resources > 0 && <div className="flex items-center gap-2.5"><Package className="w-4 h-4" />{counts.resources} downloadable resources</div>}
            <div className="flex items-center gap-2.5"><BarChart3 className="w-4 h-4" />{course.level} level</div>
            <div className="flex items-center gap-2.5"><Globe className="w-4 h-4" />{course.language || 'English'}</div>
            {course.certificate && <div className="flex items-center gap-2.5"><Award className="w-4 h-4 text-coral" />Certificate of completion</div>}
          </div>
        </div>
      </div>
    </div>
  );
}