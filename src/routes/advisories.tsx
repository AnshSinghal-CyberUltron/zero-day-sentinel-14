import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AdvisoryCard } from "@/components/advisory-card";
import {
  advisories,
  ECOSYSTEM_LABEL,
  type Ecosystem,
  type Severity,
} from "@/data/advisories";

export const Route = createFileRoute("/advisories")({
  head: () => ({
    meta: [
      { title: "Advisories — ZeroDayShield zero-day research feed" },
      {
        name: "description",
        content:
          "Browse zero-day advisories across npm, Docker, MCP servers, and Hugging Face models, filterable by ecosystem and severity.",
      },
      { property: "og:title", content: "ZeroDayShield · Advisory feed" },
      {
        property: "og:description",
        content: "Zero-day disclosures across the open-source supply chain.",
      },
    ],
  }),
  component: AdvisoriesPage,
});

const ECOS: (Ecosystem | "all")[] = ["all", "npm", "docker", "mcp", "huggingface"];
const SEVS: (Severity | "ALL")[] = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

function AdvisoriesPage() {
  const [eco, setEco] = useState<Ecosystem | "all">("all");
  const [sev, setSev] = useState<Severity | "ALL">("ALL");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return advisories.filter((a) => {
      if (eco !== "all" && a.ecosystem !== eco) return false;
      if (sev !== "ALL" && a.severity !== sev) return false;
      if (q && !`${a.packageName} ${a.title} ${a.id}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      return true;
    });
  }, [eco, sev, q]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="brutal-border-b">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            / advisories
          </div>
          <h1 className="mt-2 font-display text-4xl md:text-6xl">The feed.</h1>
          <p className="mt-4 max-w-2xl text-foreground/80">
            Every zero-day we've disclosed. Filter by ecosystem, severity, or search
            by package name and CVE-equivalent ID.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="brutal-border-b bg-secondary">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex flex-wrap gap-2">
            {ECOS.map((e) => (
              <button
                key={e}
                onClick={() => setEco(e)}
                className={`brutal-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest brutal-hover ${
                  eco === e ? "bg-foreground text-background" : "bg-card"
                }`}
              >
                {e === "all" ? "ALL" : ECOSYSTEM_LABEL[e]}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {SEVS.map((s) => (
              <button
                key={s}
                onClick={() => setSev(s)}
                className={`brutal-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest brutal-hover ${
                  sev === s ? "bg-destructive text-destructive-foreground" : "bg-card"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-4 md:px-8">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="grep advisories… (package, title, ZDS-ID)"
            className="brutal-border w-full bg-card px-4 py-2.5 font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:bg-background"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="mb-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {filtered.length} / {advisories.length} matching records
        </div>
        {filtered.length === 0 ? (
          <div className="brutal-border bg-card p-12 text-center font-mono text-sm uppercase tracking-widest text-muted-foreground">
            ∅ no matching advisories
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filtered.map((a) => (
              <AdvisoryCard key={a.id} advisory={a} />
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
