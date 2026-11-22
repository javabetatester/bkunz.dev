import type { CSSProperties, ReactNode } from "react";
import { Box, Cylinder, FloorText, FRONT, Scene, TOP, WallText, Wire, type Vec } from "../kernel";

type Tone = "lime" | "sky" | "violet" | "amber";
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

function Locker({ at: [x, y], tone, label, open = false }: { at: [number, number]; tone: Tone; label?: string; open?: boolean }) {
  return (
    <g>
      <Box
        at={[x, y, 0]}
        size={[12, 12, 14]}
        tone={tone}
        front={
          <g>
            <rect x={1.4} y={1.4} width={9.2} height={11.2} rx={0.6} className="iso-ink" />
            <path d="M3 3.6 H9 M3 5 H9" className="iso-ink" />
            <circle cx={8.4} cy={9.2} r={0.9} className="iso-dot" style={tint("canvas")} />
            {open ? <path d="M3 9.2 H6.4" className="iso-ink" /> : null}
          </g>
        }
      />
      {label ? <WallText at={[x + 1.8, y + 12, 5]} dark size={3.2}>{label}</WallText> : null}
    </g>
  );
}

function Screen({ at: [x, y, z], w, tone, label }: { at: Vec; w: number; tone: Tone; label: string }) {
  return (
    <g>
      <Box at={[x, y, z]} size={[w, 3, 10]} tone={tone} front={<path d="M2 3 H9 M2 5.6 H7" className="iso-ink" />} />
      <WallText at={[x + 1.4, y + 3, z + 4.4]} dark size={3.4}>{label}</WallText>
    </g>
  );
}

function Key({ at, tone = "amber" }: { at: [number, number, number]; tone?: Tone }) {
  return (
    <g transform={TOP(...at)} style={tint(tone)}>
      <circle cx={2} cy={2} r={1.6} className="iso-wire" />
      <path d="M3.6 2 H8 M6.4 2 V4 M8 2 V3.6" className="iso-wire" />
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

function Bubble({ at: [x, y, z], glyph }: { at: Vec; glyph: string }) {
  return (
    <g transform={FRONT(x, y, z)}>
      <rect x={0} y={0} width={9} height={6} rx={1.6} className="iso-bubble" />
      <path d="M5 6 L6.6 8.4 L7 6" className="iso-bubble" />
      <text x={2.4} y={4.6} fontSize={4.4} className="iso-glyph">{glyph}</text>
    </g>
  );
}

function Safe({ at: [x, y], label }: { at: [number, number]; label: string }) {
  return (
    <g>
      <Box
        at={[x, y, 0]}
        size={[16, 14, 14]}
        tone="amber"
        front={
          <g>
            <circle cx={8} cy={7} r={4.2} className="iso-ink" />
            <circle cx={8} cy={7} r={1} className="iso-dot" style={tint("canvas")} />
            <path d="M8 3.4 V5 M8 9 V10.6 M4.4 7 H6 M10 7 H11.6" className="iso-ink" />
          </g>
        }
      />
      <WallText at={[x + 1.6, y + 14, 3.4]} dark size={3.2}>{label}</WallText>
    </g>
  );
}

function Architecture() {
  const lockers: [Tone, string][] = [["violet", "acct"], ["sky", "acct"], ["lime", "acct"]];
  const harness = ["claude", "codex", "grok"];
  return (
    <Scene size={[104, 64, 30]} label="agents-vault architecture: the tray app and the vvault command both go through one store; the store keeps a private locker per account and the account's harness starts from its own locker">
      <Pad w={104} d={64} />
      <Rise n={1}>
        <Box at={[4, 8, 0]} size={[14, 3, 12]} tone="sky" front={<g><rect x={1.2} y={1.2} width={11.6} height={9.6} className="iso-ink" /><path d="M3 4 H9 M3 6.4 H7" className="iso-ink" /></g>} />
        <WallText at={[5.4, 11, 2.6]} dark size={3.4}>tray</WallText>
        <Box at={[4, 40, 0]} size={[14, 8, 6]} tone="sky" front={<path d="M2 2.6 L4 4 L2 5.4 M5.4 5.4 H9" className="iso-ink" />} />
        <WallText at={[5.4, 48, 2.2]} dark size={3.4}>vvault</WallText>
        <Wire points={[[18, 14], [28, 26]]} tone="sky" dashed />
        <Wire points={[[18, 44], [28, 38]]} tone="sky" dashed />
      </Rise>
      <Rise n={2}>
        <Box at={[28, 22, 0]} size={[14, 20, 8]} tone="violet" top={<g><rect x={2} y={2} width={10} height={16} className="iso-ink" /><path d="M4 5 H10 M4 8 H10 M4 11 H8" className="iso-ink" /></g>} />
        <WallText at={[29.4, 42, 6]} dark size={3.4}>ledger</WallText>
      </Rise>
      <Rise n={3}>
        {lockers.map(([tone, label], i) => (
          <g key={i}>
            <Wire points={[[42, 32], [50, 12 + i * 20]]} tone={tone} dashed />
            <Locker at={[52, 6 + i * 20]} tone={tone} label={label} />
          </g>
        ))}
      </Rise>
      <Rise n={4}>
        {lockers.map(([tone], i) => (
          <g key={i}>
            <Wire points={[[64, 12 + i * 20], [78, 12 + i * 20]]} tone={tone} dashed />
            <Box at={[80, 6 + i * 20, 0]} size={[16, 12, 8]} front={<g><rect x={1.4} y={1.4} width={13.2} height={5.2} className="iso-base" /><path d="M2.6 2.8 L4.2 4 L2.6 5.2" className="iso-wire" style={tint(tone)} /></g>} />
            <WallText at={[81.6, 18 + i * 20, 3.2]} size={3.2}>{harness[i] ?? ""}</WallText>
          </g>
        ))}
      </Rise>
    </Scene>
  );
}

function OpenFlow() {
  return (
    <Scene size={[104, 64, 30]} label="agents-vault opening an account: the terminal asks the vault to run an account, inherited identity variables are dropped at a gate, and the key leaves the keychain safe only at the last moment, straight into the new process">
      <Pad w={104} d={64} />
      <Rise n={1}>
        <Box at={[4, 26, 0]} size={[14, 10, 7]} tone="sky" front={<path d="M2 2.6 L4 4.2 L2 5.8 M5.4 5.8 H10" className="iso-ink" />} />
        <WallText at={[5.4, 36, 2.4]} dark size={3.2}>vvault run</WallText>
        <Wire points={[[18, 31], [34, 31]]} tone="sky" dashed />
      </Rise>
      <Rise n={2}>
        <Box at={[34, 20, 0]} size={[3, 3, 20]} tone="lime" />
        <Box at={[34, 40, 0]} size={[3, 3, 20]} tone="lime" />
        <Box at={[34, 20, 20]} size={[3, 23, 3]} tone="lime" />
        {[26, 30, 34].map((y) => (
          <Box key={y} at={[34.6, y, 0]} size={[1.6, 0.8, 8]} />
        ))}
        <Bubble at={[30, 24, 34]} glyph="id" />
        <Box at={[26, 48, 0]} size={[16, 10, 3]} tone="amber" top={<g><rect x={1} y={1} width={14} height={8} className="iso-ink" /><path d="M3 3 L6 6 M6 3 L3 6 M9 3 L12 6 M12 3 L9 6" className="iso-ink" /></g>} />
        <WallText at={[27.6, 58, 2.6]} dark size={3.2}>dropped</WallText>
      </Rise>
      <Rise n={3}>
        <Locker at={[48, 6]} tone="violet" label="home" open />
        <Wire points={[[54, 18], [54, 28], [76, 28]]} tone="violet" dashed />
        <Wire points={[[18, 36], [28, 36]]} tone="none" />
      </Rise>
      <Rise n={4}>
        <Safe at={[46, 42]} label="keychain" />
        <Key at={[58, 52, 0]} />
        <Wire points={[[62, 50], [76, 36]]} tone="amber" dashed />
        <FloorText at={[60, 58, 0]} tone="amber" size={3.4}>at launch</FloorText>
      </Rise>
      <Rise n={5}>
        <Box at={[76, 22, 0]} size={[20, 14, 10]} tone="lime" front={<g><rect x={2} y={1.6} width={16} height={6.8} className="iso-ink" /><path d="M3.6 3.4 L5.2 5 L3.6 6.6" className="iso-ink" /></g>} />
        <WallText at={[77.6, 36, 2.4]} dark size={3.4}>harness</WallText>
        <Letter at={[66, 26, 0]} seal="lime" />
      </Rise>
    </Scene>
  );
}

function Limits() {
  const rows: { tone: Tone; a: number; b: number }[] = [{ tone: "lime", a: 7, b: 3 }, { tone: "amber", a: 11, b: 9 }, { tone: "sky", a: 5, b: 2 }];
  return (
    <Scene size={[104, 64, 30]} label="agents-vault limits: readings from the status line, the account endpoints and provider balances are written into a ledger book, one row per account with a session gauge and a weekly gauge, and a clock keeps idle accounts renewed">
      <Pad w={104} d={64} />
      <Rise n={1}>
        <Screen at={[4, 6, 0]} w={16} tone="sky" label="status" />
        <Screen at={[4, 26, 0]} w={16} tone="violet" label="usage" />
        <Screen at={[4, 46, 0]} w={16} tone="amber" label="balance" />
        <Wire points={[[20, 8], [34, 18]]} tone="sky" dashed />
        <Wire points={[[20, 28], [34, 32]]} tone="violet" dashed />
        <Wire points={[[20, 48], [34, 44]]} tone="amber" dashed />
      </Rise>
      <Rise n={2}>
        <Box
          at={[36, 12, 0]}
          size={[38, 40, 2]}
          top={
            <g>
              <path d="M19 1 V39" className="iso-detail" />
              {rows.map((r, i) => (
                <g key={i}>
                  <rect x={3} y={4 + i * 11.4} width={3} height={3} rx={0.5} className="iso-dot" style={tint(r.tone)} />
                  <rect x={8} y={4 + i * 11.4} width={9} height={1.6} className="iso-detail" />
                  <rect x={8} y={4 + i * 11.4} width={r.a} height={1.6} className="iso-dot" style={tint(r.a > 10 ? "amber" : r.tone)} />
                  <rect x={8} y={7 + i * 11.4} width={9} height={1.6} className="iso-detail" />
                  <rect x={8} y={7 + i * 11.4} width={r.b} height={1.6} className="iso-dot" style={tint(r.b > 8 ? "amber" : r.tone)} />
                  <path d="M22 5 H34 M22 8 H30" transform={`translate(0 ${i * 11.4})`} className="iso-detail" />
                </g>
              ))}
            </g>
          }
        />
        <FloorText at={[37, 54, 0]} size={3.4}>session / weekly</FloorText>
      </Rise>
      <Rise n={3}>
        {rows.map((r, i) => (
          <g key={i}>
            <Box
              at={[84, 6 + i * 18, 0]}
              size={[14, 3, 12]}
              tone={r.tone}
              front={
                <g>
                  <path d="M2.4 10 A4.6 4.6 0 0 1 11.6 10" className="iso-ink" />
                  <path d={`M7 10 L${r.a > 10 ? 10.6 : 4.6} ${r.a > 10 ? 5.4 : 5.2}`} className="iso-ink" />
                </g>
              }
            />
          </g>
        ))}
        <Cylinder at={[60, 58, 0]} r={2.6} h={6} tone="amber" rings={1} />
        <FloorText at={[64, 56, 0]} tone="amber" size={3.4}>keep-alive</FloorText>
      </Rise>
    </Scene>
  );
}

function Safety() {
  return (
    <Scene size={[104, 64, 30]} label="agents-vault safety model: every account lives in its own locker and nothing is copied between them; keys stay in the keychain safe and only a locked-door gate lets traffic out, over https">
      <Pad w={104} d={64} />
      <Rise n={1}>
        <Locker at={[6, 8]} tone="violet" label="acct 1" />
        <Locker at={[6, 40]} tone="sky" label="acct 2" />
        <Wire points={[[18, 16], [30, 24], [30, 40], [18, 46]]} tone="amber" dashed />
        <Box at={[26, 29, 0]} size={[8, 6, 1]} top={<path d="M2 1.6 L6 4.4 M6 1.6 L2 4.4" className="iso-wire" style={tint("amber")} />} />
        <FloorText at={[32, 22, 0]} tone="amber" size={3.4}>no copy</FloorText>
      </Rise>
      <Rise n={2}>
        <Safe at={[48, 8]} label="keychain" />
        <Key at={[52, 28, 0]} />
        <Wire points={[[56, 24], [68, 36]]} tone="amber" dashed />
        <Bubble at={[50, 22, 24]} glyph="key" />
      </Rise>
      <Rise n={3}>
        <Box at={[68, 24, 0]} size={[3, 3, 22]} tone="lime" />
        <Box at={[68, 42, 0]} size={[3, 3, 22]} tone="lime" />
        <Box at={[68, 24, 22]} size={[3, 21, 3]} tone="lime" />
        <Letter at={[58, 40, 0]} seal="amber" />
        <FloorText at={[52, 52, 0]} tone="amber" size={3.4}>http: refused</FloorText>
      </Rise>
      <Rise n={4}>
        <Wire points={[[72, 34], [84, 34]]} tone="lime" dashed />
        <Letter at={[76, 29, 0]} seal="lime" />
        <Box at={[86, 26, 0]} size={[14, 12, 9]} tone="sky" front={<path d="M3 3 H11 M3 5.4 H8" className="iso-ink" />} />
        <WallText at={[87.4, 38, 2.4]} dark size={3.4}>https</WallText>
      </Rise>
    </Scene>
  );
}

export const scenes: Record<string, () => ReactNode> = {
  "agents-vault/architecture": Architecture,
  "agents-vault/open-flow": OpenFlow,
  "agents-vault/limits": Limits,
  "agents-vault/safety": Safety,
};
