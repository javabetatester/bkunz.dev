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

const label = (t: string, s = 3.4) => <text x={1.6} y={s + 0.8} fontSize={s} className="iso-ink">{t}</text>;

function Crate({ at: [x, y, z], name, tone, done }: { at: [number, number, number]; name: string; tone: Tone; done?: boolean }) {
  return (
    <g>
      <Box at={[x, y, z]} size={[9, 8, 6]} tone={tone} front={label(name, 2.8)} top={done ? <g><circle cx={4.5} cy={4} r={2.2} className="iso-dot" style={tint("accent")} /><path d="M3.4 4 L4.3 4.9 L5.8 3" className="iso-ink" /></g> : undefined} />
    </g>
  );
}

const layers = () => (
  <Scene size={[100, 64, 30]} label="omarchy-omakase: the Omarchy base slab at the bottom, with the overlay modules hypr, kitty, nvim and the bar stacked on top of it">
    <Pad w={100} d={64} />
    <Rise n={1}>
      <Box at={[6, 6, 0]} size={[88, 52, 5]} front={<text x={3} y={4} fontSize={3.8} className="iso-text">Omarchy base</text>} />
    </Rise>
    <Rise n={2}>
      <Box at={[12, 12, 5]} size={[26, 16, 3]} tone="sky" front={label("hypr")} />
      <Box at={[58, 10, 5]} size={[26, 16, 3]} tone="violet" front={label("kitty")} />
    </Rise>
    <Rise n={3}>
      <Box at={[14, 36, 5]} size={[26, 16, 3]} tone="lime" front={label("nvim")} />
      <Box at={[54, 36, 5]} size={[30, 16, 3]} tone="amber" front={label("starship + scripts")} />
    </Rise>
    <Rise n={4}>
      <Box at={[16, 14, 8]} size={[22, 12, 3]} tone="amber" front={label("bar")} />
      <FloorText at={[44, 30, 5]} size={3.6} tone="lime">overlay</FloorText>
    </Rise>
  </Scene>
);

const installer = () => (
  <Scene size={[104, 64, 26]} label="omarchy-omakase setup.sh: a conveyor carries each module crate through the installer once and backs up overwritten files; on a second pass every crate is already there and is skipped">
    <Pad w={104} d={64} />
    <Rise n={1}>
      <Box at={[4, 10, 0]} size={[14, 10, 5]} tone="amber" front={label("backup", 3)} />
      <Box at={[4, 17, 0]} size={[84, 9, 1.2]} />
      <Crate at={[8, 17.5, 1.2]} name="pkgs" tone="sky" />
      <Crate at={[20, 17.5, 1.2]} name="nvim" tone="lime" />
    </Rise>
    <Rise n={2}>
      <Box at={[40, 14, 0]} size={[3, 3, 16]} tone="violet" />
      <Box at={[40, 28, 0]} size={[3, 3, 16]} tone="violet" />
      <Box at={[40, 14, 16]} size={[3, 17, 3]} tone="violet" />
      <Wire points={[[30, 21], [40, 21]]} dashed />
      <Wire points={[[44, 21], [78, 21]]} dashed tone="lime" />
    </Rise>
    <Rise n={3}>
      <Crate at={[54, 17.5, 1.2]} name="hypr" tone="violet" done />
      <Box at={[82, 8, 0]} size={[18, 22, 10]} tone="lime" front={label("$HOME", 3.4)} />
      <FloorText at={[6, 33, 0]} size={3.4}>pass 1: install</FloorText>
    </Rise>
    <Rise n={4}>
      <Box at={[4, 42, 0]} size={[84, 9, 1.2]} />
      <Crate at={[10, 42.5, 1.2]} name="pkgs" tone="none" done />
      <Crate at={[30, 42.5, 1.2]} name="nvim" tone="none" done />
      <Crate at={[50, 42.5, 1.2]} name="hypr" tone="none" done />
      <FloorText at={[6, 54, 0]} size={3.4} tone="lime">pass 2: already there, skip</FloorText>
    </Rise>
  </Scene>
);

function Drawer({ at: [x, y, z], w, name, tone, items }: { at: [number, number, number]; w: number; name: string; tone: Tone; items: number }) {
  return (
    <Box
      at={[x, y, z]}
      size={[w, 14, 3]}
      tone={tone}
      top={
        <g>
          <text x={1.4} y={4} fontSize={3.2} className="iso-ink">{name}</text>
          {Array.from({ length: items }, (_, i) => <path key={i} d={`M1.4 ${6.4 + i * 2.2} H${w - 2}`} className="iso-detail" />)}
        </g>
      }
    />
  );
}

const bar = () => (
  <Scene size={[100, 64, 36]} label="omarchy-omakase bar: a Quickshell strip across the top of the screen, with panels for music, Wi-Fi, vault and agents pulled out below it like drawers">
    <Pad w={100} d={64} />
    <Rise n={1}>
      <Box
        at={[6, 6, 0]}
        size={[88, 8, 30]}
        front={
          <g>
            <rect x={1} y={1} width={86} height={5} rx={1} className="iso-base" />
            {[6, 14, 22].map((x) => <circle key={x} cx={x} cy={3.5} r={1.2} className="iso-dot" style={tint("sky")} />)}
            <path d="M34 3.5 H52" className="iso-detail" />
            {[68, 74, 80].map((x) => <circle key={x} cx={x} cy={3.5} r={1.2} className="iso-dot" style={tint("accent")} />)}
          </g>
        }
      />
    </Rise>
    <Rise n={2}>
      <Drawer at={[10, 16, 14]} w={24} name="music" tone="violet" items={2} />
      <Drawer at={[60, 16, 14]} w={30} name="agents" tone="amber" items={3} />
    </Rise>
    <Rise n={3}>
      <Drawer at={[14, 36, 8]} w={24} name="wifi" tone="sky" items={3} />
      <Drawer at={[56, 38, 8]} w={32} name="vault" tone="lime" items={3} />
    </Rise>
  </Scene>
);

export const scenes: Record<string, () => ReactNode> = {
  "omarchy-omakase/layers": layers,
  "omarchy-omakase/installer": installer,
  "omarchy-omakase/bar": bar,
};
