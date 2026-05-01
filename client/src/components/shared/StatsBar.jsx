/**
 * Stats bar component: white card with flex row stats, Fraunces numbers, vertical dividers.
 */
export default function StatsBar({ stats }) {
  const defaultStats = [
    { value: '60K+', label: 'Active Learners' },
    { value: '45K+', label: 'Certified Mentors' },
    { value: '2.5M+', label: 'Students Globally' },
    { value: '20K+', label: 'Courses & Tutorials' },
  ];

  const items = stats || defaultStats;

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderRadius: 20,
        padding: '32px 48px',
        boxShadow: '0 4px 24px rgba(26, 26, 46, 0.08)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 24,
      }}
    >
      {items.map((stat, i) => (
        <div key={i} className="flex items-center" style={{ gap: 24 }}>
          {/* Stat */}
          <div className="text-center" style={{ minWidth: 100 }}>
            <div style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 700,
              fontSize: 'clamp(28px, 3vw, 40px)',
              lineHeight: 1,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.5px',
              marginBottom: 4,
            }}>
              {stat.value}
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: 14,
              color: 'var(--color-text-muted)',
              letterSpacing: '0.3px',
              lineHeight: 1.4,
            }}>
              {stat.label}
            </div>
          </div>

          {/* Divider (not after last) */}
          {i < items.length - 1 && (
            <div className="stat-divider hidden md:block" />
          )}
        </div>
      ))}
    </div>
  );
}
