import { Link } from "@tanstack/react-router";
import {
  type Artifact,
  ECOSYSTEM_GLYPH,
  ECOSYSTEM_SHORT,
  formatDownloads,
  relativeTime,
} from "@/data/advisories";
import { ConfidenceMeter } from "./confidence-meter";

export function ArtifactCard({ artifact }: { artifact: Artifact }) {
  return (
    <Link
      to="/$ecosystem/$slug"
      params={{ ecosystem: artifact.ecosystem, slug: artifact.slug }}
      className="brutal-border block bg-card p-4 brutal-hover"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="brutal-border px-1.5 py-0.5 text-foreground">
              {ECOSYSTEM_GLYPH[artifact.ecosystem]} {ECOSYSTEM_SHORT[artifact.ecosystem]}
            </span>
            <span className="truncate">{artifact.publisher}</span>
          </div>
          <div className="mt-2 truncate font-mono text-sm font-semibold">
            {artifact.name}
          </div>
          <div className="font-mono text-[11px] text-muted-foreground">
            @{artifact.version}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="brutal-border bg-destructive px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-destructive-foreground">
            {artifact.zeroDayIds.length} 0-DAY
          </div>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-xs text-foreground/75">
        {artifact.description}
      </p>

      <div className="mt-3">
        <ConfidenceMeter value={artifact.aiConfidence} size="sm" />
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <span>↓ {formatDownloads(artifact)}</span>
        <span>scan {relativeTime(artifact.lastScanned)}</span>
      </div>
    </Link>
  );
}
