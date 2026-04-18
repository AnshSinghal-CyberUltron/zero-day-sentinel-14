import { advisories, type Severity } from "@/data/advisories";

const COLORS: Record<Severity, string> = {
  CRITICAL: "var(--severity-critical)",
  HIGH: "var(--severity-high)",
  MEDIUM: "var(--severity-medium)",
  LOW: "var(--severity-low)",
};

const ORDER: Severity[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

export function SeverityDonut() {
  const counts = ORDER.map((s) => ({
    severity: s,
    count: advisories.filter((a) => a.severity === s).length,
  }));
  const total = counts.reduce((s, c) => s + c.count, 0);

  const size = 140;
  const stroke = 22;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const C = 2 * Math.PI * r;

  let offset = 0;

  return (
    <div className="brutal-border bg-card">
      <div className="brutal-border-b bg-foreground px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-background">
        /severity-mix
      </div>
      <div className="flex items-center gap-4 p-3">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
          {/* Track */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="var(--secondary)"
            strokeWidth={stroke}
          />
          {counts.map((c) => {
            if (c.count === 0) return null;
            const frac = c.count / total;
            const dash = frac * C;
            const el = (
              <circle
                key={c.severity}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={COLORS[c.severity]}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${C - dash}`}
                strokeDashoffset={-offset}
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            );
            offset += dash;
            return el;
          })}
          <text
            x={cx}
            y={cy - 2}
            textAnchor="middle"
            fontSize={22}
            fontWeight={700}
            fontFamily="Space Grotesk, system-ui, sans-serif"
            fill="var(--foreground)"
          >
            {total}
          </text>
          <text
            x={cx}
            y={cy + 14}
            textAnchor="middle"
            fontSize={8}
            fontFamily="ui-monospace, monospace"
            fill="var(--muted-foreground)"
          >
            ZERO-DAYS
          </text>
        </svg>

        <ul className="flex-1 space-y-1.5 font-mono text-[11px]">
          {counts.map((c) => {
            const pct = total === 0 ? 0 : Math.round((c.count / total) * 100);
            return (
              <li
                key={c.severity}
                className="flex items-center justify-between gap-2 border-b border-foreground/10 pb-1"
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2 w-3 brutal-border"
                    style={{ background: COLORS[c.severity] }}
                  />
                  <span className="uppercase tracking-widest text-[10px]">
                    {c.severity}
                  </span>
                </span>
                <span className="text-foreground">
                  {c.count}
                  <span className="ml-1 text-muted-foreground">· {pct}%</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
