import type { Severity } from "@/data/advisories";

const STYLES: Record<Severity, string> = {
  CRITICAL: "bg-[var(--severity-critical)] text-white",
  HIGH: "bg-[var(--severity-high)] text-black",
  MEDIUM: "bg-[var(--severity-medium)] text-black",
  LOW: "bg-[var(--severity-low)] text-black",
};

export function SeverityBadge({ severity, cvss }: { severity: Severity; cvss?: number }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 brutal-border px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest ${STYLES[severity]}`}
    >
      {severity}
      {cvss !== undefined && <span className="opacity-80">{cvss.toFixed(1)}</span>}
    </span>
  );
}
