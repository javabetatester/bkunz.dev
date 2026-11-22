import "./pinned.css";
import type { Section } from "~/content/copy";

type TraceCardProps = { section: Section; active: number; className: string };

/** Zero-pads a 1-based position to two digits. */
export const pad = (n: number) => String(n).padStart(2, "0");

/** Sticky index of a section's argument: one trace line per paragraph, the one being read marked. */
export function TraceCard({ section, active, className }: TraceCardProps) {
  const { paragraphs, path } = section;
  return (
    <div className={`pinned-card ${className}`} aria-hidden="true">
      <div className="pinned-figure rounded-surface border border-line bg-raised">
        <div className="flex items-baseline justify-between gap-4">
          <span className="truncate text-meta text-muted">{path}</span>
          <span className="text-heading tabular-nums text-muted">
            {pad(active + 1)}
            <span className="text-faint">/{pad(paragraphs.length)}</span>
          </span>
        </div>
        <ol className="pinned-lines text-meta" style={{ "--i": active } as React.CSSProperties}>
          {paragraphs.map((p, i) => (
            <li key={p.trace} className="pinned-line" data-active={i === active}>
              {p.trace}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
