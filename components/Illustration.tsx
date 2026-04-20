export function QuaiScene({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 360"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="qs-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fce9c6" />
          <stop offset="0.6" stopColor="#e9e3d0" />
          <stop offset="1" stopColor="#cfe4f0" />
        </linearGradient>
        <linearGradient id="qs-water" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#b8d6e6" />
          <stop offset="1" stopColor="#7ea8be" />
        </linearGradient>
        <linearGradient id="qs-ground" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f5e5c5" />
          <stop offset="1" stopColor="#e9d3a2" />
        </linearGradient>
      </defs>
      <rect width="1200" height="360" fill="url(#qs-sky)" />

      <g fill="#ffffff" opacity="0.8">
        <ellipse cx="260" cy="80" rx="60" ry="12" />
        <ellipse cx="540" cy="60" rx="75" ry="14" />
        <ellipse cx="820" cy="90" rx="55" ry="11" />
      </g>

      <path
        d="M0 230 Q300 220 600 230 T1200 230 V330 H0 Z"
        fill="url(#qs-water)"
      />

      <g transform="translate(1000 110)">
        <rect x="0" y="60" width="200" height="70" fill="#e9d8b3" />
        <path d="M0 130 L200 130 L220 160 L-20 160 Z" fill="#d6c18f" />
        <g fill="#a0876a">
          <rect x="30" y="70" width="20" height="30" />
          <rect x="90" y="70" width="20" height="30" />
          <rect x="150" y="70" width="20" height="30" />
        </g>
        <path d="M60 60 L40 60 L30 45 L70 45 Z" fill="#a87650" />
        <rect x="46" y="20" width="6" height="25" fill="#a87650" />
        <rect x="44" y="10" width="10" height="10" fill="#a87650" />
        <path d="M50 8 L50 -2" stroke="#a87650" strokeWidth="2" />
      </g>

      <g transform="translate(720 200)">
        <path d="M0 40 L120 40 L110 20 L10 20 Z" fill="#ffffff" stroke="#3a2a1a" strokeWidth="2" />
        <path d="M10 20 L30 5 L90 5 L110 20 Z" fill="#eef6fa" stroke="#3a2a1a" strokeWidth="2" />
        <rect x="36" y="12" width="14" height="10" fill="#cfe4f0" stroke="#3a2a1a" strokeWidth="1" />
        <rect x="66" y="12" width="14" height="10" fill="#cfe4f0" stroke="#3a2a1a" strokeWidth="1" />
        <circle cx="30" cy="42" r="4" fill="#3a2a1a" />
        <circle cx="90" cy="42" r="4" fill="#3a2a1a" />
        <path d="M55 5 L55 -8 L80 -8 L80 5" stroke="#3a2a1a" strokeWidth="2" fill="#ffffff" />
      </g>

      <g transform="translate(480 230)">
        <path d="M0 20 L70 20 L64 6 L6 6 Z" fill="#ffffff" stroke="#1a3a52" strokeWidth="1.5" />
        <rect x="12" y="8" width="10" height="8" fill="#cfe4f0" stroke="#1a3a52" strokeWidth="0.8" />
        <rect x="36" y="8" width="18" height="8" fill="#cfe4f0" stroke="#1a3a52" strokeWidth="0.8" />
        <rect x="26" y="-6" width="8" height="16" fill="#ffffff" stroke="#1a3a52" strokeWidth="1" />
        <path d="M30 -6 L30 -14" stroke="#b84a3a" strokeWidth="1.2" />
        <path d="M30 -14 L40 -10 L30 -8 Z" fill="#b84a3a" />
      </g>

      <path d="M0 320 L1200 320 L1200 360 L0 360 Z" fill="url(#qs-ground)" />

      <g transform="translate(190 235)">
        <ellipse cx="15" cy="85" rx="12" ry="3" fill="#3a2a1a" opacity="0.2" />
        <rect x="5" y="45" width="20" height="35" fill="#d6b088" />
        <rect x="3" y="40" width="24" height="10" rx="2" fill="#ffffff" />
        <circle cx="15" cy="25" r="9" fill="#f2c7a3" />
        <rect x="11" y="30" width="8" height="6" fill="#f2c7a3" />
        <path d="M7 18 Q15 10 23 18 L23 28 L7 28 Z" fill="#6a4a2a" />
      </g>

      <g transform="translate(240 240)">
        <ellipse cx="12" cy="80" rx="10" ry="3" fill="#3a2a1a" opacity="0.2" />
        <path d="M2 42 L22 42 L26 78 L -2 78 Z" fill="#c07a6a" />
        <rect x="5" y="30" width="14" height="15" fill="#ffffff" />
        <circle cx="12" cy="22" r="7" fill="#e6c7a3" />
        <path d="M5 15 Q12 8 19 15 L19 24 L5 24 Z" fill="#3a2a1a" />
      </g>

      <g transform="translate(310 230)">
        <ellipse cx="14" cy="90" rx="12" ry="3" fill="#3a2a1a" opacity="0.2" />
        <rect x="4" y="48" width="20" height="40" fill="#6a8a9a" />
        <rect x="3" y="42" width="22" height="10" rx="2" fill="#e8d6a8" />
        <circle cx="14" cy="28" r="8" fill="#f2c7a3" />
        <path d="M6 20 Q14 12 22 20 L22 30 L6 30 Z" fill="#3a2a1a" />
      </g>

      <g transform="translate(70 270)">
        <ellipse cx="15" cy="40" rx="14" ry="3" fill="#3a2a1a" opacity="0.2" />
        <ellipse cx="15" cy="28" rx="12" ry="7" fill="#b07a4a" />
        <rect x="4" y="25" width="22" height="12" rx="3" fill="#b07a4a" />
        <circle cx="8" cy="26" r="1" fill="#3a2a1a" />
        <path d="M2 25 L-4 22 L-2 28 Z" fill="#b07a4a" />
        <path d="M26 35 L32 38" stroke="#3a2a1a" strokeWidth="1" />
      </g>

      <g fill="#ffffff" opacity="0.9">
        <circle cx="760" cy="320" r="3" />
        <circle cx="820" cy="325" r="3" />
        <circle cx="900" cy="322" r="3" />
      </g>

      <g transform="translate(50 40)">
        <path d="M0 0 L40 -10 L55 20 L10 30 Z" fill="#f5d8b8" stroke="#b07a4a" strokeWidth="2" />
        <circle cx="18" cy="8" r="3" fill="#c04545" />
        <circle cx="34" cy="12" r="3" fill="#6a8f4a" />
        <circle cx="25" cy="20" r="2" fill="#c04545" />
      </g>
      <g transform="translate(150 20)">
        <rect x="0" y="0" width="40" height="40" rx="3" fill="#e6a36b" stroke="#7a4b10" strokeWidth="1.8" />
        <g stroke="#7a4b10" strokeWidth="0.9" opacity="0.7">
          <line x1="10" y1="0" x2="10" y2="40" />
          <line x1="20" y1="0" x2="20" y2="40" />
          <line x1="30" y1="0" x2="30" y2="40" />
          <line x1="0" y1="10" x2="40" y2="10" />
          <line x1="0" y1="20" x2="40" y2="20" />
          <line x1="0" y1="30" x2="40" y2="30" />
        </g>
      </g>
      <g transform="translate(40 130)">
        <path d="M0 0 L35 -8 L45 22 L10 30 Z" fill="#f5d8b8" stroke="#b07a4a" strokeWidth="2" />
        <circle cx="15" cy="8" r="2.5" fill="#6a8f4a" />
        <circle cx="30" cy="12" r="2.5" fill="#c04545" />
      </g>

      <g stroke="#3a5a6a" strokeWidth="2" fill="none" opacity="0.6">
        <path d="M220 80 L220 110 M210 95 L230 95" />
        <path d="M220 110 Q215 120 220 125 Q225 120 220 110" />
      </g>

      <g fill="#c07a2a" opacity="0.8">
        <path d="M220 50 L222 55 L227 55 L223 58 L225 63 L220 60 L215 63 L217 58 L213 55 L218 55 Z" />
        <path d="M500 40 L502 44 L506 44 L503 47 L504 51 L500 49 L496 51 L497 47 L494 44 L498 44 Z" />
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

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/glace.jpg"
      alt="Glaces en Seine"
      className={`object-contain ${className}`}
    />
  );
}
