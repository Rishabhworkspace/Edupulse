import { Star, Clock, Users, Globe } from 'lucide-react';

export default function CourseHero({ course, reviewStats }) {
  return (
    <div className="mb-8">
      {/* Large Hero Banner */}
      {course.thumbnail && (
        <div className="mb-10 rounded-[24px] overflow-hidden shadow-card border border-gray-100 aspect-video relative group">
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      )}

      <span className="badge badge-primary mb-4 capitalize font-bold">{course.level}</span>
      <h1 className="font-display text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)', lineHeight: 1.1 }}>
        {course.title}
      </h1>
      
      <p className="text-lg lg:text-2xl mb-8 leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
        {course.description || course.shortDescription}
      </p>

      <div className="flex flex-wrap items-center gap-6 mb-8 text-base font-medium" style={{ color: 'var(--text-secondary)' }}>
        <span className="flex items-center gap-2">
          <Star className="w-5 h-5 text-secondary fill-current" />
          <b className="text-text-primary text-lg">{reviewStats?.average || course.rating || 'New'}</b> 
          <span className="text-sm">({reviewStats?.count || course.totalReviews || 0} reviews)</span>
        </span>
        <span className="flex items-center gap-2"><Users className="w-5 h-5 text-text-muted" />{course.enrolledCount} enrolled</span>
        <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-text-muted" />{course.totalLessons} modules</span>
        <span className="flex items-center gap-2"><Globe className="w-5 h-5 text-text-muted" />{course.language || 'English'}</span>
      </div>
    </div>
  );
}