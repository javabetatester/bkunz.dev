import { Outlet } from "react-router";
import type { Route } from "./+types/layout";
import { COPY, langFromPath } from "~/content/copy";
import { ORIGIN, PERSON_ID, pageMeta } from "~/content/seo";
import { PAGES_COPY } from "~/content/pages-copy";
import { pagePath, tabFromPath } from "~/content/pages";
import { SiteHeader } from "~/components/layout/SiteHeader";
import { SiteFooter } from "~/components/layout/SiteFooter";
import { usePage } from "~/content/useCopy";


export function meta({ location }: Route.MetaArgs) {
  const lang = langFromPath(location.pathname);
  const tab = tabFromPath(location.pathname);
  const { title } = COPY[lang].meta;
  const pages = PAGES_COPY[lang];
  const description = tab === "whoami" ? COPY[lang].meta.description : tab === "work" ? pages.work.lede : tab === "projects" ? pages.projects.lede : pages.posts.lede;
  const pageTitle = tab === "whoami" ? title : `${tab} · ${title}`;
  return pageMeta({
    lang,
    pathFor: (l) => pagePath(l, tab),
    title: pageTitle,
    description,
    type: tab === "whoami" ? "profile" : "website",
    extra: tab === "whoami" ? [{ "@type": "ProfilePage", url: `${ORIGIN}${pagePath(lang, "whoami")}`, mainEntity: { "@id": PERSON_ID } }] : [],
  });
}

export default function Layout() {
  const { tab } = usePage();
  const anchored = tab === "projects" || tab === "posts";
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
