import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TickerBar } from "@/components/ticker-bar";
import { AdvisoryCard } from "@/components/advisory-card";
import { advisories, stats, ECOSYSTEM_LABEL } from "@/data/advisories";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZeroDayShield — Zero-day research across npm, Docker, MCP & Hugging Face" },
      {
        name: "description",
        content:
          "Independent research feed publishing zero-day vulnerabilities discovered in the open-source supply chain.",
      },
      { property: "og:title", content: "ZeroDayShield — Zero-day research feed" },
      {
        property: "og:description",
        content: "Continuous zero-day disclosures on npm, Docker, MCP and Hugging Face.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const recent = advisories.slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <TickerBar />

      {/* HERO */}
      <section className="relative overflow-hidden brutal-border-b">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-12 md:px-8 md:py-24">
          <div className="md:col-span-8">
            <div className="inline-flex items-center gap-2 brutal-border bg-card px-3 py-1 font-mono text-[11px] uppercase tracking-widest">
              <span className="h-2 w-2 bg-destructive blink" />
              Live research log · v1
            </div>

            <h1 className="mt-6 font-display text-[clamp(2.5rem,7vw,5.75rem)] leading-[0.9]">
              Hunting <span className="text-destructive">zero-days</span>
              <br />
              before they hunt
              <br />
              your build.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/80 md:text-lg">
              ZeroDayShield is an independent research engine that continuously
              audits the open-source supply chain — npm packages, Docker images,
              Model Context Protocol servers, and Hugging Face models — and
              publishes the dirty findings in the open.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/advisories"
                className="brutal-border bg-foreground px-5 py-3 font-mono text-xs uppercase tracking-widest text-background brutal-shadow brutal-hover"
              >
                Read latest advisories →
              </Link>
              <Link
                to="/methodology"
                className="brutal-border bg-card px-5 py-3 font-mono text-xs uppercase tracking-widest brutal-shadow-sm brutal-hover"
              >
                How we hunt
              </Link>
            </div>
          </div>

          {/* Stat block */}
          <div className="md:col-span-4">
            <div className="brutal-border bg-card brutal-shadow-signal">
              <div className="brutal-border-b bg-foreground px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-background">
                /signal · 24h
              </div>
              <dl className="divide-y-2 divide-foreground">
                {[
                  ["Disclosed", stats.totalDisclosed.toString()],
                  ["Ecosystems", stats.ecosystems.toString()],
                  ["Packages scanned", stats.packagesScanned],
                  ["MTTD", stats.meanTimeToDisclose],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between px-4 py-3">
                    <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      {k}
                    </dt>
                    <dd className="font-display text-3xl">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ECOSYSTEM GRID */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <SectionHeader index="01" title="Surface under watch" />
        <div className="mt-10 grid gap-0 brutal-border md:grid-cols-4">
          {(Object.keys(ECOSYSTEM_LABEL) as Array<keyof typeof ECOSYSTEM_LABEL>).map((eco, i) => {
            const count = advisories.filter((a) => a.ecosystem === eco).length;
            return (
              <div
                key={eco}
                className={`p-6 ${i !== 0 ? "brutal-border-t md:border-t-0 md:border-l-2 md:border-l-foreground" : ""}`}
              >
                <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  Surface 0{i + 1}
                </div>
                <div className="mt-3 font-display text-2xl">{ECOSYSTEM_LABEL[eco]}</div>
                <div className="mt-6 flex items-baseline justify-between">
                  <span className="font-display text-5xl">{count}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    open advisories
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* RECENT ADVISORIES */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24">
        <div className="flex items-end justify-between gap-4">
          <SectionHeader index="02" title="Latest disclosures" />
          <Link
            to="/advisories"
            className="brutal-border hidden bg-card px-3 py-1.5 font-mono text-xs uppercase tracking-wider brutal-shadow-sm brutal-hover md:inline-block"
          >
            View all →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {recent.map((a) => (
            <AdvisoryCard key={a.id} advisory={a} />
          ))}
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="brutal-border-t bg-foreground text-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-12 md:px-8">
          <div className="md:col-span-4">
            <div className="font-mono text-[11px] uppercase tracking-widest text-background/60">
              /manifesto
            </div>
            <div className="mt-2 font-display text-3xl leading-tight">
              The supply chain is the product.
            </div>
          </div>
          <div className="space-y-6 md:col-span-8">
            {[
              "We publish what others embargo. Coordinated disclosure within 90 days, no exceptions for vendor convenience.",
              "Every finding is reproducible. PoC, vector, affected versions, patch diff — never a vibe.",
              "We don't sell findings. The feed is free. The infrastructure is independently funded.",
            ].map((line, i) => (
              <p key={i} className="border-l-4 border-destructive pl-4 text-lg leading-relaxed">
                <span className="mr-3 font-mono text-xs text-destructive">0{i + 1}</span>
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function SectionHeader({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-end gap-4">
      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        / {index}
      </span>
      <h2 className="font-display text-3xl md:text-4xl">{title}</h2>
    </div>
  );
}
