// D&C Translations logo mark: two overlapping speech bubbles.
// A royal-blue bubble sits behind a darker one. On dark backgrounds the
// front bubble would disappear, so pass `onDark` to render it white.
export function LogoMark({ className = 'h-9 w-9', onDark = false }) {
  const blue = '#3B5CE6';
  const front = onDark ? '#FFFFFF' : '#0F1729';
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="D&C Translations"
    >
      {/* Back bubble (blue) */}
      <g fill={blue}>
        <rect x="8" y="10" width="22" height="17" rx="5.5" />
        <path d="M12 22 H20 L9 31 Z" />
      </g>
      {/* Front bubble (dark / white on dark backgrounds) */}
      <g fill={front}>
        <rect x="22" y="18" width="20" height="17" rx="5.5" />
        <path d="M30 30 H37 L40 39 Z" />
      </g>
    </svg>
  );
}
