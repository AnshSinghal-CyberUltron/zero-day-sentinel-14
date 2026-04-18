import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SeverityBadge } from "@/components/severity-badge";
import { ConfidenceMeter } from "@/components/confidence-meter";
import { ArtifactCard } from "@/components/artifact-card";
import {
  advisoryById,
  getArtifactsForAdvisory,
  ECOSYSTEM_LABEL,
} from "@/data/advisories";

export const Route = createFileRoute("/zero-day/$id")({
  loader: ({ params }) => {
    const advisory = advisoryById.get(params.id);
    if (!advisory) throw notFound();
    return { advisory };
  },
  head: ({ loaderData }) => {
    const a = loaderData?.advisory;
    if (!a) return {};
    return {
      meta: [
        { title: `${a.id} — ${a.title} · ZeroDayShield` },
        { name: "description", content: a.summary.slice(0, 155) },
        { property: "og:title", content: `${a.id} · ${a.severity} · CVSS ${a.cvss}` },
        { property: "og:description", content: a.summary.slice(0, 200) },
      ],
    };
  },
  component: ZeroDayDetail,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-3xl p-12 text-center">
        <div className="font-display text-4xl">Advisory not found</div>
        <Link to="/zero-days" className="mt-4 inline-block underline">
          ← back to feed
        </Link>
      </div>
    </div>
  ),
});

function ZeroDayDetail() {
  const { advisory: a } = Route.useLoaderData();
  const affected = getArtifactsForAdvisory(a);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="brutal-border-b">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <Link to="/zero-days" className="hover:text-foreground">
              ← /zero-days
            </Link>
            <span>·</span>
            <Link
              to="/$ecosystem"
              params={{ ecosystem: a.ecosystem }}
              className="hover:text-foreground"
            >
              {ECOSYSTEM_LABEL[a.ecosystem]}
            </Link>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-semibold">{a.id}</span>
            <SeverityBadge severity={a.severity} cvss={a.cvss} />
            <span className="brutal-border bg-card px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest">
              {a.cwe}
            </span>
            <span className="brutal-border bg-card px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest">
              {a.status}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              disclosed {a.discoveredAt}
            </span>
          </div>

          <h1 className="mt-3 font-display text-2xl leading-tight md:text-4xl">
            {a.title}
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-3 md:px-6">
        <div className="md:col-span-2">
          <Block code="/summary" title="Summary">
            <p className="text-sm leading-relaxed text-foreground/85">{a.summary}</p>
          </Block>

          <Block code="/affected-artifacts" title={`Affected artifacts (${affected.length})`}>
            <div className="grid gap-3 sm:grid-cols-2">
              {affected.map((art) => (
                <ArtifactCard key={art.slug} artifact={art} />
              ))}
            </div>
          </Block>

          <Block code="/poc" title="Proof-of-concept">
            <pre className="brutal-border overflow-x-auto bg-foreground p-3 font-mono text-[11px] leading-relaxed text-background">
              {a.poc ??
                `# Reproduction steps redacted under coordinated disclosure.\n# Full PoC will be published with the advisory at embargo expiry.\n\n$ zds reproduce ${a.id}`}
            </pre>
          </Block>
        </div>

        <aside className="space-y-4">
          <Block code="/ai-confidence" title="AI confidence">
            <ConfidenceMeter value={a.aiConfidence} />
          </Block>

          <Block code="/cvss" title="CVSS 3.1">
            <div className="font-display text-4xl text-destructive">
              {a.cvss.toFixed(1)}
            </div>
            <div className="mt-2 break-all font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {a.vector}
            </div>
          </Block>

          <Block code="/timeline" title="Timeline">
            <ul className="space-y-1.5 font-mono text-[11px]">
              <li>
                <span className="text-muted-foreground">{a.discoveredAt}</span> · discovered
              </li>
              <li>
                <span className="text-muted-foreground">{a.discoveredAt}</span> · vendor notified
              </li>
              <li>
                <span className="text-muted-foreground">+90d</span> · embargo expires
              </li>
            </ul>
          </Block>
        </aside>
      </section>

      <SiteFooter />
    </div>
  );
}

function Block({ code, title, children }: { code: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-baseline gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {code}
        </span>
        <h2 className="font-display text-base">{title}</h2>
      </div>
      <div>{children}</div>
    </div>
  );
}
