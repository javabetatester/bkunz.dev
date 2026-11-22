import type { CSSProperties, ReactNode } from "react";
import { Box, Cylinder, FloorText, FRONT, Scene, TOP, WallText, Wire, type Vec } from "../kernel";

const tint = (c: string) => ({ color: `var(--color-${c})` }) as CSSProperties;
const Rise = ({ n, children }: { n: number; children: ReactNode }) => (
  <g className="iso-rise" style={{ "--step": n } as CSSProperties}>
    {children}
  </g>
);

function Pad({ w, d }: { w: number; d: number }) {
  return (
    <g className="iso-rise" style={{ "--step": 0 } as CSSProperties} transform={TOP(0, 0, 0)}>
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

function Guard({ at: [x, y], tone = "violet" }: { at: [number, number]; tone?: "violet" | "sky" }) {
  return (
    <g>
      <Box at={[x + 0.6, y + 0.6, 0]} size={[5, 6, 7]} />
      <Box
        at={[x, y, 7]}
        size={[6.2, 7.2, 8]}
        tone={tone}
        front={<g><path d="M1.2 2 H5" className="iso-ink" /><rect x={3.6} y={3.4} width={1.6} height={1.6} rx={0.3} className="iso-ink" /></g>}
        side={<path d="M2 1.6 V6.4 M5.2 1.6 V6.4" className="iso-ink" />}
      />
      <Box
        at={[x + 0.7, y + 0.9, 15]}
        size={[4.8, 5.4, 5]}
        front={<g><circle cx={1.4} cy={2.2} r={0.6} className="iso-dot" style={tint("fg")} /><circle cx={3.4} cy={2.2} r={0.6} className="iso-dot" style={tint("fg")} /><path d="M1.4 3.8 H3.4" className="iso-detail" /></g>}
      />
      <Box at={[x - 0.2, y + 0.2, 20]} size={[6.6, 6.8, 1.4]} tone="amber" />
    </g>
  );
}

function Letter({ at: [x, y, z], seal }: { at: Vec; seal?: "lime" | "amber" }) {
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

function Bubble({ at: [x, y, z], glyph = "?" }: { at: Vec; glyph?: string }) {
  return (
    <g transform={FRONT(x, y, z)}>
      <rect x={0} y={0} width={9} height={6} rx={1.6} className="iso-bubble" />
      <path d="M5 6 L6.6 8.4 L7 6" className="iso-bubble" />
      <text x={2.6} y={4.6} fontSize={4.6} className="iso-glyph">{glyph}</text>
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
    </g>
  );
}

function Server({ at: [x, y], tone, label }: { at: [number, number]; tone: "sky" | "violet" | "amber" | "lime"; label: string }) {
  return (
    <g>
      <Box
        at={[x, y, 0]}
        size={[14, 12, 9]}
        tone={tone}
        front={<g><rect x={3.5} y={2} width={7} height={5} rx={1.2} className="iso-ink" /><path d="M5.5 3.4 V5 M8.5 3.4 V5" className="iso-ink" /></g>}
      />
      <WallText at={[x + 1.5, y + 12, 2.2]} dark size={3.4}>{label}</WallText>
    </g>
  );
}

function Doc({ at: [x, y, z], seal, lines = true }: { at: Vec; seal: "lime" | "amber" | "sky"; lines?: boolean }) {
  return (
    <Box
      at={[x, y, z]}
      size={[10, 8, 1]}
      top={
        <g>
          {lines ? <path d="M1.2 1.6 H7 M1.2 3.4 H5.4 M1.2 5.2 H6.2" className="iso-detail" /> : null}
          <circle cx={7.6} cy={5.8} r={1.5} className="iso-dot" style={tint(seal === "lime" ? "accent" : seal)} />
        </g>
      }
    />
  );
}

function Architecture() {
  return (
    <Scene size={[104, 64, 28]} label="connector-engine architecture: inbound adapters on the left call a pure core only through the port ring, and the core reaches stores, runtimes and secrets on the right only through the same ports">
      <Pad w={104} d={64} />
      <Rise n={1}>
        <Wire points={[[20, 16], [34, 26]]} tone="sky" dashed />
        <Wire points={[[20, 46], [34, 38]]} tone="sky" dashed />
        <Wire points={[[66, 24], [80, 14]]} tone="amber" dashed />
        <Wire points={[[66, 32], [80, 32]]} tone="amber" dashed />
        <Wire points={[[66, 40], [80, 50]]} tone="amber" dashed />
        <Server at={[6, 10]} tone="sky" label="mcp" />
        <Server at={[6, 40]} tone="sky" label="grpc" />
        <Letter at={[22, 18, 0]} />
        <Letter at={[24, 40, 0]} />
      </Rise>
      <Rise n={2}>
        <Box at={[34, 16, 0]} size={[32, 32, 2]} tone="lime" top={<path d="M2 2 H30 V30 H2 Z" className="iso-ink" />} />
        <FloorText at={[36, 42, 2]} tone="lime" size={4}>port</FloorText>
      </Rise>
      <Rise n={3}>
        <Box at={[42, 24, 2]} size={[16, 14, 14]} tone="violet" front={<path d="M2 3 H14 M2 5.4 H10" className="iso-ink" />} />
        <WallText at={[43.6, 38, 10]} dark size={4}>core</WallText>
        <Bubble at={[40, 38, 28]} glyph="in" />
      </Rise>
      <Rise n={4}>
        <Server at={[80, 8]} tone="amber" label="store" />
        <Server at={[80, 26]} tone="amber" label="rest" />
        <Server at={[80, 44]} tone="amber" label="keys" />
        <Letter at={[68, 18, 0]} seal="lime" />
      </Rise>
    </Scene>
  );
}

function ApprovalFlow() {
  return (
    <Scene size={[104, 64, 32]} label="connector-engine approval flow: the guard parks a letter in a waiting tray, a person stamps it, and the stamped letter runs once on the tool server">
      <Pad w={104} d={64} />
      <Rise n={1}>
        <Robot at={[4, 24]} />
        <Wire points={[[14, 29], [26, 29]]} tone="none" dashed />
        <Letter at={[16, 26, 0]} />
        <Fence x={22} from={14} to={44} />
      </Rise>
      <Rise n={2}>
        <Guard at={[26, 36]} />
        <Bubble at={[24, 38, 30]} />
        <Wire points={[[32, 42], [40, 42], [42, 46]]} tone="amber" dashed />
      </Rise>
      <Rise n={3}>
        <Box at={[40, 44, 0]} size={[16, 12, 3]} tone="amber" top={<rect x={1} y={1} width={14} height={10} className="iso-ink" />} />
        <Letter at={[44.5, 47, 3]} />
        <Cylinder at={[48, 40, 0]} r={2.4} h={7} tone="amber" rings={2} />
        <FloorText at={[40, 57, 0]} tone="amber" size={3.6}>20s hold</FloorText>
      </Rise>
      <Rise n={4}>
        <Wire points={[[56, 49], [64, 49], [64, 46]]} tone="violet" dashed />
        <Guard at={[62, 36]} tone="sky" />
        <Box at={[58, 48, 0]} size={[14, 8, 5]} top={<g><rect x={2} y={1.4} width={6} height={5} rx={0.6} className="iso-detail" /><circle cx={11} cy={4} r={1.6} className="iso-dot" style={tint("accent")} /></g>} />
        <Cylinder at={[67, 50, 5]} r={1.6} h={4} tone="lime" />
        <Bubble at={[60, 38, 30]} glyph="ok" />
      </Rise>
      <Rise n={5}>
        <Wire points={[[72, 40], [80, 40], [84, 22]]} tone="lime" dashed />
        <Letter at={[76, 36, 0]} seal="lime" />
        <Server at={[84, 6]} tone="sky" label="runs once" />
      </Rise>
    </Scene>
  );
}

function Keys() {
  const keyRow = (tones: ("accent" | "amber" | "none")[]) => (
    <g>
      <circle cx={3} cy={4} r={2.2} className="iso-wire" />
      {tones.map((t, i) =>
        t === "none" ? (
          <path key={i} d={`M${6 + i * 3.2} 2.4 V6 H${8 + i * 3.2}`} className="iso-detail" />
        ) : (
          <path key={i} d={`M${6 + i * 3.2} 2.4 V6 H${8 + i * 3.2}`} className="iso-wire" style={tint(t)} />
        ),
      )}
    </g>
  );
  return (
    <Scene size={[104, 64, 34]} label="connector-engine grants: an agent's key ring holds one key per function; four stacked grant layers cut the keys down to the strictest mode, and each function door opens, waits for a person or does not exist">
      <Pad w={104} d={64} />
      <Rise n={1}>
        <Robot at={[4, 18]} />
        <Box at={[4, 34, 0]} size={[22, 12, 1.5]} tone="violet" top={<g><circle cx={5} cy={6} r={3} className="iso-ink" strokeWidth={1.2} />{[0, 1, 2].map((i) => <path key={i} d={`M${9 + i * 4.4} 3 V9 H${11.4 + i * 4.4}`} className="iso-ink" strokeWidth={1.2} />)}</g>} />
        <FloorText at={[5, 48, 0]} size={3.6}>agent keys</FloorText>
        <Wire points={[[13, 27], [30, 30]]} tone="none" dashed />
      </Rise>
      <Rise n={2}>
        {(["tenant", "workspace", "agent", "user"] as const).map((layer, i) => (
          <g key={layer}>
            <Box
              at={[40, 14, i * 4.2]}
              size={[24, 20, 3.4]}
              tone={layer === "workspace" || layer === "agent" ? "violet" : "none"}
              front={<text x={1.4} y={2.6} fontSize={2.5} className={layer === "workspace" || layer === "agent" ? "iso-text-ink" : "iso-text"}>{layer}</text>}
            />
          </g>
        ))}
        <FloorText at={[40, 36, 0]} tone="amber" size={3.4}>strictest wins</FloorText>
      </Rise>
      <Rise n={3}>
        <Wire points={[[64, 24], [78, 14]]} tone="lime" dashed />
        <Wire points={[[64, 24], [78, 32]]} tone="amber" dashed />
        <Wire points={[[64, 24], [78, 50]]} tone="none" dashed />
      </Rise>
      <Rise n={4}>
        <Server at={[80, 6]} tone="lime" label="allow" />
        <Server at={[80, 26]} tone="amber" label="ask" />
        <Box at={[80, 46, 0]} size={[14, 12, 9]} front={<path d="M3 2 L11 7 M11 2 L3 7" className="iso-detail" />} />
        <WallText at={[81.5, 58, 2.2]} size={3.4}>deny</WallText>
        <Letter at={[70, 12, 0]} seal="lime" />
      </Rise>
    </Scene>
  );
}

function Pinning() {
  return (
    <Scene size={[104, 64, 30]} label="connector-engine pinning: a tool definition is sealed with a hash wax seal when captured; on every re-list the new seal is compared with the pinned one, a match stays live and a change goes to quarantine until a person accepts it">
      <Pad w={104} d={64} />
      <Rise n={1}>
        <Server at={[4, 26]} tone="sky" label="server" />
        <Wire points={[[18, 28], [30, 14]]} tone="none" dashed />
        <Wire points={[[18, 34], [30, 48]]} tone="none" dashed />
        <Cylinder at={[11, 50, 0]} r={2.6} h={6} tone="amber" rings={1} />
        <FloorText at={[16, 54, 0]} tone="amber" size={3.4}>re-list</FloorText>
      </Rise>
      <Rise n={2}>
        <Doc at={[30, 8, 0]} seal="lime" />
        <FloorText at={[30, 18, 0]} tone="lime" size={3.6}>pinned</FloorText>
        <Doc at={[30, 42, 0]} seal="amber" />
        <FloorText at={[30, 52, 0]} tone="amber" size={3.6}>new list</FloorText>
      </Rise>
      <Rise n={3}>
        <Wire points={[[41, 14], [52, 26]]} tone="lime" dashed />
        <Wire points={[[41, 47], [52, 36]]} tone="amber" dashed />
        <Box at={[52, 24, 0]} size={[14, 14, 10]} tone="violet" front={<path d="M3 3 H11 M3 6 H11" className="iso-ink" strokeWidth={1.2} />} />
        <WallText at={[53.4, 38, 9]} dark size={4}>hash =</WallText>
      </Rise>
      <Rise n={4}>
        <Wire points={[[66, 28], [82, 14]]} tone="lime" dashed />
        <Wire points={[[66, 34], [82, 48]]} tone="amber" dashed />
        <Box at={[82, 6, 0]} size={[16, 14, 3]} tone="lime" top={<path d="M3 7 L6 10 L12 3" className="iso-ink" strokeWidth={1.4} />} />
        <FloorText at={[82, 22, 0]} tone="lime" size={3.6}>same: live</FloorText>
      </Rise>
      <Rise n={5}>
        <Fence x={82} from={40} to={58} h={9} />
        <Fence x={96} from={40} to={58} h={9} />
        <Box at={[84, 44, 0]} size={[10, 8, 1]} top={<path d="M2 2 L8 6 M8 2 L2 6" className="iso-wire" style={tint("amber")} />} />
        <FloorText at={[78, 60, 0]} tone="amber" size={3.6}>changed: held</FloorText>
      </Rise>
    </Scene>
  );
}

export const scenes: Record<string, () => ReactNode> = {
  "connector-engine/architecture": Architecture,
  "connector-engine/approval-flow": ApprovalFlow,
  "connector-engine/grants": Keys,
  "connector-engine/pinning": Pinning,
};
