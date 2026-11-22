import type { CSSProperties, ReactNode } from "react";
import { Box, FloorText, Scene, TOP, Wire } from "../kernel";

const step = (n: number) => ({ "--step": n }) as CSSProperties;
const tint = (c: string) => ({ color: `var(--color-${c})` }) as CSSProperties;
const Rise = ({ n, children }: { n: number; children: ReactNode }) => (
  <g className="iso-rise" style={step(n)}>
    {children}
  </g>
);
const Pad = ({ w, d }: { w: number; d: number }) => (
  <g className="iso-rise" style={step(0)} transform={TOP(0, 0, 0)}>
    <rect width={w} height={d} className="iso-base" />
  </g>
);

type Tone = "lime" | "sky" | "violet" | "amber" | "none";

function Sheet({ at: [x, y, z], tone = "none", odd = false }: { at: [number, number, number]; tone?: Tone; odd?: boolean }) {
  return (
    <Box
      at={[x, y, z]}
      size={[14, 10, 0.8]}
      tone={tone}
      top={
        <g>
          <path d="M1.5 2 H12.5 M1.5 4 H10 M1.5 8 H11" className="iso-detail" />
          <path d={odd ? "M1.5 6 H5 M7 6 H9" : "M1.5 6 H12"} className={odd ? "iso-wire" : "iso-detail"} style={odd ? tint("amber") : undefined} />
        </g>
      }
    />
  );
}

function Inspector({ at: [x, y] }: { at: [number, number] }) {
  return (
    <g>
      <Box at={[x + 0.6, y + 0.6, 0]} size={[5, 6, 7]} />
      <Box at={[x, y, 7]} size={[6.2, 7.2, 8]} tone="sky" front={<path d="M1.2 2 H5" className="iso-ink" />} />
      <Box
        at={[x + 0.7, y + 0.9, 15]}
        size={[4.8, 5.4, 5]}
        front={<g><circle cx={1.4} cy={2.2} r={0.6} className="iso-dot" style={tint("fg")} /><circle cx={3.4} cy={2.2} r={0.6} className="iso-dot" style={tint("fg")} /></g>}
      />
    </g>
  );
}

function Ruler({ at: [x, y, z], len }: { at: [number, number, number]; len: number }) {
  return (
    <Box
      at={[x, y, z]}
      size={[len, 1.6, 0.8]}
      tone="amber"
      top={<path d={Array.from({ length: Math.floor(len / 3) }, (_, i) => `M${1 + i * 3} 0 V0.9`).join(" ")} className="iso-ink" />}
    />
  );
}

function Mark({ at: [x, y, z], ok }: { at: [number, number, number]; ok: boolean }) {
  return (
    <g transform={TOP(x, y, z)}>
      <circle cx={3} cy={3} r={2.6} className="iso-dot" style={tint(ok ? "accent" : "amber")} />
      <path d={ok ? "M1.8 3 L2.8 4 L4.4 2" : "M2 2 L4 4 M4 2 L2 4"} className="iso-ink" />
    </g>
  );
}

function Repo({ at: [x, y], name }: { at: [number, number]; name: string }) {
  return (
    <g>
      <Box at={[x, y, 0]} size={[24, 18, 9]} tone="sky" front={<text x={2} y={6.4} fontSize={4} className="iso-ink">{name}</text>} />
      <Sheet at={[x + 2, y + 3, 9]} tone="lime" />
      <Sheet at={[x + 6, y + 6, 9.8]} tone="violet" />
      <Sheet at={[x + 8, y + 3, 10.6]} tone="amber" />
    </g>
  );
}

function Sieve({ at: [x, y], tone }: { at: [number, number]; tone: Tone }) {
  const holes = [0, 1, 2, 3, 4].flatMap((i) => [0, 1].map((j) => <circle key={`${i}${j}`} cx={3 + i * 3.4} cy={2.6 + j * 3.4} r={0.9} className="iso-detail" />));
  return (
    <g>
      <Box at={[x, y, 0]} size={[1.4, 1.6, 5]} />
      <Box at={[x, y + 18, 0]} size={[1.4, 1.6, 5]} />
      <Box at={[x, y, 5]} size={[1.4, 19.6, 9]} tone={tone} side={holes} />
    </g>
  );
}

function Letter({ at: [x, y, z], seal }: { at: [number, number, number]; seal?: "ok" | "no" }) {
  return (
    <Box
      at={[x, y, z]}
      size={[5, 4, 0.8]}
      top={
        <g>
          <path d="M0.4 0.4 L2.5 2.2 L4.6 0.4" className="iso-detail" />
          {seal === "ok" ? <circle cx={2.5} cy={2.8} r={0.8} className="iso-dot" style={tint("accent")} /> : null}
          {seal === "no" ? <path d="M1.8 2.1 L3.2 3.5 M3.2 2.1 L1.8 3.5" className="iso-wire" style={tint("amber")} /> : null}
        </g>
      }
    />
  );
}

const stamp = () => (
  <Scene size={[100, 64, 22]} label="go-lint: one master template and a small overlay are stamped into identical config sheets inside every Go repository">
    <Pad w={100} d={64} />
    <Rise n={1}>
      <Box at={[6, 8, 0]} size={[12, 10, 4]} tone="amber" front={<text x={1.4} y={3} fontSize={2.6} className="iso-ink">overlay</text>} />
      <Box at={[6, 28, 0]} size={[18, 22, 14]} tone="violet" front={<text x={2} y={6.4} fontSize={4} className="iso-ink">shared.yml</text>} />
      <Sheet at={[8, 32, 14]} tone="violet" />
      <Sheet at={[8, 32, 14.8]} tone="violet" />
    </Rise>
    <Rise n={2}>
      <Wire points={[[12, 18], [12, 27]]} tone="amber" dashed />
      <Wire points={[[24, 36], [46, 36], [46, 14], [60, 14]]} tone="none" dashed />
      <Wire points={[[46, 36], [46, 52], [60, 52]]} tone="none" dashed />
    </Rise>
    <Rise n={3}>
      <Repo at={[60, 4]} name="repo A" />
    </Rise>
    <Rise n={4}>
      <Repo at={[60, 42]} name="repo B" />
      <FloorText at={[32, 56, 0]} tone="lime" size={3.6}>3 sheets per repo</FloorText>
    </Rise>
  </Scene>
);

const drift = () => (
  <Scene size={[100, 64, 24]} label="go-lint drift check: an inspector with a ruler compares each committed config sheet to the one regenerated from the template and flags the one that differs">
    <Pad w={100} d={64} />
    <Rise n={1}>
      <FloorText at={[6, 2, 0]} size={3.6}>template</FloorText>
      <FloorText at={[30, 2, 0]} size={3.6}>committed</FloorText>
      <Sheet at={[6, 8, 0]} tone="violet" />
      <Sheet at={[30, 8, 0]} />
      <Mark at={[48, 10, 0]} ok />
      <Sheet at={[6, 38, 0]} tone="violet" />
      <Sheet at={[30, 38, 0]} odd />
      <Mark at={[48, 40, 0]} ok={false} />
    </Rise>
    <Rise n={2}>
      <Ruler at={[6, 21, 0]} len={38} />
      <Ruler at={[6, 51, 0]} len={38} />
      <FloorText at={[56, 42, 0]} tone="amber" size={3.8}>ErrDrift</FloorText>
    </Rise>
    <Rise n={3}>
      <Inspector at={[74, 26]} />
    </Rise>
  </Scene>
);

const sieves = () => (
  <Scene size={[104, 64, 28]} label="go-lint analyzers: code passes through seven sieves, layout, clockseam, envroot, errstring, noskipenv, doccomment and adrref; a finding is dropped into the reject tray">
    <Pad w={104} d={64} />
    <Rise n={1}>
      <Box at={[2, 24, 0]} size={[12, 18, 3]} tone="lime" front={<text x={1.4} y={2.6} fontSize={2.6} className="iso-ink">.go</text>} />
      <Box at={[16, 28, 0]} size={[82, 10, 1.2]} />
      <Letter at={[18, 31, 1.2]} />
      <Letter at={[26, 31, 1.2]} />
    </Rise>
    <Rise n={2}>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <Sieve key={i} at={[26 + i * 9, 22]} tone={(["lime", "sky", "violet", "amber", "lime", "sky", "violet"] as const)[i]!} />
      ))}
    </Rise>
    <Rise n={3}>
      <Letter at={[72, 31, 1.2]} />
      <Letter at={[88, 31, 1.2]} seal="ok" />
      <Box at={[44, 48, 0]} size={[16, 10, 2.4]} tone="amber" />
      <Letter at={[50, 51, 2.4]} seal="no" />
      <Wire points={[[48, 40], [48, 48]]} tone="amber" dashed />
      <FloorText at={[24, 56, 0]} size={3.6}>7 analyzers</FloorText>
    </Rise>
  </Scene>
);

export const scenes: Record<string, () => ReactNode> = {
  "go-lint/stamp": stamp,
  "go-lint/drift": drift,
  "go-lint/sieves": sieves,
};
