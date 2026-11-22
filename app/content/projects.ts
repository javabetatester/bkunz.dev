import type { Lang } from "./copy";

export type Project = {
  slug: string;
  name: string;
  href: string;
  lang: string;
  kind: "versatile.sh" | "personal";
  summary: Record<Lang, string>;
};

export const PROJECTS: Project[] = [
  {
    slug: "connector-engine",
    name: "connector-engine",
    href: "https://github.com/versatile-sh/connector-engine",
    lang: "Go",
    kind: "versatile.sh",
    summary: {
      en: "Connector store and MCP gateway for agents: one endpoint in front of MCP, REST and gRPC tool servers, per-agent and per-function grants, approval on use, definitions pinned by hash, tenant catalogs.",
      es: "Tienda de conectores y gateway MCP para agentes: un endpoint delante de servidores MCP, REST y gRPC, permisos por agente y por función, aprobación en el uso, definiciones fijadas por hash, catálogos por tenant.",
      "pt-br": "Loja de conectores e gateway MCP para agentes: um endpoint na frente de servidores MCP, REST e gRPC, permissões por agente e por função, aprovação no uso, definições fixadas por hash, catálogos por tenant.",
    },
  },
  {
    slug: "live-platform",
    name: "live-platform",
    href: "https://github.com/versatile-sh/live-platform",
    lang: "Go · TypeScript",
    kind: "versatile.sh",
    summary: {
      en: "Screen, voice and camera sharing from a link: a browser call on its own Go media server, with a React client. No account, nothing to install.",
      es: "Compartir pantalla, voz y cámara desde un link: una llamada en el navegador sobre su propio servidor de medios en Go, con cliente React. Sin cuenta, nada que instalar.",
      "pt-br": "Compartilhar tela, voz e câmera a partir de um link: uma chamada no navegador sobre um servidor de mídia próprio em Go, com cliente React. Sem conta, nada para instalar.",
    },
  },
  {
    slug: "hydra-ensemble",
    name: "hydra-ensemble",
    href: "https://github.com/javabetatester/hydra-ensemble",
    lang: "TypeScript · Tauri",
    kind: "personal",
    summary: {
      en: "Desktop app that runs Claude Code sessions in parallel: xterm.js terminals over PTYs, one git worktree and one CLAUDE_CONFIG_DIR per session, live state (thinking, generating, idle) detected from the PTY stream, token cost read from the session JSONL.",
      es: "App de escritorio que ejecuta sesiones de Claude Code en paralelo: terminales xterm.js sobre PTYs, un git worktree y un CLAUDE_CONFIG_DIR por sesión, estado en vivo (thinking, generating, idle) detectado del stream del PTY, costo de tokens leído del JSONL de la sesión.",
      "pt-br": "App desktop que roda sessões do Claude Code em paralelo: terminais xterm.js sobre PTYs, uma git worktree e um CLAUDE_CONFIG_DIR por sessão, estado ao vivo (thinking, generating, idle) detectado no stream do PTY, custo de tokens lido do JSONL da sessão.",
    },
  },
  {
    slug: "agents-vault",
    name: "agents-vault",
    href: "https://github.com/versatile-sh/agents-vault",
    lang: "Rust",
    kind: "versatile.sh",
    summary: {
      en: "Account ledger for coding-agent harnesses: Claude Code, Codex and Grok accounts, API keys and routers, each signed in on its own and isolated, with live limits.",
      es: "Ledger de cuentas para harnesses de agentes de código: cuentas de Claude Code, Codex y Grok, API keys y routers, cada una con su propia sesión y aislada, con límites en vivo.",
      "pt-br": "Ledger de contas para harnesses de agentes de código: contas de Claude Code, Codex e Grok, API keys e routers, cada uma com sua própria sessão e isolada, com limites ao vivo.",
    },
  },
  {
    slug: "go-lint",
    name: "go-lint",
    href: "https://github.com/versatile-sh/go-lint",
    lang: "Go",
    kind: "versatile.sh",
    summary: {
      en: "One lint kit for every Go repository: a generated golangci-lint config, a drift check that fails when a repository diverges, and custom go/analysis analyzers.",
      es: "Un kit de lint para cada repositorio Go: una config de golangci-lint generada, un drift check que falla cuando un repositorio diverge y analyzers propios de go/analysis.",
      "pt-br": "Um kit de lint para todo repositório Go: uma config de golangci-lint gerada, um drift check que falha quando um repositório diverge e analyzers próprios de go/analysis.",
    },
  },
{
    slug: "versatile-sh",
    name: "versatile.sh",
    href: "https://versatile.sh",
    lang: "org · site",
    kind: "versatile.sh",
    summary: {
      en: "The organisation behind the engines, built on the side: small independent cores that run on a laptop, your servers or any cloud, and the site that presents them.",
      es: "La organización detrás de los engines, construida como proyecto paralelo: núcleos pequeños e independientes que corren en una laptop, tus servidores o cualquier nube, y el sitio que los presenta.",
      "pt-br": "A organização por trás dos engines, construída como projeto paralelo: núcleos pequenos e independentes que rodam num notebook, nos seus servidores ou em qualquer nuvem, e o site que os apresenta.",
    },
  },
  {
    slug: "omarchy-omakase",
    name: "omarchy-omakase",
    href: "https://github.com/javabetatester/omarchy-omakase",
    lang: "Shell · QML",
    kind: "personal",
    summary: {
      en: "Personal overlay on Omarchy (Arch + Hyprland): Kitty, Neovim/LazyVim, Hyprland user config, a Quickshell bar and Starship, applied by one script without touching the system install.",
      es: "Overlay personal sobre Omarchy (Arch + Hyprland): Kitty, Neovim/LazyVim, config de usuario de Hyprland, una barra en Quickshell y Starship, aplicados por un script sin tocar la instalación del sistema.",
      "pt-br": "Overlay pessoal sobre o Omarchy (Arch + Hyprland): Kitty, Neovim/LazyVim, config de usuário do Hyprland, uma barra em Quickshell e Starship, aplicados por um script sem tocar na instalação do sistema.",
    },
  },
];
