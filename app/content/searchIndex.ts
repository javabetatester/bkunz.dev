import type { Lang } from "./copy";
import { DOCS } from "./docs";
import type { Block } from "./docs/types";
import { postPath, projectPath } from "./pages";
import { POSTS } from "./posts";
import { PROJECTS } from "./projects";

export type Entry = { id: string; group: "in projects" | "in posts"; label: string; hint: string; href: string; text: string };

const blockText = (b: Block): string => {
  switch (b.kind) {
    case "p":
    case "callout":
      return b.text;
    case "code":
      return `${b.caption ?? ""} ${b.code}`;
    case "list":
      return b.items.join(" ");
    case "steps":
      return b.items.map((s) => `${s.title} ${s.text}`).join(" ");
    case "table":
      return [b.head.join(" "), ...b.rows.map((r) => r.join(" "))].join(" ");
    case "files":
      return b.items.map((f) => `${f.path} ${f.note}`).join(" ");
    case "scene":
      return b.caption;
  }
};

/** Every doc and post section as a searchable entry, deep-linked to its anchor. */
export function buildIndex(lang: Lang): Entry[] {
  const projects = PROJECTS.flatMap((p) => {
    const doc = DOCS[p.slug]?.[lang] ?? DOCS[p.slug]?.en;
    return (doc?.sections ?? []).map((s) => ({
      id: `doc-${p.slug}-${s.id}`,
      group: "in projects" as const,
      label: s.title,
      hint: p.name,
      href: `${projectPath(lang, p.slug)}#${s.id}`,
      text: s.blocks.map(blockText).join(" ").replace(/\s+/g, " "),
    }));
  });
  const posts = POSTS[lang].flatMap((p) =>
    p.sections.map((s) => ({
      id: `post-${p.slug}-${s.id}`,
      group: "in posts" as const,
      label: s.title,
      hint: p.title,
      href: `${postPath(lang, p.slug)}#${s.id}`,
      text: `${s.blocks.map(blockText).join(" ")} ${p.summary} ${p.tags.join(" ")}`.replace(/\s+/g, " "),
    })),
  );
  return [...projects, ...posts];
}

/** A short excerpt of `text` around the first query word, or "" when the match is not in the text. */
export function snippet(text: string, query: string): string {
  const word = query.toLowerCase().split(/\s+/).find(Boolean);
  if (!word) return "";
  const at = text.toLowerCase().indexOf(word);
  if (at < 0) return "";
  const start = Math.max(0, at - 40);
  return `${start ? "…" : ""}${text.slice(start, at + 80).trim()}…`;
}
