export function TempSparkline({
  points,
  height = 80,
  className = ""
}: {
  points: Array<{ time: string; tempC: number; precipProbPct: number }>;
  height?: number;
  className?: string;
}) {
  if (points.length === 0) return null;
  const width = Math.max(240, points.length * 22);
  const padX = 18;
  const padY = 16;
  const temps = points.map((p) => p.tempC);
  const min = Math.min(...temps) - 1;
  const max = Math.max(...temps) + 1;
  const span = Math.max(1, max - min);
  const stepX = (width - padX * 2) / Math.max(1, points.length - 1);

  const xy = points.map((p, i) => {
    const x = padX + i * stepX;
    const y = padY + (1 - (p.tempC - min) / span) * (height - padY * 2);
    return { x, y, t: p.tempC, hour: new Date(p.time).getHours(), rain: p.precipProbPct };
  });

  const linePath = xy.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaPath =
    `M ${xy[0].x.toFixed(1)} ${(height - padY).toFixed(1)} ` +
    xy.map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") +
    ` L ${xy[xy.length - 1].x.toFixed(1)} ${(height - padY).toFixed(1)} Z`;

  const labelEvery = Math.ceil(points.length / 8);

  return (
    <div className={`overflow-x-auto ${className}`}>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="block h-24 w-full">
        <defs>
          <linearGradient id="tempArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#c25f1a" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#c25f1a" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#tempArea)" />
        <path d={linePath} fill="none" stroke="#c25f1a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {xy.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={p.rain > 50 ? 3 : 2.2} fill={p.t >= 18 ? "#c98a2a" : "#8a7060"} />
            {i % labelEvery === 0 ? (
              <>
                <text x={p.x} y={p.y - 6} fontSize={9} textAnchor="middle" fill="#1f2a3a" fontWeight={600}>
                  {Math.round(p.t)}°
                </text>
                <text x={p.x} y={height - 3} fontSize={9} textAnchor="middle" fill="#6b7a90">
                  {p.hour}h
                </text>
              </>
            ) : null}
          </g>
        ))}
      </svg>
    </div>
  );
}
