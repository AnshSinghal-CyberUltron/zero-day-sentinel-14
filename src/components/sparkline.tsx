import type { DayPoint } from "@/data/series";

interface SparklineProps {
  data: DayPoint[];
  width?: number;
  height?: number;
  strokeColor?: string; // CSS var or color
  fillColor?: string;
  className?: string;
}

/**
 * Tiny SVG sparkline. Draws a stepped area + line.
 * No deps. Pixel-snapped for the brutalist look.
 */
export function Sparkline({
  data,
  width = 140,
  height = 36,
  strokeColor = "var(--ink)",
  fillColor = "color-mix(in oklab, var(--ink) 12%, transparent)",
  className,
}: SparklineProps) {
  if (data.length === 0) return null;
  const max = Math.max(1, ...data.map((d) => d.count));
  const stepX = width / (data.length - 1 || 1);

  const points = data.map((d, i) => {
    const x = i * stepX;
    const y = height - (d.count / max) * (height - 4) - 2;
    return [x, y] as const;
  });

  const linePath = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L${width.toFixed(1)} ${height} L0 ${height} Z`;

  const lastX = points[points.length - 1][0];
  const lastY = points[points.length - 1][1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      className={className}
      preserveAspectRatio="none"
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      <path d={areaPath} fill={fillColor} />
      <path d={linePath} fill="none" stroke={strokeColor} strokeWidth={1.5} />
      <circle cx={lastX} cy={lastY} r={2.5} fill="var(--severity-critical)" />
    </svg>
  );
}
