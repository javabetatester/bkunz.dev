import type { Lang } from "../copy";
import type { Post } from "./types";

const modules = import.meta.glob<{ default: Post | null }>(["./*.ts", "!./index.ts", "!./types.ts"], { eager: true });

const POSTS_EN: Post[] = Object.values(modules)
  .map((m) => m.default)
  .filter((p): p is Post => p !== null && !p.draft)
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

export const POSTS: Record<Lang, Post[]> = { en: POSTS_EN, es: POSTS_EN, "pt-br": POSTS_EN };

export const postFor = (slug: string, lang: Lang): Post | undefined =>
  POSTS[lang].find((p) => p.slug === slug) ?? POSTS.en.find((p) => p.slug === slug);
