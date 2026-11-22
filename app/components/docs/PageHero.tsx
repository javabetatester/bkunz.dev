import type { CSSProperties, ReactNode } from "react";
import { IconArrowDown } from "@tabler/icons-react";
import { smoothScroll } from "~/components/layout/smoothScroll";

const depth = (d: number): CSSProperties => ({ "--depth": d }) as CSSProperties;

/** A centred page opening: a typed path, lede, status and a figure; the next section peeks below and anchors on scroll. */
export function PageHero({ title, lede, status, figure, next, hint }: { title: string; lede: string; status: string; figure: ReactNode; next: string; hint: string }) {
  const path = `~/${title.toLowerCase()}`;
  return (
    <section className="hero-backdrop relative isolate flex min-h-[calc(100svh-var(--spacing-bar)-5.5rem)] snap-start flex-col items-center justify-start gap-3 px-gutter pt-[clamp(2rem,7svh,4.5rem)] pb-6 text-center">
      <h1 className="text-[clamp(2rem,3vw,3rem)] leading-none tracking-[-0.03em] text-fg" aria-label={path}>
        <span aria-hidden="true" className="mr-[0.4ch] text-accent">&gt;</span>
        <span aria-hidden="true" className="type-line" style={{ "--chars": path.length, "--delay": "250ms", animationDuration: `${path.length * 90}ms` } as CSSProperties}>
          <span className="text-faint">~/</span>
          {title.toLowerCase()}
        </span>
        <span aria-hidden="true" className="title-caret text-accent">_</span>
      </h1>
      <p className="depth-in max-w-[62ch] text-body text-muted text-balance" style={depth(25)}>
        {lede}
      </p>
      <p className="depth-in flex items-center gap-2 text-meta text-muted" style={depth(35)}>
        <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
        {status}
      </p>
      <div className="mt-6 h-[clamp(12rem,34svh,19rem)] w-full max-w-4xl">{figure}</div>
      <a href={next} onClick={smoothScroll} style={{ "--depth": 20, "--delay": "1100ms" } as CSSProperties} className="depth-in group mt-auto flex flex-col items-center gap-1.5 pt-4 text-meta text-muted transition-colors duration-150 ease-out hover:text-fg">
        <span className="cue grid size-8 place-items-center">
          <IconArrowDown size={16} stroke={1.5} aria-hidden="true" className="group-hover:text-accent" />
        </span>
        {hint}
      </a>
    </section>
  );
}
