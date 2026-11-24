import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";
import { LANGS, TABS } from "./content/copy";
import { pagePath, postPath, projectPath } from "./content/pages";

export default LANGS.map((lang) =>
  layout("routes/layout.tsx", { id: `layout-${lang}` }, TABS.map((tab) => {
    const file = `routes/${tab}.tsx`;
    const id = `${tab}-${lang}`;
    const path = pagePath(lang, tab).replace(/^\//, "");
    return path ? route(path, file, { id }) : index(file, { id });
  }).concat(
    route(projectPath(lang, ":slug").slice(1), "routes/project.tsx", { id: `project-${lang}` }),
    route(postPath(lang, ":slug").slice(1), "routes/post.tsx", { id: `post-${lang}` }),
  )),
) satisfies RouteConfig;

