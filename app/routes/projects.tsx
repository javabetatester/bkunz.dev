import { EnginesScene } from "~/components/iso/scenes";
import { PageHero } from "~/components/docs/PageHero";
import { ProjectGrid } from "~/components/docs/ProjectGrid";
import { PAGES_COPY } from "~/content/pages-copy";
import { usePage } from "~/content/useCopy";

export default function Page() {
  const { lang, copy } = usePage();
  const t = PAGES_COPY[lang].projects;
  return (
    <>
      <PageHero title={t.h1} lede={t.lede} status={t.status} figure={<EnginesScene label={t.h1} />} next="#projects-grid" hint={copy.hero.scrollHint} />
      <section id="projects-grid" className="snap-start px-gutter py-6 lg:h-[calc(100svh-var(--spacing-bar))]">
        <ProjectGrid lang={lang} />
      </section>
    </>
  );
}
