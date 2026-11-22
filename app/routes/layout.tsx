import { useEffect } from "react";
import { Outlet } from "react-router";
import type { Route } from "./+types/layout";
import { COPY, LANGS, langFromPath } from "~/content/copy";
import { pagePath, tabFromPath } from "~/content/pages";
import { SiteHeader } from "~/components/layout/SiteHeader";
import { SiteFooter } from "~/components/layout/SiteFooter";
import { usePage } from "~/content/useCopy";

const ORIGIN = "https://bkunz.dev";

export function meta({ location }: Route.MetaArgs) {
  const lang = langFromPath(location.pathname);
  const tab = tabFromPath(location.pathname);
  const { title, description } = COPY[lang].meta;
  const pageTitle = tab === "whoami" ? title : `${tab} · ${title}`;
  const url = `${ORIGIN}${pagePath(lang, tab)}`;
  return [
    { title: pageTitle },
    { name: "description", content: description },
    { property: "og:title", content: pageTitle },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:creator", content: "@jxstbk" },
    { tagName: "link", rel: "canonical", href: url },
    ...LANGS.map((l) => ({ tagName: "link", rel: "alternate", hrefLang: l === "pt-br" ? "pt-BR" : l, href: `${ORIGIN}${pagePath(l, tab)}` })),
    { tagName: "link", rel: "alternate", hrefLang: "x-default", href: `${ORIGIN}${pagePath("en", tab)}` },
  ];
}

export default function Layout() {
  const { tab } = usePage();
  const anchored = tab === "projects" || tab === "posts";
  useEffect(() => {
    document.documentElement.classList.toggle("snap-pages", anchored);
  }, [anchored]);
  return (
    <div>
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      {anchored ? null : <SiteFooter />}
    </div>
  );
}
