import { Link } from "react-router";
import { NotesScene } from "~/components/iso/scenes";
import { PageHero } from "~/components/docs/PageHero";
import { pagePath, postPath } from "~/content/pages";
import { POSTS } from "~/content/posts";
import { PAGES_COPY } from "~/content/pages-copy";
import { usePage } from "~/content/useCopy";

export default function Page() {
  const { lang, copy } = usePage();
  const t = PAGES_COPY[lang].posts;
  const link = "text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg";
  return (
    <>
      <PageHero title={t.h1} lede={t.lede} status={t.status} figure={<NotesScene label={t.h1} />} next="#posts-grid" hint={copy.hero.scrollHint} />
      <section id="posts-grid" className="flex snap-start flex-col gap-4 px-gutter py-6 lg:h-[calc(100svh-var(--spacing-bar))]">
        <ul className="grid min-h-0 flex-1 gap-3 md:grid-cols-3 lg:grid-rows-[minmax(0,1fr)]">
          {t.categories.map((c, i) => (
            <li key={c.id} className="depth-in flex min-h-56 min-w-0 flex-col gap-3 overflow-hidden rounded-surface border border-line-strong bg-raised p-5 lg:min-h-0" style={{ "--depth": 30 + i * 10 } as React.CSSProperties}>
              <h2 className="text-title text-fg">
                <span className="text-faint">~/</span>
                {c.title}
              </h2>
              <p className="text-body text-muted">{c.body}</p>
              <ul className="thin-scroll -mr-3 flex min-h-24 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain border-t border-line pr-3 pt-3 lg:min-h-0">
                {POSTS[lang].filter((post) => post.category === c.id).map((post) => (
                  <li key={post.slug}>
                    <Link to={postPath(lang, post.slug)} className="group flex flex-col rounded-field px-2 py-1.5 hover:bg-canvas">
                      <span className="text-body text-fg group-hover:text-accent">{post.title}</span>
                      <span className="text-meta text-faint">{post.date}</span>
                    </Link>
                  </li>
                ))}
                {POSTS[lang].some((post) => post.category === c.id) ? null : <li className="text-meta text-faint">{t.empty}</li>}
              </ul>
            </li>
          ))}
        </ul>
        <p className="text-center text-body text-muted">
          {t.backLead}{" "}
          <Link to={pagePath(lang, "work")} className={link}>{t.workLink}</Link> {t.and}{" "}
          <Link to={pagePath(lang, "whoami")} className={link}>{t.whoamiLink}</Link>.
        </p>
      </section>
    </>
  );
}
