import { WorkTimeline } from "~/components/docs/WorkTimeline";
import { PAGES_COPY } from "~/content/pages-copy";
import { usePage } from "~/content/useCopy";
import { EXPERIENCE } from "~/content/experience";

export default function Page() {
  const { lang } = usePage();
  const t = PAGES_COPY[lang].work;
  return (
    <section className="flex flex-col gap-12 px-gutter py-12 lg:py-16">
      <header className="depth-in flex flex-col gap-3" style={{ "--depth": 10 } as React.CSSProperties}>
        <h1 className="text-heading text-fg">{t.h1}</h1>
        <p className="max-w-[65ch] text-body text-muted">{t.lede}</p>
      </header>
      <WorkTimeline roles={EXPERIENCE[lang]} />
    </section>
  );
}
