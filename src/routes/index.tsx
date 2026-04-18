import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StatusBar } from "@/components/status-bar";
import { EcosystemStatCard } from "@/components/ecosystem-stat-card";
import { ZeroDayTable } from "@/components/zero-day-table";
import { ArtifactCard } from "@/components/artifact-card";
import { DiscoveryTrend } from "@/components/discovery-trend";
import { SeverityDonut } from "@/components/severity-donut";
import {
  advisories,
  artifacts,
  ecosystemStats,
  ECOSYSTEM_LABEL,
  type Ecosystem,
} from "@/data/advisories";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZeroDayShield — Live zero-day feed: npm, Docker, MCP, Hugging Face" },
      {
        name: "description",
        content:
          "Continuous AI-assisted scanning of the open-source supply chain. Live zero-day feed across npm, Docker images, MCP servers, and Hugging Face models.",
      },
      { property: "og:title", content: "ZeroDayShield — Live zero-day research feed" },
      {
        property: "og:description",
        content:
          "Live zero-day disclosures across npm, Docker, MCP, and Hugging Face. Numbers, AI confidence, and sources.",
      },
    ],
  }),
  component: HomePage,
});

const ECOS: Ecosystem[] = ["npm", "docker", "mcp", "huggingface"];

function HomePage() {
  // sort: most recent first
  const recentAdvisories = [...advisories]
    .sort((a, b) => b.discoveredAt.localeCompare(a.discoveredAt))
    .slice(0, 8);

  // top flagged: highest AI confidence × downloads heuristic
  const topArtifacts = [...artifacts]
    .sort((a, b) => b.aiConfidence * Math.log10(b.downloads + 10) - a.aiConfidence * Math.log10(a.downloads + 10))
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <StatusBar />

      {/* ECOSYSTEM SCAN STATS — first thing on the page */}
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-6 md:px-6">
        <SectionHeader code="/scan-targets" title="Surfaces under continuous scan" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ecosystemStats.map((s) => (
            <EcosystemStatCard key={s.ecosystem} stats={s} />
          ))}
        </div>
      </section>

      {/* DISCOVERY TREND — full width chart */}
      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-6">
        <SectionHeader
          code="/discovery-trend"
          title="Zero-days discovered · 30 days"
          aside="stacked by ecosystem"
        />
        <div className="mt-4">
          <DiscoveryTrend />
        </div>
      </section>

      {/* MAIN GRID: vulners-style table + side rail */}
      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-3 flex items-end justify-between">
              <SectionHeader code="/zero-day-feed" title="Latest zero-days" />
              <Link
                to="/zero-days"
                className="brutal-border bg-card px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest brutal-shadow-sm brutal-hover"
              >
                view all →
              </Link>
            </div>
            <ZeroDayTable advisories={recentAdvisories} />
          </div>

          {/* Side rail — severity donut + confidence breakdown + sources */}
          <aside className="space-y-6">
            <SeverityDonut />
            <ConfidenceDistribution />
            <SourcesPanel />
          </aside>
        </div>
      </section>

      {/* TOP FLAGGED ARTIFACTS — HF-style cards */}
      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-6">
        <SectionHeader
          code="/top-flagged"
          title="Most flagged artifacts"
          aside="ranked by AI confidence × distribution reach"
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topArtifacts.map((a) => (
            <ArtifactCard key={a.slug} artifact={a} />
          ))}
        </div>
      </section>

      {/* PER-ECOSYSTEM jump links */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <SectionHeader code="/browse" title="Browse by ecosystem" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ECOS.map((eco) => {
            const count = artifacts.filter((a) => a.ecosystem === eco).length;
            const advCount = advisories.filter((a) => a.ecosystem === eco).length;
            return (
              <Link
                key={eco}
                to="/$ecosystem"
                params={{ ecosystem: eco }}
                className="brutal-border bg-card p-4 brutal-hover"
              >
                <div className="font-display text-lg">{ECOSYSTEM_LABEL[eco]}</div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {count} flagged · {advCount} zero-days →
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function SectionHeader({ code, title, aside }: { code: string; title: string; aside?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {code}
        </span>
        <h2 className="font-display text-xl md:text-2xl">{title}</h2>
      </div>
      {aside && (
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {aside}
        </span>
      )}
    </div>
  );
}

function ConfidenceDistribution() {
  const buckets = [
    { label: "90–100", min: 90, color: "bg-[var(--severity-critical)]" },
    { label: "75–89", min: 75, color: "bg-[var(--severity-high)]" },
    { label: "50–74", min: 50, color: "bg-[var(--severity-medium)]" },
    { label: "0–49", min: 0, color: "bg-[var(--severity-low)]" },
  ];
  const counted = buckets.map((b, i) => {
    const max = i === 0 ? 101 : buckets[i - 1].min;
    const count = artifacts.filter((a) => a.aiConfidence >= b.min && a.aiConfidence < max).length;
    return { ...b, count };
  });
  const total = artifacts.length;

  return (
    <div className="brutal-border bg-card">
      <div className="brutal-border-b bg-foreground px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-background">
        /ai-confidence-distribution
      </div>
      <div className="space-y-2 p-3">
        {counted.map((b) => {
          const pct = total === 0 ? 0 : Math.round((b.count / total) * 100);
          return (
            <div key={b.label}>
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
                <span>{b.label}</span>
                <span className="text-muted-foreground">
                  {b.count} · {pct}%
                </span>
              </div>
              <div className="brutal-border mt-1 h-2 w-full bg-secondary">
                <div className={`h-full ${b.color}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SourcesPanel() {
  const sources = [
    { label: "npm registry", url: "registry.npmjs.org" },
    { label: "Docker Hub", url: "hub.docker.com" },
    { label: "GHCR", url: "ghcr.io" },
    { label: "MCP registry", url: "registry.modelcontextprotocol.io" },
    { label: "Hugging Face hub", url: "huggingface.co" },
  ];
  return (
    <div className="brutal-border bg-card">
      <div className="brutal-border-b bg-foreground px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-background">
        /scan-sources
      </div>
      <ul className="divide-y divide-foreground/15">
        {sources.map((s) => (
          <li key={s.url} className="flex items-center justify-between px-3 py-2">
            <span className="font-mono text-xs">{s.label}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {s.url}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
