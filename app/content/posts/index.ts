import type { Lang } from "../copy";
import type { Post } from "./types";

type PostModule = { default: Post | null; es?: Post; ptBr?: Post };

const modules = import.meta.glob<PostModule>(["./*.ts", "!./index.ts", "!./types.ts"], { eager: true });

const sorted = (list: Post[]) => list.filter((p) => !p.draft).sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

const pick = (lang: Lang) =>
  sorted(
    Object.values(modules)
      .filter((m): m is PostModule & { default: Post } => m.default !== null)
      .map((m) => (lang === "es" ? m.es : lang === "pt-br" ? m.ptBr : undefined) ?? m.default),
  );

export const POSTS: Record<Lang, Post[]> = { en: pick("en"), es: pick("es"), "pt-br": pick("pt-br") };

export const postFor = (slug: string, lang: Lang): Post | undefined =>
  POSTS[lang].find((p) => p.slug === slug) ?? POSTS.en.find((p) => p.slug === slug);
