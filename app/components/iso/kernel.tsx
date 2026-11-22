import type { CSSProperties, ReactNode } from "react";

export type Vec = readonly [number, number, number];

const C = Math.cos(Math.PI / 6);
const S = Math.sin(Math.PI / 6);

/** Projects a world point (x to the lower right, y to the lower left, z up) onto the drawing. */
export const P = (x: number, y: number, z: number) => [(x - y) * C, (x + y) * S - z] as const;

const plane = (o: Vec, u: Vec, v: Vec) => {
  const [a, b, c] = [o, u, v].map((p) => P(...p));
  return `matrix(${b![0]} ${b![1]} ${c![0]} ${c![1]} ${a![0]} ${a![1]})`;
};

/** Lays flat 2D drawing on the horizontal plane at height z. */
export const TOP = (x: number, y: number, z: number) => plane([x, y, z], [1, 0, 0], [0, 1, 0]);
/** Lays flat 2D drawing on the left visible wall, origin at its top left. */
export const FRONT = (x: number, y: number, z: number) => plane([x, y, z], [1, 0, 0], [0, 0, -1]);
/** Lays flat 2D drawing on the right visible wall, origin at its top front corner. */
export const SIDE = (x: number, y: number, z: number) => plane([x, y, z], [0, -1, 0], [0, 0, -1]);

type Tone = "lime" | "sky" | "violet" | "amber" | "navy" | "none";
const TONE: Record<Tone, string> = { lime: "var(--color-accent)", sky: "var(--color-sky)", violet: "var(--color-violet)", amber: "var(--color-amber)", navy: "var(--color-navy)", none: "var(--color-muted)" };

type BoxProps = { at: Vec; size: Vec; tone?: Tone; className?: string; style?: CSSProperties; top?: ReactNode; front?: ReactNode; side?: ReactNode };

/** A box drawn as its three visible faces; a tone paints it in that colour, neutral otherwise. */
export function Box({ at: [x, y, z], size: [w, d, h], tone = "none", className, style, top, front, side }: BoxProps) {
  const hot = tone !== "none";
  return (
    <g className={className} style={{ color: TONE[tone], ...style }}>
      <g transform={SIDE(x + w, y + d, z + h)}>
        <rect width={d} height={h} className={hot ? "iso-hot-side" : "iso-side"} />
        {side}
      </g>
      <g transform={FRONT(x, y + d, z + h)}>
        <rect width={w} height={h} className={hot ? "iso-hot-front" : "iso-front"} />
        {front}
      </g>
      <g transform={TOP(x, y, z + h)}>
        <rect width={w} height={d} className={hot ? "iso-hot-top" : "iso-top"} />
        {top}
      </g>
    </g>
  );
}

type CylProps = { at: Vec; r: number; h: number; tone?: Tone; className?: string; style?: CSSProperties; rings?: number };

/** An upright cylinder centred on `at`, with optional rings on its wall. */
export function Cylinder({ at: [x, y, z], r, h, tone = "none", className, style, rings = 0 }: CylProps) {
  const [cx, cy] = P(x, y, z);
  const rx = r * C * Math.SQRT2;
  const ry = r * S * Math.SQRT2;
  const hot = tone !== "none";
  const top = cy - h;
  return (
    <g className={className} style={{ color: TONE[tone], ...style }}>
      <path d={`M${cx - rx} ${top} V${cy} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy} V${top} Z`} className={hot ? "iso-hot-front" : "iso-front"} />
      {Array.from({ length: rings }, (_, i) => {
        const yy = top + ((i + 1) * h) / (rings + 1);
        return <path key={i} d={`M${cx - rx} ${yy} A${rx} ${ry} 0 0 0 ${cx + rx} ${yy}`} className="iso-detail" />;
      })}
      <ellipse cx={cx} cy={top} rx={rx} ry={ry} className={hot ? "iso-hot-top" : "iso-top"} />
    </g>
  );
}

/** A polyline on the floor plane at height z, from world points. */
export function Wire({ points, z = 0, tone = "none", dashed = false, className }: { points: [number, number][]; z?: number; tone?: Tone; dashed?: boolean; className?: string }) {
  const d = points.map(([x, y], i) => `${i ? "L" : "M"}${P(x, y, z).join(" ")}`).join(" ");
  return <path d={d} className={`${dashed ? "iso-dash" : "iso-wire"} ${className ?? ""}`} style={{ color: TONE[tone] }} />;
}

/** The SVG frame of one figure, fitted to the world box. */
export function Scene({ size: [w, d, h], label, children }: { size: Vec; label: string; children: ReactNode }) {
  const corners = [0, w].flatMap((x) => [0, d].flatMap((y) => [0, h].map((z) => P(x, y, z))));
  const xs = corners.map(([a]) => a);
  const ys = corners.map(([, b]) => b);
  const pad = 6;
  const box = [Math.min(...xs) - pad, Math.min(...ys) - pad, Math.max(...xs) - Math.min(...xs) + pad * 2, Math.max(...ys) - Math.min(...ys) + pad * 2];
  return (
    <svg viewBox={box.join(" ")} role="img" aria-label={label} className="iso-scene">
      {children}
    </svg>
  );
}

/** Text laid flat on the floor plane at height z, starting at world (x, y). */
export function FloorText({ at: [x, y, z], children, tone = "none", size = 5.2 }: { at: Vec; children: string; tone?: Tone; size?: number }) {
  return (
    <g transform={TOP(x, y, z)} style={{ color: TONE[tone] }}>
      <text x={0} y={size} fontSize={size} className={tone === "none" ? "iso-text" : "iso-text-hot"}>
        {children}
      </text>
    </g>
  );
}

/** Text drawn on the left visible wall of a box whose top front-left corner is at (x, y, z). */
export function WallText({ at: [x, y, z], children, size = 4.4, dark = false }: { at: Vec; children: string; size?: number; dark?: boolean }) {
  return (
    <g transform={FRONT(x, y, z)}>
      <text x={0} y={size} fontSize={size} className={dark ? "iso-text-ink" : "iso-text"}>
        {children}
      </text>
    </g>
  );
}
