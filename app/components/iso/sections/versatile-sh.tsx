import type { CSSProperties, ReactNode } from "react";
import { Box, Cylinder, FloorText, FRONT, Scene, TOP, WallText, Wire, type Vec } from "../kernel";

type Tone = "lime" | "sky" | "violet" | "amber" | "none";
const step = (n: number) => ({ "--step": n }) as CSSProperties;
const tint = (c: string) => ({ color: `var(--color-${c})` }) as CSSProperties;
const Rise = ({ n, children }: { n: number; children: ReactNode }) => (
  <g className="iso-rise" style={step(n)}>
    {children}
  </g>
);

function Pad({ w, d }: { w: number; d: number }) {
  return (
    <g className="iso-rise" style={step(0)} transform={TOP(0, 0, 0)}>
      <rect width={w} height={d} className="iso-base" />
    </g>
  );
}

function Person({ at: [x, y], tone = "sky", seated = false }: { at: [number, number]; tone?: Tone; seated?: boolean }) {
  const z = seated ? 3 : 0;
  return (
    <g>
      <Box at={[x, y, z]} size={[4.4, 4.4, 5]} tone={tone} />
      <Box
        at={[x + 0.7, y + 0.7, z + 5]}
        size={[3, 3, 3]}
        front={<g><circle cx={0.8} cy={1.3} r={0.45} className="iso-dot" style={tint("fg")} /><circle cx={2.2} cy={1.3} r={0.45} className="iso-dot" style={tint("fg")} /></g>}
      />
    </g>
  );
}

function Chair({ at: [x, y], tone = "none" }: { at: [number, number]; tone?: Tone }) {
  return (
    <g>
      <Box at={[x, y, 0]} size={[7, 1.2, 8]} tone={tone} />
      <Box at={[x, y + 1.2, 0]} size={[7, 6, 3]} tone={tone} />
    </g>
  );
}

function Mail({ at: [x, y, z], tone, mini = false }: { at: Vec; tone: Tone; mini?: boolean }) {
  const [w, d] = mini ? [4.2, 3] : [7, 5];
  return <Box at={[x, y, z]} size={[w, d, 0.8]} tone={tone} top={<path d={`M0.4 0.4 L${w / 2} ${d / 2} L${w - 0.4} 0.4`} className="iso-ink" />} />;
}

function Windows({ rows = 2 }: { rows?: number }) {
  return (
    <g>
      {Array.from({ length: rows }, (_, r) => (
        <rect key={r} x={2.5} y={2.5 + r * 4} width={11} height={2.2} rx={0.4} className="iso-ink" />
      ))}
    </g>
  );
}

function Hub() {
  const sats: { at: [number, number]; tone: Tone; label: string; door: [number, number] }[] = [
    { at: [8, 6], tone: "sky", label: "rules", door: [16, 18] },
    { at: [8, 44], tone: "violet", label: "study", door: [16, 44] },
    { at: [76, 6], tone: "amber", label: "deploy", door: [84, 18] },
    { at: [76, 44], tone: "none", label: "media", door: [84, 44] },
  ];
  return (
    <Scene size={[100, 64, 28]} label="versatile-sh architecture: the center harness is a hub building joined by roads to its satellite harnesses, each its own repository">
      <Pad w={100} d={64} />
      <Rise n={1}>
        {sats.map((s) => (
          <Wire key={s.label} points={[[50, 33], [s.door[0] < 50 ? 30 : 70, 33], s.door]} tone="lime" dashed />
        ))}
      </Rise>
      {[...sats, { at: [41, 24] as [number, number], tone: "lime" as Tone, label: "center", door: [0, 0] as [number, number] }]
        .sort((a, b) => a.at[0] + a.at[1] - (b.at[0] + b.at[1]))
        .map((s, i) => {
          const hub = s.label === "center";
          return (
            <Rise key={s.label} n={2 + i}>
              <Box at={[s.at[0], s.at[1], 0]} size={hub ? [18, 18, 18] : [16, 12, 10]} tone={s.tone} front={hub ? <g><rect x={3} y={3} width={12} height={2.2} className="iso-ink" /><rect x={3} y={7.5} width={12} height={2.2} className="iso-ink" /><rect x={7} y={12} width={4} height={6} className="iso-ink" /></g> : <Windows />} />
              <WallText at={[s.at[0] + 1.5, s.at[1] + (hub ? 18 : 12), hub ? 8 : 5]} size={hub ? 4.4 : 3.4} dark>{s.label}</WallText>
            </Rise>
          );
        })}
    </Scene>
  );
}

const LOOP: { tone: Tone; label: string; glyph: ReactNode }[] = [
  { tone: "sky", label: "fix", glyph: <path d="M2 8 L7 3 M6 2 A2 2 0 1 1 8 4" className="iso-ink" /> },
  { tone: "violet", label: "proof", glyph: <path d="M2 5.5 L4.5 8 L8.5 2" className="iso-ink" /> },
  { tone: "amber", label: "ok?", glyph: <path d="M2.5 2.5 H7.5 M2.5 5 H7.5 M2.5 7.5 H5.5" className="iso-ink" /> },
  { tone: "lime", label: "guard", glyph: <path d="M5 1.5 L8.4 3 V6 C8.4 8 5 9 5 9 C5 9 1.6 8 1.6 6 V3 Z" className="iso-ink" /> },
  { tone: "none", label: "record", glyph: <path d="M2.5 2.5 H7.5 M2.5 5 H7.5 M2.5 7.5 H7.5" className="iso-detail" /> },
];

function Loop() {
  const pts = LOOP.map((s, i) => {
    const a = (-90 + i * 72) * (Math.PI / 180);
    return { ...s, x: 50 + 30 * Math.cos(a), y: 32 + 22 * Math.sin(a) };
  });
  const ring: [number, number][] = [...pts, pts[0]!].map((p) => [p.x, p.y]);
  return (
    <Scene size={[100, 64, 16]} label="versatile-sh learning loop: a recurring problem goes round five stations, fix, proof, owner confirmation, guard and record, and the guard stops it from coming back">
      <Pad w={100} d={64} />
      <Rise n={1}>
        <Wire points={ring} tone="lime" dashed />
        <Cylinder at={[50, 32, 0]} r={5} h={3} tone="lime" />
      </Rise>
      {[...pts]
        .sort((a, b) => a.x + a.y - (b.x + b.y))
        .map((s, i) => (
          <Rise key={s.label} n={2 + i}>
            <Box at={[s.x - 5, s.y - 5, 0]} size={[10, 10, s.label === "guard" ? 9 : 5]} tone={s.tone} top={<g>{s.glyph}</g>} />
            <FloorText at={[s.x - 6, s.y + 6, 0]} tone={s.tone === "none" ? "none" : s.tone}>{s.label}</FloorText>
          </Rise>
        ))}
    </Scene>
  );
}

function Gate() {
  return (
    <Scene size={[100, 64, 24]} label="versatile-sh pull request gate: a turnstile that only turns once the session knowledge note is dropped in the box, then the branch reaches main">
      <Pad w={100} d={64} />
      <Rise n={1}>
        <Person at={[8, 28]} tone="violet" />
        <Mail at={[20, 29.5, 0]} tone="sky" />
        <Wire points={[[14, 31], [47, 31]]} tone="none" dashed />
      </Rise>
      <Rise n={2}>
        <Box
          at={[22, 6, 0]}
          size={[16, 2.5, 14]}
          front={<g>{[0, 1, 2].map((r) => <g key={r}><rect x={2} y={2 + r * 3.6} width={2} height={2} className="iso-detail" /><path d={`M5.5 ${3 + r * 3.6} H13`} className="iso-detail" /></g>)}</g>}
        />
        <WallText at={[22.5, 8.5, 18]} size={3.4}>checklist</WallText>
      </Rise>
      <Rise n={3}>
        <Box at={[34, 42, 0]} size={[10, 8, 7]} tone="amber" top={<rect x={2} y={3.4} width={6} height={1.4} className="iso-ink" />} />
        <Mail at={[35.5, 44, 7.8]} tone="lime" mini />
        <WallText at={[35, 50, 4]} size={3.2} dark>note</WallText>
      </Rise>
      <Rise n={4}>
        <Box at={[48, 22, 0]} size={[3, 3, 14]} tone="lime" />
        <Box at={[48, 38, 0]} size={[3, 3, 14]} tone="lime" />
        <Cylinder at={[49.5, 31, 0]} r={1.6} h={10} tone="amber" />
        <Box at={[46, 30.5, 8]} size={[7, 1, 1]} tone="amber" />
        <Box at={[49, 28, 8]} size={[1, 6, 1]} tone="amber" />
      </Rise>
      <Rise n={5}>
        <Wire points={[[54, 31], [72, 31]]} tone="lime" dashed />
        <Box at={[72, 18, 0]} size={[20, 22, 16]} tone="lime" front={<g><rect x={3} y={3} width={14} height={2.2} className="iso-ink" /><rect x={3} y={7} width={14} height={2.2} className="iso-ink" /></g>} />
        <WallText at={[74, 40, 9]} dark>main</WallText>
      </Rise>
    </Scene>
  );
}

export const scenes: Record<string, () => ReactNode> = {
  "versatile-sh/hub": Hub,
  "versatile-sh/loop": Loop,
  "versatile-sh/gate": Gate,
};
