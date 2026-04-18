import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/methodology")({
  head: () => ({
    meta: [
      { title: "Methodology — How ZeroDayShield discovers zero-days" },
      {
        name: "description",
        content:
          "The pipeline behind ZeroDayShield: ingestion, static + behavioral analysis, exploitability triage, and coordinated disclosure.",
      },
      { property: "og:title", content: "ZeroDayShield · Methodology" },
      {
        property: "og:description",
        content: "How we hunt zero-days across the open-source supply chain.",
      },
    ],
  }),
  component: MethodologyPage,
});

const STAGES = [
  {
    id: "01",
    name: "Continuous ingestion",
    body: "Every new release on npm, Docker Hub, GHCR, the MCP registry, and Hugging Face is mirrored into a content-addressed store within minutes of publication.",
    stat: "~14k artifacts / hr",
  },
  {
    id: "02",
    name: "Static decomposition",
    body: "Tarballs and OCI layers are unpacked, normalized, and fed through ASTs, opcode analyzers, and pickle/safetensor walkers to surface obfuscation, network sinks, and serialization sinks.",
    stat: "27 detectors",
  },
  {
    id: "03",
    name: "Behavioral sandbox",
    body: "Suspicious artifacts are detonated inside ephemeral microVMs with full syscall, DNS, and filesystem tracing. We diff observed behavior against a learned baseline per ecosystem.",
    stat: "Firecracker · gVisor",
  },
  {
    id: "04",
    name: "Exploitability triage",
    body: "Researchers reproduce the finding, score it under CVSS 3.1, write a minimal PoC, and confirm the affected version range against upstream tags.",
    stat: "Human in the loop",
  },
  {
    id: "05",
    name: "Coordinated disclosure",
    body: "Maintainer is notified with a 90-day clock. Embargo is lifted on patch release or expiry, whichever comes first. Advisory ships with patch diff and detection rules.",
    stat: "90 days · firm",
  },
];

function MethodologyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="brutal-border-b">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            / methodology
          </div>
          <h1 className="mt-2 font-display text-4xl md:text-6xl">
            Five stages, no shortcuts.
          </h1>
          <p className="mt-4 max-w-2xl text-foreground/80">
            The pipeline behind every advisory you see in the feed. Built and
            operated by a single research team. Open-sourced where possible.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-0 brutal-border">
          {STAGES.map((s, i) => (
            <div
              key={s.id}
              className={`grid gap-6 p-6 md:grid-cols-12 md:p-10 ${i !== 0 ? "brutal-border-t" : ""}`}
            >
              <div className="md:col-span-2">
                <div className="font-display text-5xl text-destructive">{s.id}</div>
              </div>
              <div className="md:col-span-7">
                <h2 className="font-display text-2xl">{s.name}</h2>
                <p className="mt-2 text-foreground/80">{s.body}</p>
              </div>
              <div className="md:col-span-3">
                <div className="brutal-border inline-block bg-secondary px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest">
                  {s.stat}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
