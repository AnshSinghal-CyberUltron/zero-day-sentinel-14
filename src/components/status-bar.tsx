import { globalStats, formatNumber } from "@/data/advisories";

export function StatusBar() {
  const items = [
    { label: "Scanned · 24h", value: `+${formatNumber(globalStats.scannedToday)}` },
    { label: "Scanned · all", value: formatNumber(globalStats.scannedTotal) },
    { label: "Zero-days · 24h", value: `+${globalStats.zeroDaysToday}`, accent: true },
    { label: "Zero-days · all", value: globalStats.zeroDaysFound.toString(), accent: true },
    { label: "Avg AI confidence", value: `${globalStats.avgConfidence}%` },
  ];

  return (
    <div className="brutal-border-b bg-foreground text-background">
      <div className="mx-auto flex max-w-7xl items-center divide-x-2 divide-background/20 overflow-x-auto px-2">
        <div className="flex shrink-0 items-center gap-2 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest">
          <span className="h-1.5 w-1.5 bg-destructive blink" />
          live
        </div>
        {items.map((it) => (
          <div
            key={it.label}
            className="flex shrink-0 items-baseline gap-2 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest"
          >
            <span className="opacity-60">{it.label}</span>
            <span
              className={`font-display text-sm tracking-wider ${
                it.accent ? "text-destructive" : "text-background"
              }`}
            >
              {it.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
