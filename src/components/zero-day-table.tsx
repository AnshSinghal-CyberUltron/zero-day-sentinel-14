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
      {/* Header — desktop only */}
      <div className="brutal-border-b hidden grid-cols-12 gap-2 bg-foreground px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-background md:grid">
        <div className="col-span-2">ZDS-ID</div>
        <div className="col-span-2">Severity</div>
        {showEcosystem && <div className="col-span-1">Eco</div>}
        <div className={showEcosystem ? "col-span-5" : "col-span-6"}>
          Title · Affected
        </div>
        <div className="col-span-1 text-right">AI</div>
        <div className="col-span-1 text-right">Disclosed</div>
      </div>

      {/* Mobile header */}
      <div className="brutal-border-b bg-foreground px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-background md:hidden">
        {advisories.length} ZERO-DAY{advisories.length === 1 ? "" : "S"}
      </div>

      {/* Rows */}
      <ul>
        {advisories.map((a, i) => {
          const affected = a.affectedSlugs[0] ?? "—";
          return (
            <li
              key={a.id}
              className={`px-3 py-3 transition-colors hover:bg-secondary ${
                i !== 0 ? "border-t border-foreground/15" : ""
              }`}
            >
              {/* Mobile layout — stacked */}
              <div className="md:hidden">
                <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                  <SeverityBadge severity={a.severity} cvss={a.cvss} />
                  {showEcosystem && (
                    <span className="brutal-border inline-block px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest">
                      {ECOSYSTEM_GLYPH[a.ecosystem]} {ECOSYSTEM_SHORT[a.ecosystem]}
                    </span>
                  )}
                  <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    AI {a.aiConfidence} · {relativeTime(a.discoveredAt + "T00:00:00Z")}
                  </span>
                </div>
                <Link
                  to="/zero-day/$id"
                  params={{ id: a.id }}
                  className="block font-mono text-[11px] font-semibold underline-offset-2 hover:underline"
                >
                  {a.id}
                </Link>
                <Link
                  to="/zero-day/$id"
                  params={{ id: a.id }}
                  className="mt-1 block text-sm font-medium hover:text-destructive"
                >
                  {a.title}
                </Link>
                <Link
                  to="/$ecosystem_/$slug"
                  params={{ ecosystem: a.ecosystem, slug: affected }}
                  className="mt-0.5 block truncate font-mono text-[11px] text-muted-foreground hover:text-foreground hover:underline"
                >
                  → {affected}
                </Link>
              </div>

              {/* Desktop layout — grid */}
              <div className="hidden grid-cols-12 items-center gap-2 md:grid">
                <Link
                  to="/zero-day/$id"
                  params={{ id: a.id }}
                  className="col-span-2 truncate font-mono text-xs font-semibold underline-offset-2 hover:underline"
                >
                  {a.id}
                </Link>

                <div className="col-span-2">
                  <SeverityBadge severity={a.severity} cvss={a.cvss} />
                </div>

                {showEcosystem && (
                  <div className="col-span-1">
                    <span className="brutal-border inline-block px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest">
                      {ECOSYSTEM_GLYPH[a.ecosystem]} {ECOSYSTEM_SHORT[a.ecosystem]}
                    </span>
                  </div>
                )}

                <div className={showEcosystem ? "col-span-5" : "col-span-6"}>
                  <Link
                    to="/zero-day/$id"
                    params={{ id: a.id }}
                    className="block truncate text-sm font-medium hover:text-destructive"
                  >
                    {a.title}
                  </Link>
                  <Link
                    to="/$ecosystem_/$slug"
                    params={{ ecosystem: a.ecosystem, slug: affected }}
                    className="truncate block font-mono text-[11px] text-muted-foreground hover:text-foreground hover:underline"
                  >
                    → {affected}
                  </Link>
                </div>

                <div className="col-span-1 text-right font-mono text-xs">
                  {a.aiConfidence}
                </div>
                <div className="col-span-1 text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {relativeTime(a.discoveredAt + "T00:00:00Z")}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

