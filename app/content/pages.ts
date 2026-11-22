import { LANGS, LANG_PATH, TABS, type Lang, type Tab } from "./copy";

export const TAB_SEGMENT: Record<Tab, string> = { whoami: "", work: "work", projects: "projects", posts: "posts" };

export const pagePath = (lang: Lang, tab: Tab): string => {
  const base = LANG_PATH[lang] === "/" ? "" : LANG_PATH[lang];
  const segment = TAB_SEGMENT[tab];
  return segment ? `${base}/${segment}` : base || "/";
};

export const ALL_PATHS = LANGS.flatMap((lang) => TABS.map((tab) => pagePath(lang, tab)));

export const projectPaths = (slugs: string[]) => LANGS.flatMap((lang) => slugs.map((slug) => projectPath(lang, slug)));

export const projectPath = (lang: Lang, slug: string): string => {
  const base = LANG_PATH[lang] === "/" ? "" : LANG_PATH[lang];
  return `${base}/project/${slug}`;
};

export const postPath = (lang: Lang, slug: string): string => {
  const base = LANG_PATH[lang] === "/" ? "" : LANG_PATH[lang];
  return `${base}/post/${slug}`;
};

export const postPaths = (slugs: string[]) => LANGS.flatMap((lang) => slugs.map((slug) => postPath(lang, slug)));

export const tabFromPath = (pathname: string): Tab => {
  const parts = pathname.split("/");
  if (parts.includes("project")) return "projects";
  if (parts.includes("post")) return "posts";
  return TABS.find((tab) => TAB_SEGMENT[tab] && parts.includes(TAB_SEGMENT[tab])) ?? "whoami";
};
