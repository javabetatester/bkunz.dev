import type { Block } from "../docs/types";

export type PostCategory = "daily" | "discoveries" | "studies";

export type Post = {
  slug: string;
  category: PostCategory;
  date: string;
  published: string;
  draft?: boolean;
  title: string;
  summary: string;
  tags: string[];
  project?: string;
  sections: { id: string; title: string; blocks: Block[] }[];
};
