import { Link } from "@tanstack/react-router";
import {
  type EcosystemStats,
  ECOSYSTEM_LABEL,
  ECOSYSTEM_GLYPH,
  formatNumber,
  relativeTime,
} from "@/data/advisories";
import { ecosystemSeries } from "@/data/series";
import { Sparkline } from "./sparkline";

export function EcosystemStatCard({ stats }: { stats: EcosystemStats }) {
  return (
    <Link
      to="/$ecosystem"
      params={{ ecosystem: stats.ecosystem }}
      className="brutal-border block bg-card brutal-hover"
    >
      <div className="brutal-border-b flex items-center justify-between bg-foreground px-3 py-1.5 text-background">
        <div className="flex items-center gap-2 font-display text-sm tracking-wider">
          <span>{ECOSYSTEM_GLYPH[stats.ecosystem]}</span>
          {ECOSYSTEM_LABEL[stats.ecosystem]}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">
          last {relativeTime(stats.lastScan)}
        </span>
      </div>

      <div className="grid grid-cols-2 divide-x-2 divide-foreground">
        <Stat label="Scanned (total)" value={formatNumber(stats.scannedTotal)} />
        <Stat label="Today" value={`+${formatNumber(stats.scannedToday)}`} />
      </div>
      <div className="grid grid-cols-2 divide-x-2 divide-foreground border-t-2 border-foreground">
        <Stat
          label="Zero-days"
          value={stats.zeroDaysFound.toString()}
          accent
        />
        <Stat label="Avg AI" value={`${stats.avgConfidence}%`} />
      </div>

      {/* 30-day discovery sparkline */}
      <div className="brutal-border-t bg-secondary px-3 pb-2 pt-1.5">
        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          <span>30d discovery</span>
          <span>{ecosystemSeries[stats.ecosystem].total} found</span>
        </div>
        <Sparkline data={ecosystemSeries[stats.ecosystem].points} height={32} />
      </div>
    </Link>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="px-3 py-3">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className={`mt-0.5 font-display text-2xl ${accent ? "text-destructive" : ""}`}>
        {value}
      </div>
    </div>
  );
}
