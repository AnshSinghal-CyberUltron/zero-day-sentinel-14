import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="brutal-border-t mt-24 bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <div className="font-display text-2xl leading-none">ZERODAYSHIELD</div>
          <p className="mt-3 max-w-md font-mono text-xs uppercase tracking-wider text-background/70">
            An independent research initiative continuously hunting zero-day
            vulnerabilities across the open-source supply chain.
          </p>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-wider text-background/50">
            Disclosures follow a 90-day coordinated policy. Contact pgp key on request.
          </p>
        </div>

        <div>
          <div className="font-display text-xs uppercase tracking-wider">Surface</div>
          <ul className="mt-3 space-y-1.5 font-mono text-xs">
            <li>npm registry</li>
            <li>Docker Hub + GHCR</li>
            <li>MCP server registry</li>
            <li>Hugging Face hub</li>
          </ul>
        </div>

        <div>
          <div className="font-display text-xs uppercase tracking-wider">Navigate</div>
          <ul className="mt-3 space-y-1.5 font-mono text-xs">
            <li><Link to="/advisories" className="hover:text-destructive">Advisories</Link></li>
            <li><Link to="/methodology" className="hover:text-destructive">Methodology</Link></li>
            <li><Link to="/about" className="hover:text-destructive">About</Link></li>
          </ul>
        </div>
      </div>

      <div className="brutal-border-t border-background/20 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 font-mono text-[10px] uppercase tracking-wider text-background/60 md:px-8">
          <span>© {new Date().getFullYear()} ZERODAYSHIELD RESEARCH</span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 bg-destructive blink" />
            FEED OPERATIONAL
          </span>
        </div>
      </div>
    </footer>
  );
}
