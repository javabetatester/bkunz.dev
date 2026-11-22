import type { CSSProperties } from "react";

type Line = { cmd: string; out: string; tone: "fg" | "accent" | "muted" };

const CMD_STEP = 45;
const OUT_STEP = { fg: 11, accent: 16, muted: 7 } as const;
const PAUSE = 260;

const TONE = { fg: "hs-lead text-fg", accent: "hs-lead text-accent", muted: "hs-body text-muted" } as const;

function Typed({ text, from, step, out = false }: { text: string; from: number; step: number; out?: boolean }) {
  return (
    <span aria-label={text} role="text">
      {Array.from(text, (ch, i) => (
        <span key={i} aria-hidden="true" className={out ? "type-glyph type-out" : "type-glyph"} style={{ "--d": `${from + i * step}ms` } as CSSProperties}>
          {ch}
        </span>
      ))}
    </span>
  );
}

/** A terminal session typed in on load, character by character: each command, then its output, then the next prompt. */
export function HeroTerminal({ lines, start = 700 }: { lines: Line[]; start?: number }) {
  let t = start;
  const rows = lines.map((line) => {
    const cmdAt = t;
    t += line.cmd.length * CMD_STEP + PAUSE;
    const outAt = t;
    t += line.out.length * OUT_STEP[line.tone] + PAUSE;
    return { ...line, cmdAt, outAt };
  });
  const caretAt = t;

  return (
    <div className="rounded-surface border border-line-strong bg-sunken">
      <div className="flex items-center justify-between border-b border-line px-[1.2em] py-[0.6em] hs-meta text-muted">
        <span>~/bkunz.dev</span>
        <span>zsh</span>
      </div>
      <div className="flex flex-col gap-[0.9em] p-[1.4em]">
        {rows.map((row) => (
          <div key={row.cmd} className="flex flex-col gap-[0.3em]">
            <p className="hs-body text-muted">
              <span className="type-glyph text-accent" style={{ "--d": `${row.cmdAt - 120}ms` } as CSSProperties}>
                ${" "}
              </span>
              <Typed text={row.cmd} from={row.cmdAt} step={CMD_STEP} />
            </p>
            <p className={`max-w-[64ch] text-pretty ${TONE[row.tone]}`}>
              <Typed text={row.out} from={row.outAt} step={OUT_STEP[row.tone]} out />
            </p>
          </div>
        ))}
        <p className="hs-body text-muted">
          <span className="type-glyph text-accent" style={{ "--d": `${caretAt}ms` } as CSSProperties}>
            ${" "}
          </span>
          <span
            aria-hidden="true"
            className="inline-block h-[1.1em] w-[0.6ch] translate-y-[0.2em] bg-accent"
            style={{ animation: `type-glyph 40ms linear ${caretAt}ms both, caret 1.1s steps(1) ${caretAt + 500}ms infinite` }}
          />
        </p>
      </div>
    </div>
  );
}
