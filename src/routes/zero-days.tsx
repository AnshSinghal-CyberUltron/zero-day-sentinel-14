import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StatusBar } from "@/components/status-bar";
import { ZeroDayTable } from "@/components/zero-day-table";
import {
  advisories,
  ECOSYSTEM_LABEL,
  type Ecosystem,
  type Severity,
} from "@/data/advisories";

export const Route = createFileRoute("/zero-days")({
  head: () => ({
    meta: [
      { title: "Zero-day feed — ZeroDayShield" },
      {
        name: "description",
        content:
          "Searchable feed of every zero-day disclosed by ZeroDayShield across npm, Docker, MCP, and Hugging Face.",
      },
      { property: "og:title", content: "ZeroDayShield · Zero-day feed" },
      {
        property: "og:description",
        content: "Searchable zero-day feed across the open-source supply chain.",
      },
    ],
  }),
  component: ZeroDaysPage,
});

const ECOS: (Ecosystem | "all")[] = ["all", "npm", "docker", "mcp", "huggingface"];
const SEVS: (Severity | "ALL")[] = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

function ZeroDaysPage() {
  const [eco, setEco] = useState<Ecosystem | "all">("all");
  const [sev, setSev] = useState<Severity | "ALL">("ALL");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return advisories
      .filter((a) => {
        if (eco !== "all" && a.ecosystem !== eco) return false;
        if (sev !== "ALL" && a.severity !== sev) return false;
        if (q) {
          const hay = `${a.id} ${a.title} ${a.affectedSlugs.join(" ")} ${a.cwe}`.toLowerCase();
          if (!hay.includes(q.toLowerCase())) return false;
        }
        return true;
      })
      .sort((a, b) => b.discoveredAt.localeCompare(a.discoveredAt));
  }, [eco, sev, q]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <StatusBar />

      <section className="mx-auto max-w-7xl px-4 pb-4 pt-6 md:px-6">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          /zero-days
        </div>
        <h1 className="mt-1 font-display text-3xl md:text-4xl">The feed.</h1>
      </section>

      <section className="brutal-border-y bg-secondary">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex flex-wrap gap-1.5">
            {ECOS.map((e) => (
              <button
                key={e}
                onClick={() => setEco(e)}
                className={`brutal-border px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${
                  eco === e ? "bg-foreground text-background" : "bg-card"
                }`}
              >
                {e === "all" ? "ALL" : ECOSYSTEM_LABEL[e]}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SEVS.map((s) => (
              <button
                key={s}
                onClick={() => setSev(s)}
                className={`brutal-border px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${
                  sev === s ? "bg-destructive text-destructive-foreground" : "bg-card"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-3 md:px-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="grep · ZDS-id · package · CWE · keyword"
            className="brutal-border w-full bg-card px-3 py-2 font-mono text-sm placeholder:text-muted-foreground focus:bg-background focus:outline-none"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {filtered.length} / {advisories.length} matching records
        </div>
        <ZeroDayTable advisories={filtered} />
      </section>

      <SiteFooter />
    </div>
  );
}
