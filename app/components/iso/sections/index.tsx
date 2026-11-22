import type { ReactNode } from "react";
import { scenes as agentsVault } from "./agents-vault";
import { scenes as connectorEngine } from "./connector-engine";
import { scenes as goLint } from "./go-lint";
import { scenes as hydraEnsemble } from "./hydra-ensemble";
import { scenes as livePlatform } from "./live-platform";
import { scenes as omarchyOmakase } from "./omarchy-omakase";
import { scenes as versatileSh } from "./versatile-sh";

const ALL: Record<string, () => ReactNode> = { ...agentsVault, ...connectorEngine, ...goLint, ...hydraEnsemble, ...livePlatform, ...omarchyOmakase, ...versatileSh };

/** A section illustration by id, or nothing when it is not drawn yet. */
export function SectionScene({ id }: { id: string }) {
  const Figure = ALL[id];
  return Figure ? <Figure /> : null;
}
