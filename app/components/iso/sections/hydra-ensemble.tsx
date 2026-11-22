import type { CSSProperties, ReactNode } from "react";
import { Box, Cylinder, FloorText, Scene, TOP, WallText, Wire } from "../kernel";

type Tone = "lime" | "sky" | "violet" | "amber";

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

function Robot({ at: [x, y] }: { at: [number, number] }) {
  return (
    <g>
      <Box at={[x, y, 0]} size={[9, 9, 5]} />
      <Box
        at={[x + 1, y + 1, 5]}
        size={[7, 7, 6]}
        front={
          <g>
            <circle cx={2.2} cy={2.4} r={1} className="iso-dot" style={tint("sky")} />
            <circle cx={4.8} cy={2.4} r={1} className="iso-dot" style={tint("sky")} />
            <path d="M2 4.6 H5" className="iso-detail" />
          </g>
        }
      />
    </g>
  );
}

function Terminal({ at: [x, y], tone }: { at: [number, number]; tone: Tone }) {
  return (
    <g>
      <Box at={[x + 4, y - 1, 0]} size={[8, 6, 1.5]} />
      <Box at={[x + 7, y + 1, 1.5]} size={[2, 1.5, 3]} />
      <Box
        at={[x, y, 4.5]}
        size={[16, 1.5, 10]}
        tone={tone}
        front={
          <g>
            <rect x={1} y={1} width={14} height={8} className="iso-base" />
            <path d="M2.5 3 L4 4.2 L2.5 5.4" className="iso-wire" style={tint(tone)} />
            <path d="M6 5.4 H11" className="iso-wire" style={tint(tone)} />
          </g>
        }
      />
    </g>
  );
}

function Locker({ at: [x, y], tone, label }: { at: [number, number]; tone: Tone; label: string }) {
  return (
    <g>
      <Box
        at={[x, y, 0]}
        size={[22, 10, 24]}
        tone={tone}
        front={
          <g>
            <rect x={1.5} y={1.5} width={19} height={21} className="iso-base" />
            <path d="M11 1.5 V22.5" className="iso-detail" />
            <rect x={8.6} y={11} width={1.2} height={3.4} rx={0.4} className="iso-ink" />
            <rect x={12.2} y={11} width={1.2} height={3.4} rx={0.4} className="iso-ink" />
          </g>
        }
      />
      <WallText at={[x + 2.5, y + 10, 29.5]} size={3.4}>{label}</WallText>
    </g>
  );
}

function Lamp({ at: [x, y], tone, lit }: { at: [number, number]; tone: Tone; lit: boolean }) {
  return (
    <g>
      <Cylinder at={[x, y, 10]} r={1.2} h={3} />
      <Cylinder at={[x, y, 13]} r={2.6} h={4.5} tone={lit ? tone : "none"} />
    </g>
  );
}

const desk = () => (
  <Scene size={[104, 64, 30]} label="hydra-ensemble: each terminal on the desk is wired to its own PTY box and its own git worktree branch">
    <Pad w={104} d={64} />
    {([
      ["sky", 5],
      ["violet", 24],
      ["lime", 43],
    ] as const).map(([tone, y], i) => (
      <Rise key={tone} n={i + 1}>
        <Terminal at={[4, y]} tone={tone} />
        <Wire points={[[22, y + 3], [42, y + 3]]} tone={tone} dashed />
        <Box at={[42, y - 1, 0]} size={[16, 10, 8]} tone={tone} top={<path d="M2 2 L4 3.6 L2 5.2 M6 5.4 H11" className="iso-ink" />} />
        <WallText at={[44, y + 9, 2]} size={3.6} dark>pty</WallText>
        <Wire points={[[60, y + 4], [78, y + 4]]} tone={tone} dashed />
        <Box at={[78, y - 1, 0]} size={[20, 11, 5]} tone={tone} top={<path d="M2 5.5 H6 M6 5.5 L9 3 H13 M6 5.5 L9 8 H13" className="iso-ink" />} />
        <WallText at={[79.5, y + 10, 1]} size={3.4} dark>{`branch ${["a", "b", "c"][i] ?? ""}`}</WallText>
      </Rise>
    ))}
  </Scene>
);

const states = () => (
  <Scene size={[104, 64, 32]} label="hydra-ensemble: an operator reads the PTY text and lights one signal lamp per session; the JSONL ledger overrides the reading">
    <Pad w={104} d={64} />
    <Rise n={1}>
      <Box at={[6, 8, 0]} size={[16, 10, 8]} tone="sky" top={<path d="M2 2 L4 3.6 L2 5.2 M6 5.4 H11" className="iso-ink" />} />
      <WallText at={[8, 18, 2]} size={3.6} dark>pty</WallText>
      <Wire points={[[24, 13], [36, 13]]} tone="sky" dashed />
      <Robot at={[38, 8]} />
    </Rise>
    <Rise n={2}>
      <Box at={[78, 6, 0]} size={[20, 12, 6]} tone="violet" top={<path d="M2 3 H18 M2 6 H18 M2 9 H12" className="iso-ink" />} />
      <WallText at={[80, 18, 1]} size={3.4} dark>jsonl</WallText>
      <Wire points={[[78, 12], [52, 12]]} tone="violet" dashed />
    </Rise>
    <Rise n={3}>
      <Wire points={[[43, 19], [43, 34]]} tone="none" dashed />
      <Box at={[10, 34, 0]} size={[84, 5, 10]} />
      {([
        ["violet", 22, "thinking", false],
        ["lime", 44, "generating", true],
        ["sky", 66, "idle", false],
        ["amber", 86, "attention", false],
      ] as const).map(([tone, x, name, lit]) => (
        <g key={name}>
          <Lamp at={[x - 6, 36.5]} tone={tone} lit={lit} />
          <WallText at={[x - 11, 39 + 0, 3]} size={2.9}>{name}</WallText>
        </g>
      ))}
    </Rise>
  </Scene>
);

const cost = () => (
  <Scene size={[104, 60, 30]} label="hydra-ensemble: a watcher tails the session JSONL ledger, prices tokens with a per-model rate card and moves the cost meter">
    <Pad w={104} d={60} />
    <Rise n={1}>
      {([
        ["opus", 40, 14],
        ["sonnet", 54, 9],
        ["haiku", 68, 4],
      ] as const).map(([name, x, h]) => (
        <g key={name}>
          <Box at={[x, 4, 0]} size={[10, 3, h]} tone="violet" />
          <WallText at={[x + 0.6, 7, h - 0.4 > 3 ? 1.5 : 0.3]} size={2.6} dark>{name}</WallText>
        </g>
      ))}
    </Rise>
    <Rise n={2}>
      <Box at={[6, 28, 0]} size={[24, 14, 6]} tone="sky" top={<path d="M2 3 H22 M2 6 H22 M2 9 H15" className="iso-ink" />} />
      <WallText at={[8, 42, 1]} size={3.4} dark>jsonl</WallText>
      <Wire points={[[32, 35], [42, 35]]} tone="sky" dashed />
      <Robot at={[42, 31]} />
    </Rise>
    <Rise n={3}>
      <Wire points={[[53, 35], [74, 35]]} tone="amber" dashed />
      <Box at={[58, 33, 0]} size={[3, 3, 1.5]} tone="amber" />
      <Box at={[65, 33, 0]} size={[3, 3, 1.5]} tone="amber" />
      <Box
        at={[76, 28, 0]}
        size={[22, 14, 14]}
        tone="amber"
        front={
          <g>
            <path d="M5 11 A6 6 0 0 1 17 11" className="iso-ink" />
            <path d="M11 11 L15 6.5" className="iso-ink" />
            <circle cx={11} cy={11} r={0.9} className="iso-ink" />
          </g>
        }
      />
      <WallText at={[80, 42, 1.5]} size={3.4} dark>cost</WallText>
    </Rise>
  </Scene>
);

const lockers = () => (
  <Scene size={[104, 60, 36]} label="hydra-ensemble: each session works from its own locker holding one config directory; a saved account is a shared locker">
    <Pad w={104} d={60} />
    <Rise n={1}>
      <Locker at={[4, 8]} tone="sky" label="fresh dir" />
      <Locker at={[34, 8]} tone="violet" label="fresh dir" />
      <Locker at={[70, 8]} tone="amber" label="account" />
    </Rise>
    <Rise n={2}>
      <Wire points={[[8, 40], [8, 28]]} tone="sky" dashed />
      <Robot at={[3.5, 40]} />
      <Wire points={[[38, 40], [38, 28]]} tone="violet" dashed />
      <Robot at={[33.5, 40]} />
      <Wire points={[[72, 40], [72, 28]]} tone="amber" dashed />
      <Wire points={[[90, 40], [90, 28]]} tone="amber" dashed />
      <Robot at={[67.5, 40]} />
      <Robot at={[85.5, 40]} />
    </Rise>
    <Rise n={3}>
      <FloorText at={[4, 54, 0]} size={3.8}>CLAUDE_CONFIG_DIR per session</FloorText>
    </Rise>
  </Scene>
);

export const scenes: Record<string, () => ReactNode> = {
  "hydra-ensemble/desk": desk,
  "hydra-ensemble/states": states,
  "hydra-ensemble/cost": cost,
  "hydra-ensemble/lockers": lockers,
};
