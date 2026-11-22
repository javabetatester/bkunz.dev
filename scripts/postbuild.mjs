#!/usr/bin/env node
import { copyFileSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = "build/client";
const ORIGIN = "https://bkunz.dev";
const LANGS = [
  { code: "en", prefix: "", hreflang: "en" },
  { code: "es", prefix: "/es", hreflang: "es" },
  { code: "pt-br", prefix: "/pt-br", hreflang: "pt-BR" },
];
const today = new Date().toISOString().slice(0, 10);

const pages = (dir, base = "") =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return pages(path, `${base}/${name}`);
    return name === "index.html" ? [base || "/"] : [];
  });

const read = (route) => readFileSync(join(OUT, route === "/" ? "" : route, "index.html"), "utf8");
const meta = (html, attr, key) => html.match(new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`))?.[1] ?? "";
const title = (html) => html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
const unescape = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');

const routes = pages(OUT).filter((r) => !r.startsWith("/__"));
const neutral = (r) => {
  const l = LANGS.find((x) => x.prefix && (r === x.prefix || r.startsWith(`${x.prefix}/`)));
  const rest = l ? r.slice(l.prefix.length) || "/" : r;
  return { lang: l ?? LANGS[0], rest };
};
const groups = new Map();
for (const r of routes) {
  const { lang, rest } = neutral(r);
  if (!groups.has(rest)) groups.set(rest, new Map());
  groups.get(rest).set(lang.code, r);
}

const lastmod = (route) => meta(read(route), "property", "article:published_time") || today;
const priority = (rest) => (rest === "/" ? "1.0" : /^\/(work|projects|posts)$/.test(rest) ? "0.8" : "0.6");

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;
for (const [rest, variants] of groups) {
  for (const [, route] of variants) {
    xml += `  <url>\n    <loc>${ORIGIN}${route}</loc>\n    <lastmod>${lastmod(route)}</lastmod>\n    <priority>${priority(rest)}</priority>\n`;
    for (const l of LANGS) {
      const alt = variants.get(l.code);
      if (alt) xml += `    <xhtml:link rel="alternate" hreflang="${l.hreflang}" href="${ORIGIN}${alt}"/>\n`;
    }
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${variants.get("en") ?? route}"/>\n  </url>\n`;
  }
}
xml += "</urlset>\n";
writeFileSync(join(OUT, "sitemap.xml"), xml);

const en = [...groups.entries()].map(([rest, v]) => [rest, v.get("en")]).filter(([, r]) => r);
const line = (r) => {
  const html = read(r);
  return `- [${unescape(meta(html, "property", "og:title") || title(html))}](${ORIGIN}${r}): ${unescape(meta(html, "name", "description"))}`;
};
const section = (label, test) => [`## ${label}`, "", ...en.filter(([rest]) => test(rest)).map(([, r]) => line(r)), ""];
const llms = [
  "# bkunz.dev",
  "",
  "> Personal site of Bernardo Kunz, a backend, distributed systems and AI engineer since 2016 and the founder of versatile.sh (https://versatile.sh), an open-source project of independent engines: durable execution, agent runtimes, MCP tool gateways and edge execution.",
  "",
  "Profiles: https://www.linkedin.com/in/bernardokunz/ · https://github.com/javabetatester · https://x.com/jxstbk · Languages: en (/), es (/es), pt-br (/pt-br).",
  "",
  ...section("Pages", (r) => /^\/(work|projects|posts)?$/.test(r)),
  ...section("Projects", (r) => r.startsWith("/project/")),
  ...section("Posts", (r) => r.startsWith("/post/")),
].join("\n");
writeFileSync(join(OUT, "llms.txt"), llms);
copyFileSync(join(OUT, "__spa-fallback.html"), join(OUT, "404.html"));
console.log(`postbuild: ${routes.length} pages, sitemap.xml and llms.txt written`);
