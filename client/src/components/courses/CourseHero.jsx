import { Star, Clock, Users, Globe } from 'lucide-react';

export default function CourseHero({ course, reviewStats }) {
  return (
    <div className="mb-6">
      <span className="badge badge-primary mb-3 capitalize">{course.level}</span>
      <h1 className="font-display text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        {course.title}
      </h1>
      <p className="text-base mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {course.description || course.shortDescription}
      </p>

      <div className="flex flex-wrap items-center gap-4 mb-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
        <span className="flex items-center gap-1.5">
          <Star className="w-4 h-4 text-secondary" />
          <b>{reviewStats?.average || course.rating || 'New'}</b> ({reviewStats?.count || course.totalReviews || 0} reviews)
        </span>
        <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{course.enrolledCount} enrolled</span>
        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{course.totalLessons} lessons</span>
        <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" />{course.language || 'English'}</span>
      </div>
    </div>
  );
}