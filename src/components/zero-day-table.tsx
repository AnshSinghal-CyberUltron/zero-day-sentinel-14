import { Link } from "@tanstack/react-router";
import {
  type Advisory,
  ECOSYSTEM_SHORT,
  ECOSYSTEM_GLYPH,
  relativeTime,
} from "@/data/advisories";
import { SeverityBadge } from "./severity-badge";

interface Props {
  advisories: Advisory[];
  showEcosystem?: boolean;
  emptyText?: string;
}

export function ZeroDayTable({
  advisories,
  showEcosystem = true,
  emptyText = "No zero-days match.",
}: Props) {
  if (advisories.length === 0) {
    return (
      <div className="brutal-border bg-card p-8 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
        ∅ {emptyText}
      </div>
    );
  }

  return (
    <div className="brutal-border overflow-hidden bg-card">
      {/* Header */}
      <div className="brutal-border-b grid grid-cols-12 gap-2 bg-foreground px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-background">
        <div className="col-span-3 md:col-span-2">ZDS-ID</div>
        <div className="col-span-2 hidden md:block">Severity</div>
        {showEcosystem && <div className="col-span-1 hidden md:block">Eco</div>}
        <div className="col-span-9 md:col-span-5">Title · Affected</div>
        <div className="col-span-1 hidden text-right md:block">AI</div>
        <div className="col-span-1 hidden text-right md:block">Disclosed</div>
      </div>

      {/* Rows */}
      <ul>
        {advisories.map((a, i) => {
          const affected = a.affectedSlugs[0] ?? "—";
          return (
            <li
              key={a.id}
              className={`grid grid-cols-12 items-center gap-2 px-3 py-3 transition-colors hover:bg-secondary ${
                i !== 0 ? "border-t border-foreground/15" : ""
              }`}
            >
              <Link
                to="/zero-day/$id"
                params={{ id: a.id }}
                className="col-span-3 truncate font-mono text-xs font-semibold underline-offset-2 hover:underline md:col-span-2"
              >
                {a.id}
              </Link>

              <div className="col-span-2 hidden md:block">
                <SeverityBadge severity={a.severity} cvss={a.cvss} />
              </div>

              {showEcosystem && (
                <div className="col-span-1 hidden md:block">
                  <span className="brutal-border inline-block px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest">
                    {ECOSYSTEM_GLYPH[a.ecosystem]} {ECOSYSTEM_SHORT[a.ecosystem]}
                  </span>
                </div>
              )}

              <div className="col-span-9 md:col-span-5">
                {/* Mobile: show severity inline */}
                <div className="mb-1 flex items-center gap-1.5 md:hidden">
                  <SeverityBadge severity={a.severity} cvss={a.cvss} />
                  <span className="brutal-border inline-block px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest">
                    {ECOSYSTEM_SHORT[a.ecosystem]}
                  </span>
                </div>
                <Link
                  to="/zero-day/$id"
                  params={{ id: a.id }}
                  className="block truncate text-sm font-medium hover:text-destructive"
                >
                  {a.title}
                </Link>
                <Link
                  to="/$ecosystem/$slug"
                  params={{ ecosystem: a.ecosystem, slug: affected }}
                  className="truncate font-mono text-[11px] text-muted-foreground hover:text-foreground hover:underline"
                >
                  → {affected}
                </Link>
              </div>

              <div className="col-span-1 hidden text-right font-mono text-xs md:block">
                {a.aiConfidence}
              </div>
              <div className="col-span-1 hidden text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground md:block">
                {relativeTime(a.discoveredAt + "T00:00:00Z")}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
