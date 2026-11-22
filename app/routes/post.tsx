import { useParams } from "react-router";
import { DocBlock } from "~/components/docs/DocBlocks";
import { DocShell } from "~/components/docs/DocShell";
import { pagePath, postPath, projectPath } from "~/content/pages";
import { POSTS, postFor } from "~/content/posts";
import { usePage } from "~/content/useCopy";
import { langFromPath } from "~/content/copy";
import { ORIGIN, PERSON_ID, pageMeta } from "~/content/seo";
import type { Route } from "./+types/post";

export function meta({ params, location }: Route.MetaArgs) {
  const lang = langFromPath(location.pathname);
  const post = postFor(params.slug ?? "", lang);
  if (!post) return [{ title: "not found · bkunz.dev" }];
  return pageMeta({
    lang,
    pathFor: (l) => postPath(l, post.slug),
    title: `${post.title} · Bernardo Kunz`,
    description: post.summary,
    type: "article",
    published: post.published,
    crumbs: [
      { name: "bkunz.dev", path: pagePath(lang, "whoami") },
      { name: "posts", path: pagePath(lang, "posts") },
      { name: post.title, path: postPath(lang, post.slug) },
    ],
    extra: [
      {
        "@type": "TechArticle",
        headline: post.title,
        description: post.summary,
        url: `${ORIGIN}${postPath(lang, post.slug)}`,
        datePublished: post.published,
        dateCreated: post.date,
        inLanguage: lang === "pt-br" ? "pt-BR" : lang,
        keywords: post.tags.join(", "),
        articleSection: post.category,
        author: { "@id": PERSON_ID },
        ...(post.project === "versatile-sh" ? { about: { "@id": "https://versatile.sh/#organization" } } : {}),
      },
    ],
  });
}

export default function PostPage() {
  const { slug = "" } = useParams();
  const { lang } = usePage();
  const post = postFor(slug, lang);
  const list = POSTS[lang];

  return (
    <DocShell
      back={{ label: "~/posts", href: pagePath(lang, "posts") }}
      siblingsLabel="posts"
      siblings={list.map((p) => ({ key: p.slug, label: p.title, meta: `${p.category} · ${p.date}`, href: postPath(lang, p.slug), current: p.slug === slug }))}
      sections={(post?.sections ?? []).map((s) => ({ id: s.id, title: s.title }))}
    >
      {post ? (
        <article className="flex max-w-[76ch] flex-col">
          <header className="depth-in flex flex-col gap-4 border-b border-line py-10" style={{ "--depth": 10 } as React.CSSProperties}>
            <p className="text-meta text-muted">
              <span className="text-faint">~/{post.category}/</span>
              <span className="text-faint">work </span>
              {post.date}
              {post.published !== post.date ? (
                <>
                  <span className="text-faint"> · published </span>
                  {post.published}
                </>
              ) : null}
            </p>
            <h1 className="text-heading text-fg text-balance">{post.title}</h1>
            <p className="text-title text-muted">{post.summary}</p>
            <ul className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <li key={tag} className="rounded-full border border-line-strong px-2.5 py-0.5 text-meta text-muted">
                  {tag}
                </li>
              ))}
              {post.project ? (
                <li>
                  <a href={projectPath(lang, post.project)} className="rounded-full border border-line-strong px-2.5 py-0.5 text-meta text-fg underline-offset-4 hover:border-accent">
                    ~/project/{post.project}
                  </a>
                </li>
              ) : null}
            </ul>
          </header>
          <div className="flex flex-col gap-14 pt-10">
            {post.sections.map((s) => (
              <section key={s.id} id={s.id} className="flex scroll-mt-[calc(var(--spacing-bar)+1.5rem)] flex-col gap-5">
                <h2 className="text-title text-fg">{s.title}</h2>
                {s.blocks.map((b, i) => (
                  <DocBlock key={i} block={b} />
                ))}
              </section>
            ))}
          </div>
        </article>
      ) : (
        <p className="py-24 text-body text-muted">
          <span className="text-accent">$</span> post not found
        </p>
      )}
    </DocShell>
  );
}
