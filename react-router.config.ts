import type { Config } from "@react-router/dev/config";
import { ALL_PATHS, postPaths, projectPaths } from "./app/content/pages";
import { readdirSync, readFileSync } from "node:fs";
import { PROJECTS } from "./app/content/projects";

const postSlugs = () =>
  readdirSync("app/content/posts")
    .filter((f) => f.endsWith(".ts") && f !== "index.ts" && f !== "types.ts")
    .filter((f) => !/const post: Post \| null = null|draft: true/.test(readFileSync(`app/content/posts/${f}`, "utf8")))
    .map((f) => f.replace(/\.ts$/, ""));

export default {
  ssr: false,
  prerender: [...ALL_PATHS, ...projectPaths(PROJECTS.map((p) => p.slug)), ...postPaths(postSlugs())],
} satisfies Config;
