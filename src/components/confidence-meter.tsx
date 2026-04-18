interface ConfidenceMeterProps {
  value: number; // 0–100
  size?: "sm" | "md";
  showLabel?: boolean;
}

function tone(value: number) {
  if (value >= 90) return { bg: "bg-[var(--severity-critical)]", text: "text-[var(--severity-critical)]", label: "VERY HIGH" };
  if (value >= 75) return { bg: "bg-[var(--severity-high)]", text: "text-[var(--severity-high)]", label: "HIGH" };
  if (value >= 50) return { bg: "bg-[var(--severity-medium)]", text: "text-foreground", label: "MEDIUM" };
  return { bg: "bg-[var(--severity-low)]", text: "text-foreground", label: "LOW" };
}

export function ConfidenceMeter({ value, size = "md", showLabel = true }: ConfidenceMeterProps) {
  const t = tone(value);
  const h = size === "sm" ? "h-1.5" : "h-2";

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
          <span className="text-muted-foreground">AI confidence</span>
          <span className="text-foreground">
            {value}<span className="text-muted-foreground">/100 · {t.label}</span>
          </span>
        </div>
      )}
      <div className={`brutal-border ${h} w-full bg-secondary`}>
        <div className={`h-full ${t.bg}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
