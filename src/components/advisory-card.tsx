import type { Advisory, Severity, Ecosystem } from "@/data/advisories";
import { ECOSYSTEM_LABEL } from "@/data/advisories";

const SEV_BG: Record<Severity, string> = {
  CRITICAL: "bg-[var(--severity-critical)] text-white",
  HIGH: "bg-[var(--severity-high)] text-black",
  MEDIUM: "bg-[var(--severity-medium)] text-black",
  LOW: "bg-[var(--severity-low)] text-black",
};

const ECO_ICON: Record<Ecosystem, string> = {
  npm: "▲",
  docker: "◆",
  mcp: "✦",
  huggingface: "☷",
};

export function AdvisoryCard({ advisory }: { advisory: Advisory }) {
  return (
    <article className="brutal-border bg-card text-card-foreground brutal-hover">
      {/* Severity tape */}
      <div className={`flex items-center justify-between px-4 py-2 ${SEV_BG[advisory.severity]}`}>
        <span className="font-display text-sm tracking-wider">
          {advisory.severity}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-wider opacity-90">
          {advisory.cwe} · {advisory.status}
        </span>
      </div>

      <div className="flex items-start justify-between gap-3 px-4 pt-4">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          <span className="brutal-border px-1.5 py-0.5 text-foreground">
            {ECO_ICON[advisory.ecosystem]} {ECOSYSTEM_LABEL[advisory.ecosystem]}
          </span>
          <span>{advisory.discoveredAt}</span>
        </div>
        <span className="font-mono text-[10px] uppercase text-muted-foreground">
          {advisory.id}
        </span>
      </div>

      <div className="px-4 pb-4 pt-2">
        <div className="font-mono text-xs text-muted-foreground">
          {advisory.packageName}
          <span className="mx-1.5 opacity-50">@</span>
          {advisory.version}
        </div>
        <h3 className="mt-2 font-display text-lg leading-tight">
          {advisory.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/80">
          {advisory.summary}
        </p>
      </div>

      <div className="brutal-border-t flex items-center justify-between bg-secondary px-4 py-2 font-mono text-[10px] uppercase tracking-wider">
        <span className="truncate">{advisory.vector}</span>
        {advisory.downloads && <span>{advisory.downloads}</span>}
      </div>
    </article>
  );
}
