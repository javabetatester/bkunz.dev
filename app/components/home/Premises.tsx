import { usePage } from "~/content/useCopy";
import type { Lang } from "~/content/copy";

const HEADING: Record<Lang, string> = { en: "Core competencies", es: "Competencias principales", "pt-br": "Competências principais" };

type DepthStyle = React.CSSProperties & { "--depth": number };

export function Premises() {
  const { lang, copy } = usePage();
  const cards = copy.tabs.whoami;

  return (
    <section aria-labelledby="premises-title" className="px-gutter">
      <h2 id="premises-title" className="text-heading text-fg">{HEADING[lang]}</h2>
      <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-6">
        {cards.map((card, i) => (
          <li key={card.title} className={`${i < 3 ? "md:col-span-2" : "md:col-span-3"} depth-in`} style={{ "--depth": 20 + i * 18 } as DepthStyle}>
            <article className="flex h-full min-h-40 flex-col gap-3 rounded-surface border border-line-strong bg-raised p-6 shadow-[inset_0_0_0_0_var(--color-accent)] transition-shadow duration-[280ms] ease-thumb hover:shadow-[inset_0_2px_0_0_var(--color-accent)] md:p-8 lg:min-h-56">
              {card.meta ? <p className="text-meta text-muted">{card.meta}</p> : null}
              <h3 className="text-title text-fg">{card.title}</h3>
              <p className="text-body text-muted">{card.body}</p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
