/**
 * Reusable section heading with one italic accent word.
 * Usage: <SectionHeading before="Browse Our" accent="Top" after="Courses" accentColor="orange" />
 */
export default function SectionHeading({ before = '', accent = '', after = '', subtitle = '', accentColor = 'orange', className = '' }) {
  const colorClass = accentColor === 'green' ? 'accent-green' : 'accent-orange';

  return (
    <div className={`text-center mb-12 ${className}`}>
      <h2 className="font-display mb-4" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.3px', color: 'var(--color-text-primary)' }}>
        {before}{' '}
        <em className={colorClass}>{accent}</em>
        {after ? ` ${after}` : ''}
      </h2>
      {subtitle && (
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: 'var(--color-text-body)', lineHeight: 1.65, maxWidth: 540, margin: '0 auto' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
