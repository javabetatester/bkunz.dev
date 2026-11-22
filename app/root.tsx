import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useLocation } from "react-router";
import type { Route } from "./+types/root";
import { langFromPath } from "./content/copy";
import { CollisionProbe } from "./components/dev/CollisionProbe";
import { SmoothScroll } from "./components/layout/SmoothScroll";
import "lenis/dist/lenis.css";
import "./app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  const lang = langFromPath(useLocation().pathname);
  return (
    <html lang={lang === "pt-br" ? "pt-BR" : lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0e1116" />
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <Meta />
        <Links />
      </head>
      <body className="bg-canvas font-mono text-fg">
        {children}
        <SmoothScroll />
        {import.meta.env.DEV ? <CollisionProbe /> : null}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const status = isRouteErrorResponse(error) ? error.status : 500;
  return (
    <main className="grid min-h-dvh place-items-center p-gutter">
      <p className="text-body text-muted">
        <span className="text-accent">$</span> exit {status}
      </p>
    </main>
  );
}
