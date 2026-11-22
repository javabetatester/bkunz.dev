import type { CSSProperties } from "react";
import { Box, Cylinder, Scene, TOP, Wire } from "./kernel";

const step = (n: number) => ({ "--step": n }) as CSSProperties;

function Plate({ w, d }: { w: number; d: number }) {
  return (
    <g className="iso-rise" style={step(0)}>
      <Box at={[0, 0, -3]} size={[w, d, 3]} />
      <g transform={TOP(0, 0, 0)}>
        <rect width={w} height={d} className="iso-base" />
        {Array.from({ length: Math.floor(w / 10) - 1 }, (_, i) => (
          <line key={`x${i}`} x1={(i + 1) * 10} y1={2} x2={(i + 1) * 10} y2={d - 2} className="iso-detail" opacity={0.35} />
        ))}
        {Array.from({ length: Math.floor(d / 10) - 1 }, (_, i) => (
          <line key={`y${i}`} x1={2} y1={(i + 1) * 10} x2={w - 2} y2={(i + 1) * 10} className="iso-detail" opacity={0.35} />
        ))}
      </g>
    </g>
  );
}

/** Engines on a board: a connector hub, a rack, a journal drum, an edge chip and a desktop, cabled together. */
export function EnginesScene({ label }: { label: string }) {
  return (
    <Scene size={[150, 70, 46]} label={label}>
      <g>
      <Plate w={150} d={70} />
      <g className="iso-rise" style={step(1)}><Wire points={[[30, 34], [44, 34], [44, 24], [56, 24]]} z={0.5} tone="lime" dashed /></g>
      <g className="iso-rise" style={step(1)}><Wire points={[[78, 30], [92, 30], [92, 44]]} z={0.5} tone="sky" dashed /></g>
      <g className="iso-rise" style={step(1)}><Wire points={[[104, 52], [118, 52], [118, 40], [126, 40]]} z={0.5} tone="violet" dashed /></g>
      <g className="iso-rise" style={step(1)}><Wire points={[[24, 48], [24, 58], [60, 58], [60, 50]]} z={0.5} tone="amber" dashed /></g>

      <g className="iso-rise" style={step(1)}>
        <g>
          <Box
            at={[8, 22, 0]}
            size={[22, 22, 12]}
            tone="lime"
            top={
              <g>
                {[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={3 + c * 6.5} y={3 + r * 6.5} width={3.6} height={3.6} rx={0.6} className="iso-ink" />))}
              </g>
            }
            front={<path d="M3 4 H19 M3 7 H13" className="iso-ink" />}
          />
        </g>
      </g>

      <g className="iso-rise" style={step(2)}>
        <Box
          at={[56, 12, 0]}
          size={[20, 26, 34]}
          tone="sky"
          front={
            <g>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <g key={i}>
                  <rect x={2.5} y={3 + i * 5} width={15} height={3.4} rx={0.5} className="iso-ink" />
                  <circle cx={15.5} cy={4.7 + i * 5} r={0.7} className="iso-dot iso-blink" style={{ ...step(i), color: "var(--color-canvas)" }} />
                </g>
              ))}
            </g>
          }
          side={<path d="M3 4 V30 M7 4 V30 M11 4 V30 M15 4 V30 M19 4 V30 M23 4 V30" className="iso-ink" opacity={0.6} />}
        />
      </g>

      <g className="iso-rise" style={step(3)}>
        <Cylinder at={[100, 50, 0]} r={11} h={18} tone="violet" rings={3} />
      </g>

      <g className="iso-rise" style={step(4)}>
        <g>
          <Box
            at={[118, 22, 0]}
            size={[16, 16, 5]}
            tone="amber"
            top={
              <g>
                <rect x={4} y={4} width={8} height={8} rx={1} className="iso-ink" />
                {[2, 5, 8, 11, 14].map((v) => (
                  <path key={v} d={`M${v} 0 V2 M${v} 14 V16 M0 ${v} H2 M14 ${v} H16`} className="iso-ink" />
                ))}
              </g>
            }
          />
        </g>
      </g>

      <g className="iso-rise" style={step(5)}>
        <Box at={[86, 4, 0]} size={[22, 4, 2]} />
        <Box
          at={[88, 5, 2]}
          size={[18, 2, 14]}
          front={
            <g>
              <rect x={1.5} y={1.5} width={15} height={9} className="iso-detail" />
              <path d="M3 4 H9 M3 6 H13 M3 8 H7" className="iso-detail" />
            </g>
          }
        />
      </g>
      </g>
    </Scene>
  );
}

/** A writing desk: a stack of sheets, an open notebook, a lens over a page and a mug. */
export function NotesScene({ label }: { label: string }) {
  return (
    <Scene size={[130, 64, 30]} label={label}>
      <g>
      <Plate w={130} d={64} />
      {[0, 1, 2].map((i) => (
        <g key={i} className="iso-rise" style={step(1 + i)}>
          <Box at={[10 + i * 0.8, 18 - i * 0.6, i * 2.2]} size={[26, 20, 2]} />
        </g>
      ))}
      <g className="iso-rise" style={step(4)}>
        <g>
          <Box
            at={[12, 16, 6.6]}
            size={[26, 20, 2]}
            tone="lime"
            top={<path d="M4 4 H14 M4 8 H22 M4 11 H20 M4 14 H16" className="iso-ink" />}
          />
        </g>
      </g>

      <g className="iso-rise" style={step(5)}>
        <Box at={[48, 20, 0]} size={[22, 30, 2.5]} tone="sky" top={<path d="M3 4 H18 M3 8 H16 M3 12 H18 M3 16 H12 M3 20 H17 M3 24 H14" className="iso-ink" />} />
        <Box at={[70, 20, 0]} size={[22, 30, 2.5]} tone="sky" top={<path d="M4 4 H19 M4 8 H15 M4 12 H19 M4 16 H11" className="iso-ink" />} />
        <Box at={[68.5, 18, 2.5]} size={[3, 34, 1.2]} />
      </g>

      <g className="iso-rise" style={step(6)}>
        <g>
          <Cylinder at={[84, 34, 8]} r={6} h={1.5} tone="violet" />
          <Box at={[88, 38, 7]} size={[10, 2, 1.5]} tone="violet" />
        </g>
      </g>

      <g className="iso-rise" style={step(7)}>
        <Cylinder at={[110, 22, 0]} r={6} h={11} tone="amber" rings={1} />
        <g className="iso-rise" style={step(1)}><Wire points={[[115, 26], [119, 26], [119, 20], [115, 20]]} z={7} tone="amber" /></g>
      </g>
      </g>
    </Scene>
  );
}
