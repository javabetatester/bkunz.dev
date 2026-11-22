import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { irisNavigate } from "~/components/layout/iris";
import { smoothScroll } from "~/components/layout/smoothScroll";

export type ShellLink = { key: string; label: string; href: string; meta?: string; current?: boolean };
export type ShellSection = { id: string; title: string; group?: string };

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

/** A documentation page: a left panel anchored from the top of the page to the bottom (siblings and on-this-page), the content on the right. */
export function DocShell({ back, siblingsLabel, siblings, sections, children }: { back: { label: string; href: string }; siblingsLabel: string; siblings: ShellLink[]; sections: ShellSection[]; children: ReactNode }) {
  const navigate = useNavigate();
  const active = useActiveSection(sections.map((s) => s.id));
  const groups = [...new Set(sections.map((s) => s.group ?? ""))];
  const at = siblings.findIndex((s) => s.current);
  const current = siblings[at];
  const prev = siblings.length > 1 ? siblings[(at - 1 + siblings.length) % siblings.length] : undefined;
  const next = siblings.length > 1 ? siblings[(at + 1) % siblings.length] : undefined;

  return (
    <div className="lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)]">
      <aside className="border-b border-line bg-sunken/60 lg:sticky lg:top-[var(--spacing-bar)] lg:h-[calc(100svh-var(--spacing-bar))] lg:border-b-0 lg:border-r">
        <div data-lenis-prevent className="thin-scroll flex h-full flex-col gap-7 overflow-y-auto overscroll-contain px-5 py-6">
          <Link to={back.href} onClick={(e) => irisNavigate(e, back.href, navigate)} className="group inline-flex items-center gap-2 text-meta text-muted hover:text-fg">
            <IconArrowLeft size={14} stroke={1.5} className="transition-transform duration-200 ease-thumb group-hover:-translate-x-0.5" />
            {back.label}
          </Link>

          {current ? (
            <div className="flex flex-col gap-0.5 border-b border-line pb-5">
              <span className="text-meta text-faint">~/{siblingsLabel}/</span>
              <span className="text-title text-fg">{current.label}</span>
              {current.meta ? <span className="text-meta text-muted">{current.meta}</span> : null}
            </div>
          ) : null}

          {sections.length ? (
            <nav aria-label="on this page" className="flex flex-col gap-4">
              {groups.map((g) => (
                <div key={g || "all"} className="flex flex-col gap-0.5">
                  <span className="mb-1 text-meta text-faint">{g ? `~/${g}` : "~/on this page"}</span>
                  {sections
                    .filter((s) => (s.group ?? "") === g)
                    .map((s) => (
                      <a
                        key={s.id}
                        href={`#${s.id}`}
                        onClick={smoothScroll}
                        aria-current={active === s.id ? "location" : undefined}
                        className={`relative py-1 pl-3 text-meta transition-colors duration-150 ease-out before:absolute before:left-0 before:top-1/2 before:h-3.5 before:w-0.5 before:-translate-y-1/2 before:transition-colors before:duration-200 ${active === s.id ? "text-fg before:bg-accent" : "text-muted before:bg-line-strong hover:text-fg"}`}
                      >
                        {s.title}
                      </a>
                    ))}
                </div>
              ))}
            </nav>
          ) : (
            <p className="text-meta text-faint">~/on this page · in writing</p>
          )}

          <nav aria-label={siblingsLabel} className="mt-auto grid grid-cols-2 gap-2 border-t border-line pt-4">
            {[prev, next].map((s, i) =>
              s ? (
                <Link
                  key={`${s.key}-${i}`}
                  to={s.href}
                  onClick={(e) => irisNavigate(e, s.href, navigate)}
                  className={`group flex min-w-0 flex-col gap-0.5 rounded-field px-2 py-2 hover:bg-raised ${i ? "items-end text-right" : ""}`}
                >
                  <span className="inline-flex items-center gap-1 text-meta text-faint">
                    {i ? null : <IconArrowLeft size={12} stroke={1.5} />}
                    {i ? "next" : "prev"}
                    {i ? <IconArrowRight size={12} stroke={1.5} /> : null}
                  </span>
                  <span className="w-full truncate text-meta text-muted group-hover:text-fg">{s.label}</span>
                </Link>
              ) : (
                <span key={i} />
              ),
            )}
          </nav>
        </div>
      </aside>
      <div className="min-w-0 px-gutter pb-24">{children}</div>
    </div>
  );
}
