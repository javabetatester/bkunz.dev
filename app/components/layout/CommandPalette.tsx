import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { IconArrowUpRight, IconCornerDownLeft, IconFileText, IconFolder, IconLanguage, IconLayoutDashboard, IconSearch } from "@tabler/icons-react";
import { LANGS, LINKS, TABS, type Lang } from "~/content/copy";
import { pagePath, postPath, projectPath } from "~/content/pages";
import { POSTS } from "~/content/posts";
import { PROJECTS } from "~/content/projects";
import { usePage } from "~/content/useCopy";

type Item = { id: string; group: string; label: string; hint?: string; href: string; external?: boolean; icon: typeof IconFolder; text?: string; excerpt?: string };

const LANG_NAME: Record<Lang, string> = { en: "English", es: "Español", "pt-br": "Português" };

function useItems(): Item[] {
  const { lang, tab } = usePage();
  return useMemo(
    () => [
      ...TABS.map((t) => ({ id: `page-${t}`, group: "pages", label: `~/${t}`, href: pagePath(lang, t), icon: IconLayoutDashboard })),
      ...PROJECTS.map((p) => ({ id: `project-${p.slug}`, group: "projects", label: p.name, hint: p.lang, href: projectPath(lang, p.slug), icon: IconFolder })),
      ...POSTS[lang].map((p) => ({ id: `post-${p.slug}`, group: "posts", label: p.title, hint: `${p.category} · ${p.date}`, href: postPath(lang, p.slug), icon: IconFileText })),
      ...LANGS.filter((l) => l !== lang).map((l) => ({ id: `lang-${l}`, group: "language", label: LANG_NAME[l], hint: l, href: pagePath(l, tab), icon: IconLanguage })),
      ...LINKS.map((l) => ({ id: `link-${l.id}`, group: "elsewhere", label: l.label, href: l.href, external: true, icon: IconArrowUpRight })),
    ],
    [lang, tab],
  );
}

const matches = (item: Item, query: string) => {
  const hay = `${item.label} ${item.hint ?? ""} ${item.group} ${item.text ?? ""}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => hay.includes(word));
};

/** Ctrl/⌘ K command palette: search pages, projects, posts, languages and links; arrows to move, Enter to open, Esc to close. */
export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const items = useItems();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const { lang } = usePage();
  const [deep, setDeep] = useState<Item[]>([]);
  const snip = useRef<((text: string, q: string) => string) | null>(null);
  const [indexLang, setIndexLang] = useState(lang);
  if (indexLang !== lang) {
    setIndexLang(lang);
    setDeep([]);
  }

  useEffect(() => {
    if (!open || deep.length) return;
    let live = true;
    import("~/content/searchIndex").then((m) => {
      if (!live) return;
      snip.current = m.snippet;
      setDeep(m.buildIndex(lang).map((e) => ({ ...e, icon: e.group === "in posts" ? IconFileText : IconFolder })));
    });
    return () => {
      live = false;
    };
  }, [open, lang, deep.length]);

  const results = useMemo(() => {
    const top = items.filter((i) => matches(i, query));
    if (query.trim().length < 2) return top;
    const inside = deep
      .filter((i) => matches(i, query))
      .slice(0, 40)
      .map((i) => ({ ...i, excerpt: snip.current?.(i.text ?? "", query) ?? "" }));
    return [...top, ...inside];
  }, [items, deep, query]);

  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    const previous = document.activeElement as HTMLElement | null;
    setQuery("");
    setIndex(0);
    input.current?.focus();
    return () => {
      window.__lenis?.start();
      previous?.focus();
    };
  }, [open]);

  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-index="${index}"]`)?.scrollIntoView({ block: "nearest" });
  }, [index]);

  const go = (item: Item | undefined) => {
    if (!item) return;
    onClose();
    if (item.external) window.open(item.href, "_blank", "noopener,noreferrer");
    else navigate(item.href, { viewTransition: true });
  };

  if (!open) return null;

  let last = "";
  return (
    <div className="fixed inset-0 z-[60] grid place-items-start bg-sunken/70 px-4 pt-[14svh] backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label="Search" className="palette-in mx-auto flex max-h-[min(34rem,70svh)] w-full max-w-xl flex-col overflow-hidden rounded-surface border border-line-strong bg-raised">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <IconSearch size={16} stroke={1.5} className="text-muted" />
          <input
            ref={input}
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setIndex((i) => Math.min(i + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                go(results[index]);
              } else if (e.key === "Escape") {
                e.preventDefault();
                onClose();
              }
            }}
            placeholder="search pages, projects, posts…"
            aria-label="Search"
            aria-controls="palette-results"
            aria-activedescendant={results[index] ? `palette-${results[index].id}` : undefined}
            className="h-12 flex-1 bg-transparent text-body text-fg outline-none placeholder:text-faint"
          />
          <kbd className="rounded-field border border-line-strong px-1.5 py-0.5 text-meta text-muted">esc</kbd>
        </div>
        <ul ref={list} id="palette-results" data-lenis-prevent role="listbox" className="thin-scroll flex-1 overflow-y-auto p-2">
          {results.length === 0 ? <li className="px-3 py-6 text-center text-meta text-faint">no match</li> : null}
          {results.map((item, i) => {
            const header = item.group !== last ? item.group : null;
            last = item.group;
            const Icon = item.icon;
            return (
              <li key={item.id}>
                {header ? <p className="px-3 pb-1 pt-3 text-meta text-faint">~/{header}</p> : null}
                <button
                  type="button"
                  id={`palette-${item.id}`}
                  role="option"
                  aria-selected={i === index}
                  data-index={i}
                  onMouseMove={() => setIndex(i)}
                  onClick={() => go(item)}
                  className={`flex w-full items-center gap-3 rounded-field px-3 py-2 text-left transition-colors duration-100 ${i === index ? "bg-canvas text-fg" : "text-muted"}`}
                >
                  <Icon size={15} stroke={1.5} className={i === index ? "text-accent" : "text-faint"} />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-body">{item.label}</span>
                    {item.excerpt ? <span className="truncate text-meta text-faint">{item.excerpt}</span> : null}
                  </span>
                  {item.hint ? <span className="shrink-0 truncate text-meta text-faint">{item.hint}</span> : null}
                  {i === index ? <IconCornerDownLeft size={13} stroke={1.5} className="shrink-0 text-faint" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="flex gap-4 border-t border-line px-4 py-2 text-meta text-faint">
          <span>↑↓ move</span>
          <span>↵ open</span>
          <span>ctrl k toggle</span>
        </div>
      </div>
    </div>
  );
}

/** Opens the palette on Ctrl/⌘ K or "/" outside text fields. */
export function usePaletteShortcut(setOpen: (fn: (open: boolean) => boolean) => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && /^(INPUT|TEXTAREA)$/.test(e.target.tagName);
      if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(() => true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);
}
