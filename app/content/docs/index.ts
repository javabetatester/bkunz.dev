import type { Lang } from "../copy";
import agentsVault from "./agents-vault";
import connectorEngine from "./connector-engine";
import goLint from "./go-lint";
import hydraEnsemble from "./hydra-ensemble";
import livePlatform from "./live-platform";
import omarchyOmakase from "./omarchy-omakase";
import type { ProjectDoc } from "./types";
import versatileSh from "./versatile-sh";

export const DOCS: Record<string, Partial<Record<Lang, ProjectDoc>>> = {
  "connector-engine": connectorEngine,
  "live-platform": livePlatform,
  "hydra-ensemble": hydraEnsemble,
  "agents-vault": agentsVault,
  "go-lint": goLint,
  "versatile-sh": versatileSh,
  "omarchy-omakase": omarchyOmakase,
};

export const docFor = (slug: string, lang: Lang): ProjectDoc | undefined => DOCS[slug]?.[lang] ?? DOCS[slug]?.en;
