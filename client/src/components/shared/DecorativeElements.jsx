/**
 * Decorative SVG elements for the Zankit-style design.
 * Scattered across sections, always offset, never centered.
 * All are aria-hidden and pointer-events: none.
 */

export function StarDecor({ style, className = '', size = 24 }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      className={`decor decor-float ${className}`}
      style={style}
      aria-hidden="true"
    >
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#F4845F" />
    </svg>
  );
}

export function SparkleDecor({ style, className = '', size = 20 }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 20 20" fill="none"
      className={`decor decor-float ${className}`}
      style={style}
      aria-hidden="true"
    >
      <path d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8L10 0Z" fill="#8DB580" />
    </svg>
  );
}

export function DiamondDecor({ style, className = '', size = 14 }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 14 14" fill="none"
      className={`decor decor-float ${className}`}
      style={style}
      aria-hidden="true"
    >
      <rect x="7" y="0" width="9.9" height="9.9" transform="rotate(45 7 0)" fill="#F5D770" />
    </svg>
  );
}

export function CircleDotDecor({ style, className = '', size = 12 }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 12 12" fill="none"
      className={`decor ${className}`}
      style={style}
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="6" fill="#C4B5E8" />
    </svg>
  );
}

export function SquigglyLine({ style, className = '', width = 80 }) {
  return (
    <svg
      width={width} height="6" viewBox="0 0 80 6" fill="none"
      className={`decor ${className}`}
      style={style}
      aria-hidden="true"
    >
      <path d="M0 3C10 0 10 6 20 3C30 0 30 6 40 3C50 0 50 6 60 3C70 0 70 6 80 3" stroke="#F4845F" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function SpiralDecor({ style, className = '', size = 32 }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 32 32" fill="none"
      className={`decor decor-float ${className}`}
      style={style}
      aria-hidden="true"
    >
      <path d="M16 4C16 4 24 4 24 12C24 20 16 20 16 16C16 12 20 12 20 16" stroke="#8DB580" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
