export function QuaiScene({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 100"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="qsky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fdeecf" />
          <stop offset="1" stopColor="#f5d8b8" />
        </linearGradient>
      </defs>
      <rect width="600" height="100" fill="url(#qsky)" />
      <circle cx="510" cy="28" r="14" fill="#f2b26b" />
      <g fill="#fff" opacity="0.7">
        <ellipse cx="120" cy="26" rx="22" ry="6" />
        <ellipse cx="280" cy="18" rx="30" ry="7" />
        <ellipse cx="440" cy="32" rx="20" ry="5.5" />
      </g>
      <path d="M0 70 Q80 60 160 70 T320 70 T480 70 T600 70 V100 H0 Z" fill="#e6a36b" opacity="0.4" />
      <path d="M0 78 Q80 70 160 78 T320 78 T480 78 T600 78 V100 H0 Z" fill="#c98a2a" opacity="0.55" />
      <g transform="translate(60 52)">
        <path d="M0 18 L60 18 L54 6 L6 6 Z" fill="#fff" stroke="#3a2a1a" strokeWidth="1.5" />
        <rect x="14" y="10" width="10" height="5" rx="1" fill="#f5d8b8" stroke="#3a2a1a" strokeWidth="0.9" />
        <rect x="30" y="10" width="14" height="5" rx="1" fill="#f5d8b8" stroke="#3a2a1a" strokeWidth="0.9" />
        <circle cx="14" cy="20" r="3" fill="#3a2a1a" />
        <circle cx="46" cy="20" r="3" fill="#3a2a1a" />
      </g>
      <g transform="translate(360 50)">
        <path d="M0 0 Q8 -8 16 0 L16 8 L0 8 Z" fill="#fffcf5" stroke="#3a2a1a" strokeWidth="1.2" />
        <rect x="4" y="8" width="8" height="10" fill="#c98a2a" />
        <path d="M10 -4 L10 -10 L16 -10" fill="none" stroke="#3a2a1a" strokeWidth="1" />
      </g>
      <g fill="#6a8f4a" opacity="0.7">
        <path d="M200 66 q4 -8 8 0" fill="none" stroke="#6a8f4a" strokeWidth="1" />
        <path d="M250 68 q4 -6 8 0" fill="none" stroke="#6a8f4a" strokeWidth="1" />
      </g>
    </svg>
  );
}

export function CrepeDot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="13" fill="#f2d9b3" stroke="#c07a2a" strokeWidth="1.2" />
      <path d="M10 14 Q16 12 22 14" stroke="#7a4b10" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M9 18 Q16 16 23 18" stroke="#7a4b10" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M13 10 L12 13 L15 12 Z" fill="#b84a3a" />
      <path d="M19 13 L22 14 L20 16 Z" fill="#b84a3a" />
    </svg>
  );
}

export function GlaceDot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path d="M10 14 L22 14 L16 30 Z" fill="#f2d9b3" stroke="#c07a2a" strokeWidth="1" />
      <circle cx="13" cy="10" r="5" fill="#f2c7b8" stroke="#b84a3a" strokeWidth="0.8" />
      <circle cx="19" cy="10" r="5" fill="#f5d8b8" stroke="#c07a2a" strokeWidth="0.8" />
      <circle cx="16" cy="7" r="4" fill="#d8e3b8" stroke="#6a8f4a" strokeWidth="0.8" />
    </svg>
  );
}

export function WaffleDot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect x="5" y="8" width="22" height="18" rx="3" fill="#e6a36b" stroke="#7a4b10" strokeWidth="1" />
      <g stroke="#7a4b10" strokeWidth="0.7" opacity="0.6">
        <line x1="11" y1="8" x2="11" y2="26" />
        <line x1="16" y1="8" x2="16" y2="26" />
        <line x1="21" y1="8" x2="21" y2="26" />
        <line x1="5" y1="14" x2="27" y2="14" />
        <line x1="5" y1="20" x2="27" y2="20" />
      </g>
    </svg>
  );
}

export function StrawberryDot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path d="M8 14 Q16 30 24 14 Q20 8 16 8 Q12 8 8 14 Z" fill="#d85a4a" stroke="#7a1a1a" strokeWidth="0.9" />
      <g fill="#fdeecf">
        <circle cx="13" cy="14" r="0.8" />
        <circle cx="17" cy="18" r="0.8" />
        <circle cx="20" cy="14" r="0.8" />
        <circle cx="15" cy="22" r="0.8" />
      </g>
      <path d="M12 8 Q16 4 20 8 Q18 6 16 6 Q14 6 12 8 Z" fill="#6a8f4a" />
    </svg>
  );
}

export function SparkleFleurs({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 24" className={className} aria-hidden>
      <g fill="#c07a2a" opacity="0.75">
        <circle cx="6" cy="12" r="2" />
        <circle cx="14" cy="6" r="1.2" />
        <circle cx="20" cy="15" r="1.5" />
      </g>
      <g fill="#b84a3a" opacity="0.7">
        <circle cx="30" cy="8" r="1.5" />
        <circle cx="38" cy="14" r="1.2" />
      </g>
      <g fill="#6a8f4a" opacity="0.7">
        <circle cx="28" cy="18" r="1.2" />
        <circle cx="42" cy="6" r="1.2" />
      </g>
    </svg>
  );
}
