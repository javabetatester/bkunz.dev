import { useEffect, useId, useRef, useState } from "react";
import type { Section } from "~/content/copy";
import { TraceCard, pad } from "~/components/home/TraceCard";
import "./pinned.css";

export function PinnedSection({ section, side }: { section: Section; side: "start" | "end" }) {
  const [active, setActive] = useState(0);
  const headingId = useId();
  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const { paragraphs } = section;

  useEffect(() => {
    const els = paragraphRefs.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = els.findIndex((el) => el === entry.target);
          if (index >= 0) setActive(index);
        }
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    for (const el of els) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const figureEnd = side === "end";

  return (
    <section
      id={section.id}
      aria-labelledby={headingId}
      className="px-gutter lg:grid lg:grid-cols-12 lg:gap-x-gutter"
    >
      <div className={`lg:col-span-7 lg:row-start-1 ${figureEnd ? "lg:col-start-1" : "lg:col-start-6"}`}>
        <h2 id={headingId} className="depth-in text-heading text-fg text-balance" style={{ "--depth": 30 } as React.CSSProperties}>
          {section.title}
        </h2>
        <div className="pinned-bar lg:hidden" aria-hidden="true">
          <span className="truncate">{paragraphs[active]?.trace}</span>
          <span className="tabular-nums">
            {pad(active + 1)}/{pad(paragraphs.length)}
          </span>
          <span className="pinned-bar-fill" style={{ "--p": (active + 1) / paragraphs.length } as React.CSSProperties} />
        </div>
        <div className="pinned-prose">
          {paragraphs.map((p, i) => (
            <p
              key={p.trace}
              ref={(el) => {
                paragraphRefs.current[i] = el;
              }}
              className={i === 0 ? "depth-in" : undefined}
              style={i === 0 ? ({ "--depth": 55 } as React.CSSProperties) : undefined}
            >
              {p.text}
            </p>
          ))}
        </div>
      </div>
      <TraceCard
        section={section}
        active={active}
        className={`hidden lg:block lg:col-span-5 lg:row-start-1 ${figureEnd ? "lg:col-start-8" : "lg:col-start-1"}`}
      />
    </section>
  );
}
