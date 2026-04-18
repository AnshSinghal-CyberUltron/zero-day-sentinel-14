import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  artifacts,
  formatNumber,
  relativeTime,
  type Artifact,
} from "@/data/advisories";

/**
 * Recent NPM scan record — superset of Artifact for clean (non-flagged) scans
 * that don't exist as full Artifacts in the data layer. Synthesized so the
 * homepage can show a realistic "last 20 scanned" prioritization queue.
 */
interface NpmScan {
  name: string;
  version: string;
  publisher: string;
  downloads: number;
  aiConfidence: number; // 0-100
  zeroDays: number;
  lastScanned: string; // ISO
  slug?: string; // present if scan corresponds to a real flagged Artifact
  note: string; // short triage note
}

// Lightweight clean / low-signal scans to round out the list to 20.
// Mixed with real flagged Artifacts below.
const CLEAN_SCANS: Omit<NpmScan, "slug">[] = [
  { name: "react", version: "19.0.0", publisher: "facebook", downloads: 38_200_000, aiConfidence: 4, zeroDays: 0, lastScanned: "2025-04-14T11:48:00Z", note: "no anomalies" },
  { name: "lodash", version: "4.17.21", publisher: "lodash", downloads: 56_100_000, aiConfidence: 7, zeroDays: 0, lastScanned: "2025-04-14T11:42:00Z", note: "stable; signature verified" },
  { name: "axios", version: "1.7.9", publisher: "axios", downloads: 47_900_000, aiConfidence: 11, zeroDays: 0, lastScanned: "2025-04-14T11:31:00Z", note: "no anomalies" },
  { name: "left-pad-pro", version: "0.0.3", publisher: "anon-22817", downloads: 240, aiConfidence: 63, zeroDays: 0, lastScanned: "2025-04-14T11:24:00Z", note: "obfuscated postinstall — review" },
  { name: "next", version: "15.2.1", publisher: "vercel", downloads: 7_400_000, aiConfidence: 6, zeroDays: 0, lastScanned: "2025-04-14T11:10:00Z", note: "no anomalies" },
  { name: "discord-token-grab", version: "1.0.0", publisher: "anon-99214", downloads: 18, aiConfidence: 99, zeroDays: 0, lastScanned: "2025-04-14T10:58:00Z", note: "credential exfil pattern — quarantined" },
  { name: "zod", version: "3.24.1", publisher: "colinhacks", downloads: 24_600_000, aiConfidence: 3, zeroDays: 0, lastScanned: "2025-04-14T10:44:00Z", note: "no anomalies" },
  { name: "node-fetcb", version: "2.6.7", publisher: "anon-71402", downloads: 1_120, aiConfidence: 81, zeroDays: 0, lastScanned: "2025-04-14T10:30:00Z", note: "typo-squat of node-fetch" },
  { name: "vite", version: "7.0.0", publisher: "vitejs", downloads: 12_800_000, aiConfidence: 5, zeroDays: 0, lastScanned: "2025-04-14T10:22:00Z", note: "no anomalies" },
  { name: "ua-parser-mini", version: "0.0.7", publisher: "anon-55810", downloads: 90, aiConfidence: 71, zeroDays: 0, lastScanned: "2025-04-14T10:11:00Z", note: "suspicious network call on import" },
  { name: "chalk", version: "5.4.1", publisher: "sindresorhus", downloads: 31_200_000, aiConfidence: 2, zeroDays: 0, lastScanned: "2025-04-14T09:58:00Z", note: "no anomalies" },
  { name: "color-string-x", version: "1.9.0", publisher: "anon-30012", downloads: 540, aiConfidence: 58, zeroDays: 0, lastScanned: "2025-04-14T09:42:00Z", note: "minified install script" },
  { name: "dotenv", version: "16.4.7", publisher: "motdotla", downloads: 41_300_000, aiConfidence: 8, zeroDays: 0, lastScanned: "2025-04-14T09:30:00Z", note: "no anomalies" },
  { name: "rimraf", version: "6.0.1", publisher: "isaacs", downloads: 65_000_000, aiConfidence: 6, zeroDays: 0, lastScanned: "2025-04-14T09:14:00Z", note: "no anomalies" },
  { name: "ts-node-runner", version: "0.1.4", publisher: "anon-44091", downloads: 73, aiConfidence: 84, zeroDays: 0, lastScanned: "2025-04-14T08:55:00Z", note: "embedded base64 payload" },
  { name: "esbuild", version: "0.24.2", publisher: "evanw", downloads: 28_700_000, aiConfidence: 5, zeroDays: 0, lastScanned: "2025-04-14T08:36:00Z", note: "no anomalies" },
];

function bucket(c: number): { label: string; bg: string } {
  if (c >= 90) return { label: "CRIT", bg: "bg-[var(--severity-critical)]" };
  if (c >= 75) return { label: "HIGH", bg: "bg-[var(--severity-high)]" };
  if (c >= 50) return { label: "MED", bg: "bg-[var(--severity-medium)]" };
  return { label: "LOW", bg: "bg-[var(--severity-low)]" };
}

// Prioritization heuristic: confidence weighted heavily, plus a small
// distribution-reach factor (log10 downloads) and bonus for known zero-days.
function priorityScore(s: { aiConfidence: number; downloads: number; zeroDays: number }) {
  return (
    s.aiConfidence * 1.0 +
    Math.log10(s.downloads + 10) * 4 +
    s.zeroDays * 12
  );
}

export function RecentNpmScans() {
  const scans = useMemo<NpmScan[]>(() => {
    const flagged = artifacts
      .filter((a: Artifact) => a.ecosystem === "npm")
      .map<NpmScan>((a) => ({
        name: a.name,
        version: a.version,
        publisher: a.publisher,
        downloads: a.downloads,
        aiConfidence: a.aiConfidence,
        zeroDays: a.zeroDayIds.length,
        lastScanned: a.lastScanned,
        slug: a.slug,
        note: `${a.zeroDayIds.length} zero-day${a.zeroDayIds.length === 1 ? "" : "s"} disclosed`,
      }));

    return [...flagged, ...CLEAN_SCANS].slice(0, 20);
  }, []);

  const ordered = useMemo(
    () => [...scans].sort((a, b) => priorityScore(b) - priorityScore(a)),
    [scans],
  );

  const triage = ordered.filter((s) => s.aiConfidence >= 75).length;
  const clean = ordered.filter((s) => s.aiConfidence < 50).length;

  return (
    <section className="brutal-border bg-card">
      <div className="brutal-border-b flex flex-wrap items-center justify-between gap-2 bg-foreground px-3 py-1.5 text-background">
        <span className="font-mono text-[10px] uppercase tracking-widest">
          /npm · last 20 scans · prioritized by AI confidence
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">
          {triage} need triage · {clean} clean
        </span>
      </div>

      {/* desktop table */}
      <div className="hidden md:block">
        <div className="grid grid-cols-12 gap-2 border-b-2 border-foreground bg-secondary/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <div className="col-span-1">#</div>
          <div className="col-span-4">package@version</div>
          <div className="col-span-2">publisher</div>
          <div className="col-span-1 text-right">downloads/wk</div>
          <div className="col-span-3">AI confidence</div>
          <div className="col-span-1 text-right">scanned</div>
        </div>
        <ol className="divide-y divide-foreground/15">
          {ordered.map((s, i) => {
            const t = bucket(s.aiConfidence);
            const row = (
              <div className="grid grid-cols-12 items-center gap-2 px-3 py-2 text-sm">
                <div className="col-span-1 font-mono text-[11px] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="col-span-4 min-w-0">
                  <div className="truncate font-mono">
                    <span className="font-semibold">{s.name}</span>
                    <span className="text-muted-foreground">@{s.version}</span>
                    {s.zeroDays > 0 && (
                      <span className="ml-2 brutal-border bg-destructive px-1 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-destructive-foreground">
                        {s.zeroDays} 0-DAY
                      </span>
                    )}
                  </div>
                  <div className="truncate font-mono text-[11px] text-muted-foreground">
                    {s.note}
                  </div>
                </div>
                <div className="col-span-2 truncate font-mono text-[11px] text-muted-foreground">
                  {s.publisher}
                </div>
                <div className="col-span-1 text-right font-mono text-[11px] text-muted-foreground">
                  {formatNumber(s.downloads)}
                </div>
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <div className="brutal-border h-2 w-full bg-secondary">
                      <div className={`h-full ${t.bg}`} style={{ width: `${s.aiConfidence}%` }} />
                    </div>
                    <span className="w-16 shrink-0 text-right font-mono text-[11px]">
                      {s.aiConfidence} <span className="text-muted-foreground">{t.label}</span>
                    </span>
                  </div>
                </div>
                <div className="col-span-1 text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {relativeTime(s.lastScanned)}
                </div>
              </div>
            );

            return (
              <li key={`${s.name}@${s.version}`} className="hover:bg-secondary/40">
                {s.slug ? (
                  <Link
                    to="/$ecosystem/$slug"
                    params={{ ecosystem: "npm", slug: s.slug }}
                    className="block"
                  >
                    {row}
                  </Link>
                ) : (
                  row
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* mobile stack */}
      <ol className="divide-y divide-foreground/15 md:hidden">
        {ordered.map((s, i) => {
          const t = bucket(s.aiConfidence);
          const inner = (
            <div className="px-3 py-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-mono text-[10px] text-muted-foreground">
                    #{String(i + 1).padStart(2, "0")} · {s.publisher}
                  </div>
                  <div className="truncate font-mono text-sm">
                    <span className="font-semibold">{s.name}</span>
                    <span className="text-muted-foreground">@{s.version}</span>
                  </div>
                </div>
                {s.zeroDays > 0 && (
                  <span className="brutal-border bg-destructive px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-destructive-foreground">
                    {s.zeroDays} 0-DAY
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="brutal-border h-2 w-full bg-secondary">
                  <div className={`h-full ${t.bg}`} style={{ width: `${s.aiConfidence}%` }} />
                </div>
                <span className="w-16 shrink-0 text-right font-mono text-[11px]">
                  {s.aiConfidence} <span className="text-muted-foreground">{t.label}</span>
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>↓ {formatNumber(s.downloads)}/wk</span>
                <span>scan {relativeTime(s.lastScanned)}</span>
              </div>
              <div className="mt-1 font-mono text-[11px] text-muted-foreground">{s.note}</div>
            </div>
          );
          return (
            <li key={`${s.name}@${s.version}`}>
              {s.slug ? (
                <Link
                  to="/$ecosystem/$slug"
                  params={{ ecosystem: "npm", slug: s.slug }}
                  className="block hover:bg-secondary/40"
                >
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </li>
          );
        })}
      </ol>

      <div className="brutal-border-t flex items-center justify-between bg-secondary/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <span>priority = AI conf · 1.0 + log₁₀(downloads) · 4 + 0-days · 12</span>
        <Link to="/$ecosystem" params={{ ecosystem: "npm" }} className="underline">
          all npm →
        </Link>
      </div>
    </section>
  );
}
