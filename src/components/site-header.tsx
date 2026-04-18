import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Home" },
  { to: "/advisories", label: "Advisories" },
  { to: "/methodology", label: "Methodology" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 brutal-border-b bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 md:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <div className="brutal-border flex h-9 w-9 items-center justify-center bg-foreground text-background">
            <span className="font-display text-lg leading-none">0</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-base tracking-tight">ZERODAYSHIELD</span>
            <span className="font-mono text-[10px] uppercase text-muted-foreground">
              threat intel · independent
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="brutal-border px-3 py-1.5 font-mono text-xs uppercase tracking-wider hover:bg-foreground hover:text-background"
              activeProps={{ className: "bg-foreground text-background" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/advisories"
          className="brutal-border bg-destructive px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-destructive-foreground brutal-shadow-sm brutal-hover"
        >
          Live Feed →
        </Link>
      </div>

      {/* Mobile nav */}
      <div className="brutal-border-t flex items-center gap-0 overflow-x-auto md:hidden">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="flex-1 whitespace-nowrap px-3 py-2 text-center font-mono text-[11px] uppercase tracking-wider"
            activeProps={{ className: "bg-foreground text-background" }}
            activeOptions={{ exact: l.to === "/" }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
