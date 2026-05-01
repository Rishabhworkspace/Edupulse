export default function CourseInstructor({ instructor }) {
  if (!instructor) return null;
  return (
    <div className="card p-4 flex items-center gap-4 mb-8">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        {instructor.avatar ? (
          <img src={instructor.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <span className="text-lg font-bold text-primary">{instructor.name?.[0]}</span>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{instructor.name}</p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Instructor</p>
      </div>
    </div>
  );
}