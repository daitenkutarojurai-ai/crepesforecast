export function SeineIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 80" className={className} aria-hidden>
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#d7ecf7" />
          <stop offset="1" stopColor="#f6ead0" />
        </linearGradient>
      </defs>
      <rect width="240" height="80" rx="12" fill="url(#sky)" />
      <circle cx="200" cy="22" r="12" fill="#f5c46b" opacity="0.85" />
      <path d="M0 58 Q30 48 60 58 T120 58 T180 58 T240 58 V80 H0 Z" fill="#7ec1de" opacity="0.55" />
      <path d="M0 66 Q30 58 60 66 T120 66 T180 66 T240 66 V80 H0 Z" fill="#3d8ab3" opacity="0.55" />
      <g transform="translate(72 28)">
        <rect x="0" y="12" width="36" height="18" rx="4" fill="#fff" stroke="#1f2a3a" strokeWidth="1.2" />
        <path d="M0 14 L36 14" stroke="#d98e46" strokeWidth="1.2" />
        <rect x="4" y="18" width="10" height="8" rx="1.5" fill="#cfe4f0" stroke="#1f2a3a" strokeWidth="0.9" />
        <rect x="18" y="18" width="14" height="8" rx="1.5" fill="#cfe4f0" stroke="#1f2a3a" strokeWidth="0.9" />
        <circle cx="8" cy="32" r="3" fill="#1f2a3a" />
        <circle cx="28" cy="32" r="3" fill="#1f2a3a" />
        <path d="M12 12 L24 4 L30 12 Z" fill="#d98e46" />
        <path d="M18 12 V0" stroke="#c04545" strokeWidth="1" />
        <path d="M18 1 L26 5 L18 8 Z" fill="#c04545" />
      </g>
    </svg>
  );
}

export function CrepeDot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="13" fill="#f2d9b3" stroke="#c98a2a" strokeWidth="1.2" />
      <path d="M10 14 Q16 12 22 14" stroke="#7a4b10" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M9 18 Q16 16 23 18" stroke="#7a4b10" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M13 10 L12 13 L15 12 Z" fill="#7a2a2a" />
      <path d="M19 13 L22 14 L20 16 Z" fill="#7a2a2a" />
    </svg>
  );
}

export function GlaceDot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path d="M10 14 L22 14 L16 30 Z" fill="#f2d9b3" stroke="#c98a2a" strokeWidth="1" />
      <circle cx="13" cy="10" r="5" fill="#f7d5d5" stroke="#c04545" strokeWidth="0.8" />
      <circle cx="19" cy="10" r="5" fill="#cfe4f0" stroke="#3d8ab3" strokeWidth="0.8" />
      <circle cx="16" cy="7" r="4" fill="#bfe0c8" stroke="#4a8f5a" strokeWidth="0.8" />
    </svg>
  );
}

export function SparkleFleurs({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 24" className={className} aria-hidden>
      <g fill="#f5c46b" opacity="0.85">
        <circle cx="6" cy="12" r="2" />
        <circle cx="14" cy="6" r="1.2" />
        <circle cx="20" cy="15" r="1.5" />
      </g>
      <g fill="#c04545" opacity="0.7">
        <circle cx="30" cy="8" r="1.5" />
        <circle cx="38" cy="14" r="1.2" />
      </g>
      <g fill="#4a8f5a" opacity="0.7">
        <circle cx="28" cy="18" r="1.2" />
        <circle cx="42" cy="6" r="1.2" />
      </g>
    </svg>
  );
}
