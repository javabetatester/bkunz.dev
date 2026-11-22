import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { IconBrandGithub, IconBrandLinkedin, IconBrandX, IconChevronDown, IconSearch } from "@tabler/icons-react";
import { LANGS, LANG_LABEL, LINKS, TABS, type Lang, type Tab } from "~/content/copy";
import { pagePath } from "~/content/pages";
import { usePage } from "~/content/useCopy";
import { irisNavigate } from "~/components/layout/iris";
import { CommandPalette, usePaletteShortcut } from "~/components/layout/CommandPalette";

const ICONS = { github: IconBrandGithub, linkedin: IconBrandLinkedin, x: IconBrandX } as const;
const LANG_NAME: Record<Lang, string> = { en: "English", es: "Español", "pt-br": "Português" };

function TabLinks({ lang, tab, className }: { lang: Lang; tab: Tab; className: string }) {
  const navigate = useNavigate();
  return (
    <nav aria-label="Sections" className={className}>
      {TABS.map((t) => {
        const to = pagePath(lang, t);
        const current = t === tab;
        return (
          <Link
            key={t}
            to={to}
            aria-current={current ? "page" : undefined}
            onClick={(e) => irisNavigate(e, to, navigate)}
            className={`relative flex min-h-11 items-center px-1 transition-colors duration-150 ease-out ${current ? "text-fg" : "text-muted hover:text-fg"}`}
          >
            <span className="text-faint">~/</span>
            <span className="relative">
              {t}
              {current && <span aria-hidden="true" className="tab-thumb absolute -inset-x-1.5 -bottom-[calc((2.75rem-1lh)/2)] h-[3px] rounded-full bg-accent" />}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function LangMenu({ lang, tab }: { lang: Lang; tab: Tab }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => ref.current?.contains(e.target as Node) || setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={LANG_NAME[lang]}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-11 items-center gap-1.5 rounded-field px-2 text-muted transition-colors duration-150 ease-out hover:text-fg"
      >
        <span className="uppercase">{LANG_LABEL[lang]}</span>
        <IconChevronDown size={14} stroke={1.5} className={`transition-transform duration-300 ease-thumb ${open ? "rotate-180" : ""}`} />
      </button>
      <ul
        className={`absolute right-0 top-full z-50 mt-1 min-w-36 origin-top-right rounded-field border border-line-strong bg-raised p-1 transition-[opacity,translate] duration-200 ease-settle ${open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"}`}
      >
        {LANGS.map((l) => {
          const to = pagePath(l, tab);
          return (
            <li key={l}>
              <Link
                to={to}
                hrefLang={l}
                lang={l}
                tabIndex={open ? 0 : -1}
                aria-current={l === lang ? "page" : undefined}
                onClick={(e) => {
                  setOpen(false);
                  irisNavigate(e, to, navigate);
                }}
                className={`flex min-h-11 items-center justify-between gap-4 rounded-field px-3 transition-colors duration-150 ease-out hover:bg-canvas ${l === lang ? "text-fg" : "text-muted hover:text-fg"}`}
              >
                {LANG_NAME[l]}
                <span className="text-faint uppercase">{LANG_LABEL[l]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SiteHeader() {
  const { lang, tab } = usePage();
  const [paletteOpen, setPaletteOpen] = useState(false);
  usePaletteShortcut(setPaletteOpen);
  const navigate = useNavigate();
  const home = pagePath(lang, "whoami");
  return (
    <>
      <header className="site-header sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur-sm">
        <div className="flex h-bar items-center gap-6 px-gutter text-meta">
          <Link to={home} onClick={(e) => irisNavigate(e, home, navigate)} className="whitespace-nowrap text-title text-fg">
            <span className="text-accent">&gt;</span> <span className="text-muted">~/</span>bkunz<span className="text-accent">.dev</span>
          </Link>
          <TabLinks lang={lang} tab={tab} className="hidden flex-1 items-center justify-center gap-9 text-body md:flex" />
          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Search (Ctrl K)"
              className="mr-1 flex min-h-9 items-center gap-2 rounded-field border border-line-strong px-2.5 text-meta text-muted transition-colors duration-150 ease-out hover:border-accent hover:text-fg"
            >
              <IconSearch size={14} stroke={1.5} />
              <span className="hidden lg:inline">search</span>
              <kbd className="hidden rounded border border-line px-1 text-faint sm:inline">ctrl k</kbd>
            </button>
            <LangMenu lang={lang} tab={tab} />
            {LINKS.map((link) => {
              const Icon = ICONS[link.id];
              return (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="grid size-11 place-items-center text-muted transition-colors duration-150 ease-out hover:text-fg"
                >
                  <Icon size={18} stroke={1.5} />
                </a>
              );
            })}
          </div>
        </div>
      </header>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <TabLinks
        lang={lang}
        tab={tab}
        className="site-tabbar fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-line bg-canvas/95 px-2 pb-[env(safe-area-inset-bottom)] text-meta backdrop-blur-sm md:hidden"
      />
    </>
  );
}
