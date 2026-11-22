import { useParams } from "react-router";
import { IconArrowUpRight } from "@tabler/icons-react";
import { DocBlock } from "~/components/docs/DocBlocks";
import { DocShell } from "~/components/docs/DocShell";
import { smoothScroll } from "~/components/layout/smoothScroll";
import { ProjectScene } from "~/components/iso/projects";
import { docFor } from "~/content/docs";
import type { DocSection } from "~/content/docs/types";
import { pagePath, projectPath } from "~/content/pages";
import { PAGES_COPY } from "~/content/pages-copy";
import { PROJECTS } from "~/content/projects";
import { usePage } from "~/content/useCopy";

const GROUP_LABEL: Record<DocSection["group"], string> = { start: "start", how: "how it works", deep: "low level", decisions: "decisions", reference: "reference" };

export default function ProjectDocPage() {
  const { slug = "" } = useParams();
  const { lang } = usePage();
  const t = PAGES_COPY[lang].projects;
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const project = PROJECTS[index];
  const doc = docFor(slug, lang);
  const sections = doc?.sections ?? [];

  if (!project) {
    return (
      <section className="px-gutter py-24 text-body text-muted">
        <span className="text-accent">$</span> project not found
      </section>
    );
  }

  return (
    <DocShell
      back={{ label: "~/projects", href: pagePath(lang, "projects") }}
      siblingsLabel="projects"
      siblings={PROJECTS.map((p) => ({ key: p.slug, label: p.name, meta: p.lang, href: projectPath(lang, p.slug), current: p.slug === slug }))}
      sections={sections.map((s) => ({ id: s.id, title: s.title, group: GROUP_LABEL[s.group] }))}
    >
      <header className="depth-in flex flex-col gap-4 border-b border-line py-10" style={{ "--depth": 10 } as React.CSSProperties}>
        <h1 className="text-heading text-fg">{project.name}</h1>
        <p className="max-w-[72ch] text-title text-muted">{doc?.tagline ?? project.summary[lang]}</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-meta text-muted">
          <span>{project.lang}</span>
          <span>{project.kind}</span>
          {doc?.status && doc.status !== project.kind ? <span>{doc.status}</span> : null}
          {doc?.facts.map((f) => (
            <span key={f.label}>
              <span className="text-faint">{f.label} </span>
              {f.value}
            </span>
          ))}
          <a href={project.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1 text-fg underline decoration-line-strong underline-offset-4 hover:decoration-accent">
            {project.href.replace(/^https?:\/\//, "")}
            <IconArrowUpRight size={14} stroke={1.5} className="group-hover:text-accent" />
          </a>
        </div>
        <div className="project-visual mt-4 flex h-[clamp(16rem,40svh,24rem)] items-center justify-center">
          <div className="relative z-10 h-full w-full max-w-4xl">
            <ProjectScene slug={project.slug} />
          </div>
        </div>
      </header>

      {doc ? (
        <div className="flex max-w-[80ch] flex-col gap-16 pt-10">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="flex scroll-mt-[calc(var(--spacing-bar)+1.5rem)] flex-col gap-5">
              <h2 className="text-title text-fg">
                <a href={`#${s.id}`} onClick={smoothScroll} className="hover:text-accent">
                  {s.title}
                </a>
              </h2>
              {s.blocks.map((b, i) => (
                <DocBlock key={i} block={b} repo={project.href.includes("github.com") ? project.href : undefined} />
              ))}
            </section>
          ))}
        </div>
      ) : (
        <p className="flex items-center gap-2 py-10 text-body text-muted">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
          {t.status}
        </p>
      )}

    </DocShell>
  );
}
