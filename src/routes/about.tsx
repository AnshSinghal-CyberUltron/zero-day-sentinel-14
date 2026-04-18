import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — ZeroDayShield research" },
      {
        name: "description",
        content:
          "ZeroDayShield is an independent zero-day research project run by a single security engineer. Learn about the mission and how to get in touch.",
      },
      { property: "og:title", content: "About ZeroDayShield" },
      {
        property: "og:description",
        content: "Independent zero-day research on the open-source supply chain.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="brutal-border-b">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            / about
          </div>
          <h1 className="mt-2 font-display text-4xl md:text-6xl">
            One engineer.
            <br />
            One feed.
            <br />
            <span className="text-destructive">Zero days.</span>
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-12 md:px-8">
        <div className="md:col-span-7">
          <div className="space-y-6 text-base leading-relaxed text-foreground/85 md:text-lg">
            <p>
              ZeroDayShield started as a backend experiment: could a single
              engineer continuously audit the four most malware-prone corners of
              the open-source ecosystem and publish findings in the open?
            </p>
            <p>
              The pipeline now ingests every new artifact pushed to npm,
              Docker Hub, the MCP registry, and Hugging Face — runs them through
              a battery of static, behavioral, and ML-driven detectors — and
              surfaces the hits to a human researcher for triage and
              coordinated disclosure.
            </p>
            <p>
              Every advisory you see in the feed went through that exact loop.
              No bug bounties. No paid embargoes. No vendor friendly massaging.
            </p>
          </div>
        </div>

        <aside className="md:col-span-5">
          <div className="brutal-border bg-card brutal-shadow">
            <div className="brutal-border-b bg-foreground px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-background">
              /contact
            </div>
            <div className="space-y-5 p-6">
              <Field label="Disclosure">security@zerodayshield.dev</Field>
              <Field label="Press">press@zerodayshield.dev</Field>
              <Field label="PGP">0xZD5 · key on request</Field>
              <Field label="Status">independent research · self-funded</Field>
            </div>
          </div>

          <div className="brutal-border mt-6 scan-tape p-1">
            <div className="bg-background p-5">
              <div className="font-display text-lg">Embargo policy</div>
              <p className="mt-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                90 days. Firm. No exceptions for vendor convenience.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <SiteFooter />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-mono text-sm">{children}</div>
    </div>
  );
}
