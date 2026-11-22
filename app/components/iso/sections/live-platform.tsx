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

function Join() {
  return (
    <Scene size={[100, 64, 24]} label="live-platform join flow: a guest holding a link ticket walks through the door of a room and the room hands out a seat">
      <Pad w={100} d={64} />
      <Rise n={1}>
        <Person at={[10, 28]} tone="violet" />
        <Mail at={[24, 29, 0]} tone="lime" />
        <Wire points={[[16, 31], [48, 31]]} tone="lime" dashed />
        <FloorText at={[6, 44, 0]}>link</FloorText>
      </Rise>
      <Rise n={2}>
        <Box at={[52, 6, 0]} size={[44, 52, 0.8]} />
        <Box at={[52, 6, 0.8]} size={[44, 1.5, 11]} />
        <Box at={[52, 7.5, 0.8]} size={[1.5, 17, 11]} />
      </Rise>
      <Rise n={3}>
        <Chair at={[70, 12]} />
        <Person at={[71.3, 13.5]} tone="lime" seated />
      </Rise>
      <Rise n={4}>
        <Box at={[51.5, 24.5, 0.8]} size={[2.5, 2.5, 12]} tone="lime" />
        <Box at={[51.5, 35.5, 0.8]} size={[2.5, 2.5, 12]} tone="lime" />
        <Box at={[51.5, 24.5, 12.8]} size={[2.5, 13.5, 2]} tone="lime" />
        <Chair at={[62, 28]} tone="amber" />
        <Box at={[52, 38, 0.8]} size={[1.5, 20, 11]} />
      </Rise>
      <Rise n={5}>
        <Chair at={[80, 38]} />
        <Person at={[81.3, 39.5]} tone="sky" seated />
        <FloorText at={[56, 48, 0.8]} tone="amber">seat</FloorText>
      </Rise>
    </Scene>
  );
}

function Forward() {
  const kinds = ["sky", "violet", "amber"] as const;
  const guests: [number, number][] = [[84, 4], [86, 26], [80, 48]];
  return (
    <Scene size={[100, 64, 24]} label="live-platform media path: the server is a post office that forwards each track from a sender to every guest without opening it">
      <Pad w={100} d={64} />
      <Rise n={1}>
        <Person at={[6, 28]} tone="violet" />
        {kinds.map((c, i) => (
          <g key={c}>
            <Mail at={[16, 18 + i * 9, 0]} tone={c} />
            <Wire points={[[24, 20.5 + i * 9], [38, 25 + i * 6]]} tone="none" dashed />
          </g>
        ))}
      </Rise>
      <Rise n={2}>
        <Box
          at={[38, 20, 0]}
          size={[22, 22, 13]}
          tone="lime"
          front={<g><rect x={3} y={3} width={16} height={2} className="iso-ink" /><rect x={3} y={6.5} width={16} height={2} className="iso-ink" /></g>}
        />
        <WallText at={[40, 42, 11.5]} dark>sfu</WallText>
      </Rise>
      <Rise n={3}>
        {guests.map(([x, y], i) => (
          <g key={x}>
            <Wire points={[[60, 31], [72, 31], [72, y + 4], [x - 2, y + 4]]} tone="lime" dashed />
            {kinds.map((c, k) => (
              <Mail key={c} at={[x - 14, y + 1 + k * 3.6, 0]} tone={c} mini />
            ))}
            <Person at={[x, y]} tone={kinds[i] ?? "sky"} />
          </g>
        ))}
      </Rise>
    </Scene>
  );
}

function Presence() {
  return (
    <Scene size={[100, 64, 26]} label="live-platform presence: the server keeps the roster, shows who is unstable, holds a reserved seat for someone who reloads and removes who does not return">
      <Pad w={100} d={64} />
      <Rise n={1}>
        <Box
          at={[8, 6, 0]}
          size={[40, 3, 20]}
          front={
            <g>
              <rect x={1.5} y={1.5} width={37} height={17} className="iso-base" />
              {(["accent", "amber", "muted"] as const).map((c, i) => (
                <g key={c}>
                  <circle cx={5} cy={5 + i * 4.6} r={1.2} className="iso-dot" style={tint(c)} />
                  <path d={`M9 ${5 + i * 4.6} H${22 + i * 4}`} className="iso-detail" />
                </g>
              ))}
            </g>
          }
        />
        <WallText at={[10, 9, 24]} size={3.6}>roster</WallText>
      </Rise>
      <Rise n={2}>
        <Chair at={[10, 36]} />
        <Person at={[11.3, 37.5]} tone="lime" seated />
        <Chair at={[34, 36]} />
        <Person at={[35.3, 37.5]} tone="amber" seated />
        <Chair at={[58, 36]} tone="amber" />
        <Mail at={[58.5, 38.5, 3]} tone="amber" mini />
      </Rise>
      <Rise n={3}>
        <Cylinder at={[80, 14, 0]} r={6} h={4} tone="violet" />
        <g transform={TOP(76, 10, 4)}>
          <path d="M4 1.5 V4.6 L6.4 6" className="iso-ink" />
        </g>
        <FloorText at={[74, 24, 0]} tone="violet">4 s</FloorText>
      </Rise>
      <Rise n={4}>
        <g transform={FRONT(33, 36, 18)}>
          <rect x={0} y={0} width={9} height={6} rx={1.6} className="iso-bubble" />
          <path d="M5 6 L6.6 8.4 L7 6" className="iso-bubble" />
          <text x={3.1} y={4.6} fontSize={4.6} className="iso-glyph">?</text>
        </g>
        <FloorText at={[8, 50, 0]}>here</FloorText>
        <FloorText at={[32, 50, 0]} tone="amber">unsure</FloorText>
        <FloorText at={[56, 50, 0]} tone="amber">held</FloorText>
      </Rise>
    </Scene>
  );
}

export const scenes: Record<string, () => ReactNode> = {
  "live-platform/join": Join,
  "live-platform/forward": Forward,
  "live-platform/presence": Presence,
};
