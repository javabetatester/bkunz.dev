import type { CSSProperties, ReactNode } from "react";
import { Box, Cylinder, FloorText, FRONT, Scene, TOP, WallText, Wire, type Vec } from "./kernel";

type Vec3 = Vec;

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

function Fill({ x, y, w, h, c, r = 0.6 }: { x: number; y: number; w: number; h: number; c: string; r?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx={r} className="iso-dot" style={tint(c)} />;
}

function Robot({ at }: { at: [number, number] }) {
  const [x, y] = at;
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

function Monitor({ at, w, h, children, tone = "none" }: { at: [number, number]; w: number; h: number; children: ReactNode; tone?: "none" | "sky" }) {
  const [x, y] = at;
  return (
    <g>
      <Box at={[x + w / 2 - 4, y - 2, 0]} size={[8, 6, 1.5]} />
      <Box at={[x + w / 2 - 1, y + 1, 1.5]} size={[2, 1.5, 4]} />
      <Box at={[x, y, 5.5]} size={[w, 1.5, h]} tone={tone} front={<g><rect x={1} y={1} width={w - 2} height={h - 2} className="iso-base" />{children}</g>} />
    </g>
  );
}

function Fence({ x, from, to, h = 11 }: { x: number; from: number; to: number; h?: number }) {
  const bars = Array.from({ length: Math.floor((to - from) / 3) + 1 }, (_, i) => from + i * 3);
  return (
    <g>
      {bars.map((y) => (
        <Box key={y} at={[x, y, 0]} size={[0.8, 0.8, h]} />
      ))}
      <Box at={[x - 0.2, from, h - 2.5]} size={[1.2, to - from + 0.8, 0.8]} />
      <Box at={[x - 0.2, from, 2]} size={[1.2, to - from + 0.8, 0.8]} />
    </g>
  );
}

function Guard({ at: [x, y], k = 1 }: { at: [number, number]; k?: number }) {
  const v = (n: number) => n * k;
  return (
    <g>
      <Box at={[x + v(0.8), y + v(0.6), 0]} size={[v(1.8), v(1.8), v(7.5)]} tone="navy" />
      <Box at={[x + v(0.8), y + v(3.2), 0]} size={[v(1.8), v(1.8), v(7.5)]} tone="navy" />
      <Box at={[x + v(0.4), y - v(1.2), v(8.5)]} size={[v(1.6), v(1.4), v(6.5)]} tone="navy" />
      <Box
        at={[x, y, v(7.5)]}
        size={[v(3.4), v(5.6), v(8)]}
        tone="navy"
        front={
          <g>
            <path d={`M0 ${v(5.4)} H${v(3.4)}`} className="iso-ink" />
            <circle cx={v(1)} cy={v(2.2)} r={v(0.7)} className="iso-dot" style={tint("amber")} />
          </g>
        }
        side={<path d={`M${v(2.8)} ${v(0.6)} V${v(7.4)}`} className="iso-ink" />}
      />
      <Box at={[x + v(0.4), y + v(6.8), v(8.5)]} size={[v(1.6), v(1.4), v(6.5)]} tone="navy" />
      <Box
        at={[x + v(0.5), y + v(1.1), v(15.5)]}
        size={[v(2.6), v(3.4), v(3.6)]}
        side={<g><circle cx={v(1)} cy={v(1.4)} r={v(0.45)} className="iso-dot" style={tint("fg")} /><circle cx={v(2.4)} cy={v(1.4)} r={v(0.45)} className="iso-dot" style={tint("fg")} /></g>}
      />
      <Box at={[x + v(0.2), y + v(0.8), v(19.1)]} size={[v(3.2), v(4), v(1.6)]} tone="navy" side={<circle cx={v(2)} cy={v(0.8)} r={v(0.5)} className="iso-dot" style={tint("amber")} />} />
      <Box at={[x + v(3.2), y + v(1), v(19.1)]} size={[v(1.6), v(3.6), v(0.4)]} tone="amber" />
    </g>
  );
}

function Letter({ at: [x, y, z], seal }: { at: Vec3; seal?: "lime" | "amber" }) {
  return (
    <Box
      at={[x, y, z]}
      size={[7, 5, 0.8]}
      top={
        <g>
          <path d="M0.4 0.4 L3.5 2.8 L6.6 0.4" className="iso-detail" />
          {seal === "lime" ? <circle cx={3.5} cy={3.4} r={1} className="iso-dot" style={tint("accent")} /> : null}
          {seal === "amber" ? <path d="M2.6 2.4 L4.4 4.2 M4.4 2.4 L2.6 4.2" className="iso-wire" style={tint("amber")} /> : null}
        </g>
      }
    />
  );
}

function Bubble({ at: [x, y, z] }: { at: Vec3 }) {
  return (
    <g transform={FRONT(x, y, z)}>
      <rect x={0} y={0} width={9} height={6} rx={1.6} className="iso-bubble" />
      <path d="M5 6 L6.6 8.4 L7 6" className="iso-bubble" />
      <text x={3.1} y={4.6} fontSize={4.6} className="iso-glyph">?</text>
    </g>
  );
}

function ConnectorEngine() {
  return (
    <Scene size={[112, 64, 32]} label="connector-engine: agents send calls as letters; a guard at the gate reads each one, stamps the allowed ones through to the tool servers and drops the rest">
      <Pad w={112} d={64} />
      <Rise n={1}>
        {(["sky", "violet", "amber"] as const).map((tone, i) => (
          <g key={tone}>
            <Box
              at={[3, 6 + i * 18, 0]}
              size={[14, 12, 9]}
              tone={tone}
              front={
                <g>
                  <rect x={3.5} y={2} width={7} height={5} rx={1.2} className="iso-ink" />
                  <path d="M5.5 3.4 V5 M8.5 3.4 V5" className="iso-ink" />
                </g>
              }
            />
            <WallText at={[4.5, 18 + i * 18, 2]} dark>{["mcp", "rest", "grpc"][i] ?? ""}</WallText>
          </g>
        ))}
      </Rise>
      <Rise n={2}>
        <Wire points={[[50, 32], [30, 32], [17, 12]]} tone="lime" dashed />
        <Wire points={[[50, 32], [17, 30]]} tone="lime" dashed />
        <Wire points={[[50, 32], [30, 32], [17, 48]]} tone="lime" dashed />
        <Letter at={[34, 22, 0]} seal="lime" />
        <Letter at={[24, 30, 0]} seal="lime" />
        <Fence x={54} from={2} to={22} />
      </Rise>
      <Rise n={3}>
        <Box at={[54, 24, 0]} size={[3, 3, 22]} tone="lime" />
        <Box at={[54, 39, 0]} size={[3, 3, 22]} tone="lime" />
        <Box at={[54, 24, 22]} size={[3, 18, 3]} tone="lime" />
        <Cylinder at={[55.5, 32, 25]} r={1.4} h={1.6} tone="lime" />
      </Rise>
      <Rise n={4}>
        <Guard at={[47.5, 48]} k={1.5} />
        <Bubble at={[44, 50, 40]} />
        <Fence x={54} from={45} to={62} />
        <Box at={[36, 50, 0]} size={[12, 9, 3]} tone="amber" top={<rect x={1} y={1} width={10} height={7} className="iso-ink" />} />
        <Letter at={[38.5, 52, 3]} seal="amber" />
      </Rise>
      <Rise n={5}>
        <Wire points={[[94, 13], [80, 31], [60, 31]]} tone="none" dashed />
        <Wire points={[[94, 47], [80, 33], [60, 33]]} tone="none" dashed />
        <Letter at={[66, 29, 0]} />
        <Letter at={[78, 30, 0]} />
        <Robot at={[90, 8]} />
        <Robot at={[90, 42]} />
      </Rise>
    </Scene>
  );
}

function LivePlatform() {
  const screen = (
    <g>
      <Fill x={3} y={3} w={12} h={7} c="sky" />
      <Fill x={3} y={3} w={12} h={1.4} c="violet" r={0.3} />
      <path d="M17 7 L19 12 L19.8 10 L21.8 9.4 Z" className="iso-dot" style={tint("fg")} />
    </g>
  );
  return (
    <Scene size={[96, 56, 30]} label="live-platform: a screen and camera shared from a link to another browser">
      <Pad w={96} d={56} />
      <Rise n={1}>
        <Monitor at={[6, 18]} w={26} h={16}>
          {screen}
        </Monitor>
        <Cylinder at={[19, 18.5, 21.5]} r={1.6} h={1.6} tone="violet" />
      </Rise>
      <Rise n={2}>
        <Wire points={[[22, 30], [40, 40], [58, 30]]} tone="lime" dashed />
        <g transform={TOP(38, 42, 0)}>
          <ellipse cx={0} cy={0} rx={3.2} ry={1.8} className="iso-wire" style={tint("lime")} />
          <ellipse cx={4.4} cy={0} rx={3.2} ry={1.8} className="iso-wire" style={tint("lime")} />
        </g>
      </Rise>
      <Rise n={3}>
        <Box at={[40, 10, 0]} size={[12, 10, 7]} tone="lime" front={<path d="M2 2.5 H10 M2 4.5 H7" className="iso-ink" />} />
        <WallText at={[41.5, 20, 5.5]} dark>sfu</WallText>
      </Rise>
      <Rise n={4}>
        <Monitor at={[62, 18]} w={26} h={16}>
          {screen}
        </Monitor>
      </Rise>
    </Scene>
  );
}

function HydraEnsemble() {
  const panes = ["violet", "lime", "sky"] as const;
  return (
    <Scene size={[90, 56, 34]} label="hydra-ensemble: three Claude Code terminals side by side, one git worktree each">
      <Pad w={90} d={56} />
      <Rise n={1}>
        <Box
          at={[8, 20, 0]}
          size={[70, 4, 30]}
          front={
            <g>
              <rect x={1} y={1} width={68} height={28} className="iso-base" />
              <Fill x={1} y={1} w={68} h={2.6} c="line-strong" r={0} />
              {panes.map((c, i) => (
                <g key={c}>
                  <rect x={2 + i * 22.4} y={4.6} width={21.4} height={23.4} className="iso-detail" />
                  <Fill x={2 + i * 22.4} y={4.6} w={21.4} h={2} c={c} r={0} />
                  <path d={`M${4 + i * 22.4} 10 H${14 + i * 22.4} M${4 + i * 22.4} 13.5 H${18 + i * 22.4} M${4 + i * 22.4} 17 H${11 + i * 22.4} M${4 + i * 22.4} 20.5 H${16 + i * 22.4}`} className="iso-detail" />
                  <Fill x={4 + i * 22.4} y={23} w={1.6} h={2.4} c={c} r={0} />
                </g>
              ))}
            </g>
          }
        />
      </Rise>
      {panes.map((c, i) => (
        <Rise key={c} n={2 + i}>
          <g transform={TOP(14 + i * 22, 34, 0)} style={tint(c)}>
            <path d="M2 0 V10 M2 3 C2 6 8 5 8 8 V10" className="iso-wire" />
            <circle cx={2} cy={0} r={1.4} className="iso-dot" />
            <circle cx={2} cy={10} r={1.4} className="iso-dot" />
            <circle cx={8} cy={10} r={1.4} className="iso-dot" />
          </g>
        </Rise>
      ))}
    </Scene>
  );
}

function AgentsVault() {
  return (
    <Scene size={[90, 56, 30]} label="agents-vault: a vault holding separate agent accounts and their limits">
      <Pad w={90} d={56} />
      <Rise n={1}>
        <Box
          at={[34, 10, 0]}
          size={[24, 20, 26]}
          front={
            <g>
              <rect x={2} y={2} width={20} height={22} rx={1} className="iso-detail" />
              <circle cx={10} cy={12} r={5} className="iso-wire" style={tint("amber")} />
              <circle cx={10} cy={12} r={1.2} className="iso-dot" style={tint("amber")} />
              <path d="M10 7 V9 M10 15 V17 M5 12 H7 M13 12 H15" className="iso-wire" style={tint("amber")} />
              <path d="M18 9 V15" className="iso-wire" />
            </g>
          }
        />
      </Rise>
      {(["violet", "sky", "lime"] as const).map((c, i) => (
        <Rise key={c} n={2 + i}>
          <Box
            at={[8 + i * 4, 34 + i * 5, i * 1.2]}
            size={[22, 14, 1.2]}
            tone={c}
            top={
              <g>
                <rect x={2} y={3} width={4} height={3.4} rx={0.6} className="iso-ink" />
                <path d="M2 9 H16 M2 11.5 H11" className="iso-ink" />
              </g>
            }
          />
        </Rise>
      ))}
      <Rise n={5}>
        <Box at={[66, 34, 0]} size={[16, 14, 3]} tone="amber" top={<g><path d="M2 11 A6 6 0 0 1 14 11" className="iso-ink" /><path d="M8 11 L12 6" className="iso-ink" /></g>} />
      </Rise>
    </Scene>
  );
}

function GoLint() {
  return (
    <Scene size={[90, 56, 22]} label="go-lint: one checklist applied to every Go repository">
      <Pad w={90} d={56} />
      <Rise n={1}>
        <Box
          at={[8, 8, 0]}
          size={[30, 38, 2]}
          top={
            <g>
              {[0, 1, 2, 3, 4].map((i) => (
                <g key={i}>
                  <rect x={3} y={4 + i * 6.6} width={3.6} height={3.6} rx={0.5} className="iso-detail" />
                  <path d={`M3.6 ${5.8 + i * 6.6} L4.8 ${7 + i * 6.6} L7.2 ${4 + i * 6.6}`} className="iso-wire" style={tint(i === 3 ? "amber" : "lime")} />
                  <path d={`M9 ${5.8 + i * 6.6} H${20 + (i % 3) * 3}`} className="iso-detail" />
                </g>
              ))}
            </g>
          }
        />
      </Rise>
      <Rise n={2}>
        <Cylinder at={[58, 18, 0]} r={9} h={4} tone="lime" />
        <g transform={TOP(53, 13, 4)}>
          <path d="M2 6 L5 9 L10 3" className="iso-ink" strokeWidth={2} />
        </g>
      </Rise>
      <Rise n={3}>
        <Box at={[46, 36, 0]} size={[38, 6, 2]} tone="amber" top={<g>{Array.from({ length: 13 }, (_, i) => <path key={i} d={`M${2 + i * 2.8} 0 V${i % 2 ? 2 : 3.6}`} className="iso-ink" />)}</g>} />
      </Rise>
    </Scene>
  );
}

function VersatileSh() {
  const mods = ["sky", "violet", "amber"] as const;
  return (
    <Scene size={[86, 56, 40]} label="versatile.sh: independent engine modules plugged into one protocol bus">
      <Pad w={86} d={56} />
      <Rise n={1}>
        <Box at={[8, 40, 0]} size={[70, 6, 2]} tone="lime" top={<g>{[10, 32, 54].map((x) => <rect key={x} x={x} y={1.5} width={6} height={3} rx={0.4} className="iso-ink" />)}</g>} />
      </Rise>
      {mods.map((c, i) => (
        <Rise key={c} n={2 + i}>
          <Box
            at={[14 + i * 22, 14, 0]}
            size={[16, 16, 22 + i * 4]}
            tone={c}
            front={
              <g>
                {[0, 1, 2, 3].map((r) => (
                  <rect key={r} x={2} y={3 + r * 4.6} width={12} height={2.6} rx={0.4} className="iso-ink" />
                ))}
                <circle cx={12.6} cy={20} r={0.9} className="iso-dot" style={tint("canvas")} />
              </g>
            }
          />
          <Wire points={[[22 + i * 22, 30], [22 + i * 22, 41]]} tone="lime" />
        </Rise>
      ))}
    </Scene>
  );
}

function OmarchyOmakase() {
  return (
    <Scene size={[90, 56, 34]} label="omarchy-omakase: a tiled Hyprland desktop set up by one script">
      <Pad w={90} d={56} />
      <Rise n={1}>
        <Monitor at={[12, 16]} w={62} h={28}>
          <g>
            <Fill x={2} y={2} w={58} h={2.4} c="amber" r={0.3} />
            <Fill x={2} y={5.4} w={30} h={20.6} c="lime" r={0.5} />
            <Fill x={33} y={5.4} w={27} h={10} c="sky" r={0.5} />
            <Fill x={33} y={16.4} w={27} h={9.6} c="violet" r={0.5} />
            <path d="M5 9 H16 M5 12 H22 M5 15 H13" className="iso-ink" />
          </g>
        </Monitor>
      </Rise>
      <Rise n={2}>
        <Box at={[18, 38, 0]} size={[48, 12, 2]} top={<g>{Array.from({ length: 3 }, (_, r) => Array.from({ length: 12 }, (_, c) => <rect key={`${r}${c}`} x={1.6 + c * 3.8} y={1.4 + r * 3.4} width={3} height={2.6} rx={0.4} className="iso-detail" />))}</g>} />
      </Rise>
    </Scene>
  );
}

const SCENES: Record<string, () => ReactNode> = {
  "connector-engine": ConnectorEngine,
  "live-platform": LivePlatform,
  "hydra-ensemble": HydraEnsemble,
  "agents-vault": AgentsVault,
  "go-lint": GoLint,
  "versatile-sh": VersatileSh,
  "omarchy-omakase": OmarchyOmakase,
};

/** The isometric picture of what one project does, or nothing when none is drawn. */
export function ProjectScene({ slug }: { slug: string }) {
  const Figure = SCENES[slug];
  return Figure ? <Figure /> : null;
}
