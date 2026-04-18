import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ConfidenceMeter } from "@/components/confidence-meter";
import { ZeroDayTable } from "@/components/zero-day-table";
import {
  getArtifact,
  getAdvisoriesForArtifact,
  ECOSYSTEM_LABEL,
  ECOSYSTEM_GLYPH,
  formatDownloads,
  formatNumber,
  relativeTime,
  type Ecosystem,
} from "@/data/advisories";

const VALID: Ecosystem[] = ["npm", "docker", "mcp", "huggingface"];

export const Route = createFileRoute("/$ecosystem/$slug")({
  loader: ({ params }) => {
    if (!VALID.includes(params.ecosystem as Ecosystem)) throw notFound();
    const eco = params.ecosystem as Ecosystem;
    const artifact = getArtifact(eco, params.slug);
    if (!artifact) throw notFound();
    return { artifact };
  },
  head: ({ loaderData }) => {
    const a = loaderData?.artifact;
    if (!a) return {};
    return {
      meta: [
        { title: `${a.name}@${a.version} — ${a.zeroDayIds.length} zero-day${a.zeroDayIds.length === 1 ? "" : "s"} · ZeroDayShield` },
        {
          name: "description",
          content: `${a.zeroDayIds.length} zero-day disclosure${a.zeroDayIds.length === 1 ? "" : "s"} on ${a.name} (${ECOSYSTEM_LABEL[a.ecosystem]}). AI confidence ${a.aiConfidence}/100.`,
        },
        { property: "og:title", content: `${a.name}@${a.version} · ${ECOSYSTEM_LABEL[a.ecosystem]}` },
        {
          property: "og:description",
          content: `${a.zeroDayIds.length} zero-days · AI confidence ${a.aiConfidence}/100 · ${formatDownloads(a)}`,
        },
      ],
    };
  },
  component: ArtifactDetail,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-3xl p-12 text-center">
        <div className="font-display text-4xl">Artifact not in our index</div>
        <Link to="/" className="mt-4 inline-block underline">← home</Link>
      </div>
    </div>
  ),
});

function ArtifactDetail() {
  const { artifact: a } = Route.useLoaderData() as { artifact: import("@/data/advisories").Artifact };
  const advisories = getAdvisoriesForArtifact(a.ecosystem, a.slug);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="brutal-border-b">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <Link to="/" className="hover:text-foreground">←</Link>
            <Link
              to="/$ecosystem"
              params={{ ecosystem: a.ecosystem }}
              className="hover:text-foreground"
            >
              {ECOSYSTEM_GLYPH[a.ecosystem]} {ECOSYSTEM_LABEL[a.ecosystem]}
            </Link>
            <span>·</span>
            <span>{a.publisher}</span>
          </div>

          <h1 className="mt-3 break-words font-mono text-2xl font-semibold md:text-3xl">
            {a.name}
            <span className="ml-2 text-muted-foreground">@{a.version}</span>
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-foreground/80">{a.description}</p>

          <div className="mt-4 grid gap-0 brutal-border md:grid-cols-4">
            <Stat label="Zero-days" value={a.zeroDayIds.length.toString()} accent />
            <Stat label="AI confidence" value={`${a.aiConfidence}/100`} border />
            <Stat label="Downloads" value={formatDownloads(a)} border />
            <Stat label="Last scan" value={relativeTime(a.lastScanned)} border />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-3 md:px-6">
        <div className="md:col-span-2">
          <div className="mb-3 flex items-baseline gap-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              /zero-days
            </span>
            <h2 className="font-display text-xl">
              {advisories.length} disclosed zero-day{advisories.length === 1 ? "" : "s"}
            </h2>
          </div>
          <ZeroDayTable advisories={advisories} showEcosystem={false} />
        </div>

        <aside className="space-y-4">
          <Block code="/ai-confidence" title="AI confidence">
            <ConfidenceMeter value={a.aiConfidence} />
            <p className="mt-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
              Confidence reflects agreement across our static, behavioral, and ML
              detectors. Above 90 = manually triaged + reproduced.
            </p>
          </Block>

          <Block code="/metadata" title="Artifact metadata">
            <ul className="space-y-2 font-mono text-xs">
              <Field k="ecosystem" v={ECOSYSTEM_LABEL[a.ecosystem]} />
              <Field k="publisher" v={a.publisher} />
              <Field k="version" v={a.version} />
              <Field k="downloads" v={formatNumber(a.downloads)} />
              <Field k="first seen" v={a.firstSeen} />
              <Field k="last scanned" v={relativeTime(a.lastScanned)} />
            </ul>
          </Block>
        </aside>
      </section>

      <SiteFooter />
    </div>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <li className="flex items-baseline justify-between gap-2 border-b border-foreground/10 pb-1">
      <span className="text-muted-foreground uppercase tracking-widest text-[10px]">{k}</span>
      <span className="truncate text-right">{v}</span>
    </li>
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

function Block({ code, title, children }: { code: string; title: string; children: React.ReactNode }) {
  return (
    <div className="brutal-border bg-card">
      <div className="brutal-border-b bg-foreground px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-background">
        {code} · {title}
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}
