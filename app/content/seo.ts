import { DEFAULT_LANG, LANGS, type Lang } from "./copy";

export const ORIGIN = "https://bkunz.dev";
const PERSON_ID = `${ORIGIN}/#person`;
const ORG_ID = "https://versatile.sh/#organization";

const hreflang = (l: Lang) => (l === "pt-br" ? "pt-BR" : l);

export const person = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Bernardo Kunz",
  alternateName: ["bk", "javabetatester", "jxstbk"],
  url: `${ORIGIN}/`,
  image: `${ORIGIN}/avatar.webp`,
  jobTitle: "Senior Software Engineer, AI Engineering, Developer Experience & Backend",
  description:
    "AI, developer experience and backend engineer since 2016. Founder of versatile.sh, an open-source project of independent engines: durable execution, agent runtimes, MCP tool gateways and edge execution.",
  knowsAbout: [
    "Developer experience",
    "Performance engineering",
    "Distributed systems",
    "Durable execution",
    "Transactional outbox",
    "Event-driven architecture",
    "Go",
    "Java",
    "TypeScript",
    "PostgreSQL",
    "gRPC",
    "Model Context Protocol",
    "AI engineering",
    "LLM evaluation",
    "Application security",
  ],
  worksFor: { "@id": ORG_ID },
  affiliation: { "@id": ORG_ID },
  sameAs: [
    "https://www.linkedin.com/in/bernardokunz/",
    "https://github.com/javabetatester",
    "https://x.com/jxstbk",
  ],
};

export const organization = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "versatile.sh",
  url: "https://versatile.sh",
  founder: { "@id": PERSON_ID },
  sameAs: ["https://github.com/versatile-sh"],
};

export const LOGO = `${ORIGIN}/icon-512.png`;

const website = { "@type": "WebSite", "@id": `${ORIGIN}/#website`, url: `${ORIGIN}/`, name: "bkunz.dev", inLanguage: LANGS.map(hreflang), publisher: { "@id": PERSON_ID } };

type Crumb = { name: string; path: string };

type MetaInput = {
  lang: Lang;
  pathFor: (lang: Lang) => string;
  title: string;
  description: string;
  type?: "website" | "article" | "profile";
  extra?: Record<string, unknown>[];
  crumbs?: Crumb[];
  published?: string;
};

/** Title, description, canonical, hreflang, Open Graph, Twitter and one JSON-LD graph for a page. */
export function pageMeta({ lang, pathFor, title, description, type = "website", extra = [], crumbs, published }: MetaInput) {
  const url = `${ORIGIN}${pathFor(lang)}`;
  const path = pathFor(lang).replace(/^\/(en|es)(?=\/|$)/, "").replace(/^\/$/, "");
  const tabTitle = `> ~/bkunz.dev${path}`;
  const graph: Record<string, unknown>[] = [person, organization, website, ...extra];
  if (crumbs?.length) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: `${ORIGIN}${c.path}` })),
    });
  }
  return [
    { title: tabTitle },
    { name: "description", content: description },
    { name: "author", content: "Bernardo Kunz" },
    { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
    { property: "og:site_name", content: "bkunz.dev" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: type },
    { property: "og:image", content: `${ORIGIN}/avatar.webp` },
    ...(published ? [{ property: "article:published_time", content: published }] : []),
    { property: "og:locale", content: lang === "pt-br" ? "pt_BR" : lang === "es" ? "es_ES" : "en_US" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:creator", content: "@jxstbk" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    ...LANGS.map((l) => ({ tagName: "link", rel: "alternate", hrefLang: hreflang(l), href: `${ORIGIN}${pathFor(l)}` })),
    { tagName: "link", rel: "alternate", hrefLang: "x-default", href: `${ORIGIN}${pathFor(DEFAULT_LANG)}` },
    { "script:ld+json": { "@context": "https://schema.org", "@graph": graph } },
  ];
}

export { PERSON_ID };
