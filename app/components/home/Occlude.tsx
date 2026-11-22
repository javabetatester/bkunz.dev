import type { CSSProperties } from "react";

type Props = { text: string; by?: "char" | "word"; delay?: number; step?: number };

const lift = (i: number) => ((i * 37) % 5) - 2;

/** Types text in as glyphs rising from behind their line edge, each from its own depth; full text stays in the HTML. */
export function Occlude({ text, by = "char", delay = 0, step = by === "char" ? 18 : 14 }: Props) {
  let n = 0;
  const words = text.split(" ");
  return (
    <span aria-label={text} role="text">
      {words.map((word, w) => (
        <span key={w} aria-hidden="true">
          <span className="occ-word">
            {by === "word" ? (
              <span className="occ-glyph" style={{ "--d": `${delay + n++ * step}ms`, "--z": lift(w) } as CSSProperties}>
                {word}
              </span>
            ) : (
              Array.from(word).map((ch, c) => (
                <span key={c} className="occ-glyph" style={{ "--d": `${delay + n++ * step}ms`, "--z": lift(n) } as CSSProperties}>
                  {ch}
                </span>
              ))
            )}
          </span>
          {w < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
