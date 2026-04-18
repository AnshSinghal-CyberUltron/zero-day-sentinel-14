import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="brutal-border brutal-shadow max-w-md bg-card p-8 text-center">
        <div className="font-display text-7xl">404</div>
        <div className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          target / not / found
        </div>
        <p className="mt-4 text-sm text-foreground/80">
          This advisory does not exist — or has been redacted under embargo.
        </p>
        <Link
          to="/"
          className="brutal-border mt-6 inline-block bg-foreground px-4 py-2 font-mono text-xs uppercase tracking-wider text-background brutal-shadow-sm brutal-hover"
        >
          Return to base
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ZeroDayShield — Independent zero-day research across the OSS supply chain" },
      {
        name: "description",
        content:
          "ZeroDayShield publishes continuous zero-day vulnerability research on npm, Docker, MCP servers, and Hugging Face models.",
      },
      { name: "author", content: "ZeroDayShield Research" },
      { property: "og:title", content: "ZeroDayShield" },
      {
        property: "og:description",
        content:
          "Continuous zero-day research across npm, Docker, MCP and Hugging Face.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;600&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
