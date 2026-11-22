import type { Block } from "~/content/docs/types";
import { Linkified } from "~/components/docs/Linkified";
import { SectionScene } from "~/components/iso/sections";

/** Renders one typed documentation block. */
export function DocBlock({ block, repo }: { block: Block; repo?: string }) {
  switch (block.kind) {
    case "p":
      return <p className="max-w-[72ch] text-body text-fg/85"><Linkified text={block.text} /></p>;
    case "code":
      return (
        <figure className="overflow-hidden rounded-field border border-line bg-sunken">
          <figcaption className="flex justify-between border-b border-line px-4 py-2 text-meta text-muted">
            <span>{block.caption ?? ""}</span>
            <span className="text-faint">{block.lang}</span>
          </figcaption>
          <pre className="thin-scroll overflow-x-auto p-4 text-meta leading-relaxed text-fg/90">
            <code>{block.code}</code>
          </pre>
        </figure>
      );
    case "list":
      return (
        <ul className="flex max-w-[72ch] flex-col gap-2">
          {block.items.map((item) => (
            <li key={item} className="relative pl-5 text-body text-fg/85 before:absolute before:left-0 before:top-[0.8em] before:h-px before:w-2.5 before:bg-accent">
              <Linkified text={item} />
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="flex flex-col border-l border-line">
          {block.items.map((step, i) => (
            <li key={step.title} className="relative flex flex-col gap-1 py-3 pl-6">
              <span className="absolute -left-[0.5rem] top-[0.95rem] grid size-4 place-items-center rounded-full border border-line-strong bg-canvas text-[0.6rem] text-muted tabular-nums">
                {i + 1}
              </span>
              <span className="text-body text-fg">{step.title}</span>
              <span className="max-w-[72ch] text-body text-muted"><Linkified text={step.text} /></span>
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <div className="thin-scroll overflow-x-auto rounded-field border border-line">
          <table className="w-full border-collapse text-left text-meta">
            <thead className="bg-sunken text-muted">
              <tr>
                {block.head.map((h) => (
                  <th key={h} className="border-b border-line px-4 py-2.5 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="border-b border-line last:border-0">
                  {row.map((cell, c) => (
                    <td key={c} className={`px-4 py-2.5 align-top ${c === 0 ? "text-fg" : "text-muted"}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout":
      return (
        <p className={`max-w-[72ch] rounded-field border px-4 py-3 text-body ${block.tone === "warn" ? "border-amber/40 text-amber" : "border-line-strong text-fg/85"}`}>
          <Linkified text={block.text} />
        </p>
      );
    case "scene":
      return (
        <figure className="flex flex-col gap-2">
          <div className="project-visual flex h-[clamp(14rem,34svh,22rem)] items-center justify-center rounded-surface border border-line">
            <div className="relative z-10 h-full w-full max-w-3xl p-2">
              <SectionScene id={block.id} />
            </div>
          </div>
          <figcaption className="text-meta text-muted">{block.caption}</figcaption>
        </figure>
      );
    case "files":
      return (
        <ul className="flex flex-col border-t border-line">
          {block.items.map((file) => (
            <li key={file.path} className="grid gap-1 border-b border-line py-2.5 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-6">
              {repo ? (
                <a href={`${repo}/blob/HEAD/${file.path}`} target="_blank" rel="noopener noreferrer" className="truncate text-meta text-fg underline decoration-line-strong underline-offset-4 hover:decoration-accent">
                  {file.path}
                </a>
              ) : (
                <code className="truncate text-meta text-fg">{file.path}</code>
              )}
              <span className="text-meta text-muted">{file.note}</span>
            </li>
          ))}
        </ul>
      );
  }
}
