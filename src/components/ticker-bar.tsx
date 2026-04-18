import { advisories } from "@/data/advisories";

export function TickerBar() {
  const items = advisories.slice(0, 6);
  const doubled = [...items, ...items];
  return (
    <div className="brutal-border-b overflow-hidden bg-foreground text-background">
      <div className="flex items-center">
        <div className="scan-tape shrink-0 px-3 py-1.5 font-display text-xs tracking-widest text-background">
          ZERODAY · BULLETIN
        </div>
        <div className="relative flex-1 overflow-hidden py-1.5">
          <div className="marquee-track flex whitespace-nowrap font-mono text-xs uppercase tracking-wider">
            {doubled.map((a, i) => (
              <span key={i} className="mx-6 inline-flex items-center gap-2">
                <span className="text-destructive">●</span>
                {a.id} · {a.severity} · {a.packageName}@{a.version} · {a.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
