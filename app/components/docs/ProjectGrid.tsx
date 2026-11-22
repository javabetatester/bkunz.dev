import { Link, useNavigate } from "react-router";
import { IconArrowUpRight } from "@tabler/icons-react";
import type { Lang } from "~/content/copy";
import { projectPath } from "~/content/pages";
import { PROJECTS } from "~/content/projects";
import { irisNavigate } from "~/components/layout/iris";
import { ProjectScene } from "~/components/iso/projects";

const WIDE = "connector-engine";

/** Bento of projects; each card opens that project's technical doc on this site. */
export function ProjectGrid({ lang }: { lang: Lang }) {
  const navigate = useNavigate();
  return (
    <ul className="grid min-h-0 gap-3 sm:grid-cols-2 lg:h-full lg:grid-cols-4 lg:grid-rows-2">
      {PROJECTS.map((project, i) => {
        const to = projectPath(lang, project.slug);
        return (
          <li
            key={project.slug}
            className={`depth-in min-h-0 min-w-0 ${project.slug === WIDE ? "sm:col-span-2" : ""}`}
            style={{ "--depth": 20 + i * 8 } as React.CSSProperties}
          >
            <Link
              to={to}
              onClick={(e) => irisNavigate(e, to, navigate)}
              className="card-light group relative flex h-full min-h-64 flex-col gap-3 overflow-hidden rounded-surface border border-line-strong bg-raised p-4 transition-colors duration-300 ease-settle hover:border-[rgb(245_245_242/0.28)]"
            >
              <div aria-hidden="true" className="project-visual flex min-h-0 flex-[1.8] items-center justify-center">
                <div className="iso-quiet relative z-10 h-full w-full">
                  <ProjectScene slug={project.slug} />
                </div>
              </div>
              <div className="flex min-h-0 flex-col gap-2">
                <h2 className="truncate pr-5 text-title text-fg">{project.name}</h2>
                <p className="line-clamp-2 text-meta leading-relaxed text-muted">{project.summary[lang]}</p>
                <span className="truncate text-meta text-faint">
                  {project.lang} · {project.kind}
                </span>
              </div>
              <IconArrowUpRight size={16} stroke={1.5} aria-hidden="true" className="absolute right-4 top-4 text-muted transition-[translate,color] duration-300 ease-thumb group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
