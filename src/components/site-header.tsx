import { Link } from "@tanstack/react-router";
import { ECOSYSTEM_LABEL, ECOSYSTEM_GLYPH, type Ecosystem } from "@/data/advisories";

const ECOS: Ecosystem[] = ["npm", "docker", "mcp", "huggingface"];

const SECONDARY = [
  { to: "/zero-days", label: "Zero-days" },
  { to: "/methodology", label: "Methodology" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 brutal-border-b bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 md:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="brutal-border flex h-8 w-8 items-center justify-center bg-foreground text-background">
            <span className="font-display text-base leading-none">0</span>
          </div>
          <div className="leading-none">
            <div className="font-display text-sm tracking-tight">ZERODAYSHIELD</div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              research feed
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {ECOS.map((eco) => (
            <Link
              key={eco}
              to="/$ecosystem"
              params={{ ecosystem: eco }}
              className="brutal-border px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest hover:bg-foreground hover:text-background"
              activeProps={{ className: "bg-foreground text-background" }}
            >
              {ECOSYSTEM_GLYPH[eco]} {ECOSYSTEM_LABEL[eco]}
            </Link>
          ))}
          <span className="mx-2 h-5 w-px bg-foreground/30" />
          {SECONDARY.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-2 py-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
              activeProps={{ className: "text-foreground underline underline-offset-4" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/zero-days"
          className="brutal-border bg-destructive px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-destructive-foreground brutal-shadow-sm brutal-hover"
        >
          Feed →
        </Link>
      </div>

      {/* Mobile / tablet nav */}
      <div className="brutal-border-t flex items-stretch overflow-x-auto lg:hidden">
        {ECOS.map((eco) => (
          <Link
            key={eco}
            to="/$ecosystem"
            params={{ ecosystem: eco }}
            className="flex-1 whitespace-nowrap px-2 py-2 text-center font-mono text-[10px] uppercase tracking-widest"
            activeProps={{ className: "bg-foreground text-background" }}
          >
            {ECOSYSTEM_GLYPH[eco]} {ECOSYSTEM_LABEL[eco]}
          </Link>
        ))}
      </div>
      <div className="brutal-border-t flex items-stretch overflow-x-auto lg:hidden">
        {SECONDARY.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="flex-1 whitespace-nowrap px-2 py-1.5 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
            activeProps={{ className: "text-foreground bg-secondary" }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
