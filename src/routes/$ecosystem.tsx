import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StatusBar } from "@/components/status-bar";
import { ArtifactCard } from "@/components/artifact-card";
import { ZeroDayTable } from "@/components/zero-day-table";
import {
  ECOSYSTEM_LABEL,
  ECOSYSTEM_GLYPH,
  ecosystemStats,
  getArtifactsByEcosystem,
  getAdvisoriesByEcosystem,
  formatNumber,
  type Ecosystem,
} from "@/data/advisories";

const VALID: Ecosystem[] = ["npm", "docker", "mcp", "huggingface"];

export const Route = createFileRoute("/$ecosystem")({
  loader: ({ params }) => {
    if (!VALID.includes(params.ecosystem as Ecosystem)) throw notFound();
    return { ecosystem: params.ecosystem as Ecosystem };
  },
  head: ({ loaderData }) => {
    const eco = loaderData?.ecosystem;
    if (!eco) return {};
    const label = ECOSYSTEM_LABEL[eco];
    return {
      meta: [
        { title: `${label} zero-days — ZeroDayShield` },
        {
          name: "description",
          content: `Top flagged ${label} artifacts and disclosed zero-days from the ZeroDayShield research feed.`,
        },
        { property: "og:title", content: `${label} · ZeroDayShield` },
        {
          property: "og:description",
          content: `Top flagged ${label} artifacts and disclosed zero-days.`,
        },
      ],
    };
  },
  component: EcosystemPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-3xl p-12 text-center">
        <div className="font-display text-4xl">Ecosystem not tracked</div>
        <Link to="/" className="mt-4 inline-block underline">← home</Link>
      </div>
    </div>
  ),
});

type Sort = "confidence" | "downloads" | "zerodays" | "recent";

function EcosystemPage() {
  const { ecosystem } = Route.useLoaderData();
  const stats = ecosystemStats.find((s) => s.ecosystem === ecosystem)!;
  const allArtifacts = getArtifactsByEcosystem(ecosystem);
  const allAdvisories = getAdvisoriesByEcosystem(ecosystem);

  const [sort, setSort] = useState<Sort>("confidence");
  const [q, setQ] = useState("");

  const sortedArtifacts = useMemo(() => {
    let list = allArtifacts;
    if (q) {
      const needle = q.toLowerCase();
      list = list.filter((a) =>
        `${a.name} ${a.publisher} ${a.description}`.toLowerCase().includes(needle),
      );
    }
    return [...list].sort((a, b) => {
      if (sort === "confidence") return b.aiConfidence - a.aiConfidence;
      if (sort === "downloads") return b.downloads - a.downloads;
      if (sort === "zerodays") return b.zeroDayIds.length - a.zeroDayIds.length;
      return b.lastScanned.localeCompare(a.lastScanned);
    });
  }, [allArtifacts, sort, q]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <StatusBar />

      <section className="brutal-border-b">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            /{ecosystem}
          </div>
          <h1 className="mt-1 flex items-baseline gap-3 font-display text-3xl md:text-4xl">
            <span>{ECOSYSTEM_GLYPH[ecosystem]}</span>
            {ECOSYSTEM_LABEL[ecosystem]}
          </h1>

          <div className="mt-4 grid gap-0 brutal-border md:grid-cols-4">
            <Stat label="Scanned · total" value={formatNumber(stats.scannedTotal)} />
            <Stat label="Scanned · today" value={`+${formatNumber(stats.scannedToday)}`} border />
            <Stat label="Zero-days" value={stats.zeroDaysFound.toString()} border accent />
            <Stat label="Avg AI" value={`${stats.avgConfidence}%`} border />
          </div>
        </div>
      </section>

      {/* Top flagged */}
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              /top-flagged
            </span>
            <h2 className="font-display text-xl">
              {sortedArtifacts.length} flagged artifact{sortedArtifacts.length === 1 ? "" : "s"}
            </h2>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["confidence", "zerodays", "downloads", "recent"] as Sort[]).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`brutal-border px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${
                  sort === s ? "bg-foreground text-background" : "bg-card"
                }`}
              >
                ↓ {s}
              </button>
            ))}
          </div>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`grep ${ECOSYSTEM_LABEL[ecosystem]} artifacts…`}
          className="brutal-border mt-3 w-full bg-card px-3 py-2 font-mono text-sm placeholder:text-muted-foreground focus:bg-background focus:outline-none"
        />

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedArtifacts.map((a) => (
            <ArtifactCard key={a.slug} artifact={a} />
          ))}
        </div>
      </section>

      {/* Zero-days table for this ecosystem */}
      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6">
        <div className="mb-3 flex items-baseline gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            /zero-days
          </span>
          <h2 className="font-display text-xl">
            All {ECOSYSTEM_LABEL[ecosystem]} zero-days
          </h2>
        </div>
        <ZeroDayTable
          advisories={[...allAdvisories].sort((a, b) =>
            b.discoveredAt.localeCompare(a.discoveredAt),
          )}
          showEcosystem={false}
        />
      </section>

      <SiteFooter />
    </div>
  );
}

function Stat({
  label,
  value,
  border,
  accent,
}: {
  label: string;
  value: string;
  border?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={`px-3 py-3 ${border ? "border-t-2 border-foreground md:border-l-2 md:border-t-0" : ""}`}
    >
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className={`mt-0.5 font-display text-2xl ${accent ? "text-destructive" : ""}`}>
        {value}
      </div>
    </div>
  );
}
