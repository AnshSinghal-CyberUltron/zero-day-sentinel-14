import { useMemo, useState } from "react";
import {
  ecosystemSeries,
  totalSeries,
  type DayPoint,
} from "@/data/series";
import { ECOSYSTEM_LABEL, ECOSYSTEM_GLYPH, type Ecosystem } from "@/data/advisories";

const ECO_COLORS: Record<Ecosystem, string> = {
  npm: "var(--severity-critical)",
  docker: "var(--severity-high)",
  mcp: "var(--severity-medium)",
  huggingface: "var(--severity-low)",
};

const ECOS: Ecosystem[] = ["npm", "docker", "mcp", "huggingface"];

/**
 * Stacked bar discovery trend over 30 days.
 * Bars are stacked per ecosystem. Hovering a day shows counts.
 */
export function DiscoveryTrend() {
  const [hover, setHover] = useState<number | null>(null);

  const days = totalSeries.length;
  const W = 600;
  const H = 160;
  const padL = 28;
  const padR = 8;
  const padT = 12;
  const padB = 22;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const max = useMemo(() => Math.max(1, ...totalSeries.map((d) => d.count)), []);
  const barW = innerW / days;

  const yTicks = [0, Math.ceil(max / 2), max];

  return (
    <div className="brutal-border bg-card">
      <div className="brutal-border-b flex items-center justify-between bg-foreground px-3 py-1.5 text-background">
        <span className="font-mono text-[10px] uppercase tracking-widest">
          /discovery-trend · 30d
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">
          {totalSeries.reduce((s, p) => s + p.count, 0)} total
        </span>
      </div>

      <div className="p-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          className="block"
          preserveAspectRatio="none"
          shapeRendering="crispEdges"
          onMouseLeave={() => setHover(null)}
        >
          {/* Y grid + labels */}
          {yTicks.map((t) => {
            const y = padT + innerH - (t / max) * innerH;
            return (
              <g key={t}>
                <line
                  x1={padL}
                  x2={W - padR}
                  y1={y}
                  y2={y}
                  stroke="color-mix(in oklab, var(--ink) 15%, transparent)"
                  strokeWidth={1}
                />
                <text
                  x={padL - 4}
                  y={y + 3}
                  textAnchor="end"
                  fontSize={9}
                  fontFamily="ui-monospace, monospace"
                  fill="var(--muted-foreground)"
                >
                  {t}
                </text>
              </g>
            );
          })}

          {/* Stacked bars */}
          {totalSeries.map((d, i) => {
            const x = padL + i * barW;
            let yCursor = padT + innerH;
            const slices = ECOS.map((eco) => {
              const c = ecosystemSeries[eco].points[i].count;
              const h = (c / max) * innerH;
              const y = yCursor - h;
              yCursor = y;
              return { eco, c, h, y };
            });

            return (
              <g
                key={d.date}
                onMouseEnter={() => setHover(i)}
              >
                {/* hover hit area */}
                <rect
                  x={x}
                  y={padT}
                  width={Math.max(barW, 1)}
                  height={innerH}
                  fill="transparent"
                />
                {slices.map((s) =>
                  s.h > 0 ? (
                    <rect
                      key={s.eco}
                      x={x + 0.5}
                      y={s.y}
                      width={Math.max(barW - 1, 1)}
                      height={s.h}
                      fill={ECO_COLORS[s.eco]}
                      opacity={hover === null || hover === i ? 1 : 0.5}
                    />
                  ) : null,
                )}
              </g>
            );
          })}

          {/* X labels (sparse) */}
          {[0, Math.floor(days / 2), days - 1].map((i) => {
            const x = padL + i * barW + barW / 2;
            const label = totalSeries[i].date.slice(5); // MM-DD
            return (
              <text
                key={i}
                x={x}
                y={H - 6}
                textAnchor="middle"
                fontSize={9}
                fontFamily="ui-monospace, monospace"
                fill="var(--muted-foreground)"
              >
                {label}
              </text>
            );
          })}
        </svg>

        {/* Hover readout */}
        <div className="mt-2 min-h-[42px] brutal-border bg-secondary px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest">
          {hover === null ? (
            <span className="text-muted-foreground">hover bars · daily breakdown</span>
          ) : (
            <HoverReadout dayIndex={hover} />
          )}
        </div>

        {/* Legend */}
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          {ECOS.map((eco) => (
            <div
              key={eco}
              className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest"
            >
              <span
                className="inline-block h-2 w-3 brutal-border"
                style={{ background: ECO_COLORS[eco] }}
              />
              {ECOSYSTEM_GLYPH[eco]} {ECOSYSTEM_LABEL[eco]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HoverReadout({ dayIndex }: { dayIndex: number }) {
  const point: DayPoint = totalSeries[dayIndex];
  const perEco = ECOS.map((eco) => ({
    eco,
    count: ecosystemSeries[eco].points[dayIndex].count,
  }));
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
      <span className="text-foreground">{point.date}</span>
      <span className="text-muted-foreground">
        total <span className="text-foreground">{point.count}</span>
      </span>
      <span className="flex flex-wrap gap-x-2">
        {perEco.map((p) => (
          <span key={p.eco} className="text-muted-foreground">
            {ECOSYSTEM_GLYPH[p.eco]}
            <span className="ml-0.5 text-foreground">{p.count}</span>
          </span>
        ))}
      </span>
    </div>
  );
}
