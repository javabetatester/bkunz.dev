import type { Lang } from "../copy";
import type { ProjectDoc } from "./types";

const doc: Partial<Record<Lang, ProjectDoc>> = {
  en: {
    tagline: "One ledger for every Claude Code, Codex and Grok account, key and router, each opened signed in on its own home folder.",
    status: "source-available (GPL-3.0-or-later)",
    facts: [
      { label: "Language", value: "Rust 1.89+" },
      { label: "License", value: "GPL-3.0-or-later" },
      { label: "Binaries", value: "vvault, vvault-app (Tauri tray)" },
      { label: "Platforms", value: "Linux, macOS, Windows" },
    ],
    sections: [
      {
        id: "overview",
        title: "Overview",
        group: "start",
        blocks: [
          { kind: "p", text: "agents-vault keeps a ledger of every Claude Code, Codex and Grok account, API key and router you use. Pick an account and a terminal opens already signed in, on the right model, with your shared instructions in place. A tray icon shows each account's 5-hour and weekly limits." },
          { kind: "p", text: "The problem it removes is credential sharing between accounts. Every account gets its own home folder, so a rotating refresh token only ever exists in one place. It never stores, copies or refreshes an OAuth token: sign-in, refresh and sign-out stay with claude, codex and grok themselves." },
          { kind: "p", text: "It runs on your machine as a Rust workspace: a core library, the vvault command and a Tauri tray app. It is not affiliated with Anthropic, OpenAI or xAI." },
          {
            kind: "table",
            head: ["Crate or path", "Role"],
            rows: [
              ["crates/core", "ledger, launcher, keychain, limits, keep-alive"],
              ["crates/cli", "the vvault command"],
              ["app/src-tauri", "tray app backend"],
              ["app/ui", "tray interface in plain HTML, CSS and JS, no build step"],
            ],
          },
        ],
      },
      {
        id: "bootstrap",
        title: "Install and run",
        group: "start",
        blocks: [
          { kind: "p", text: "Prerequisites: Rust 1.89 or later and, for the tray app, the Tauri 2 system dependencies." },
          {
            kind: "code",
            lang: "sh",
            code: "git clone https://github.com/versatile-sh/agents-vault\ncd agents-vault\ncargo install --path crates/cli\ncargo build --release -p vvault-app --features custom-protocol",
            caption: "put vvault-app next to vvault, or keep vvault on PATH; installers come from cargo tauri build in app/src-tauri",
          },
          { kind: "p", text: "With a fresh ledger, vvault list answers: No accounts yet. Try `vvault add work` or `vvault adopt personal`." },
          {
            kind: "code",
            lang: "sh",
            code: "vvault add work                       # official Claude Code sign-in\nvvault add team --harness codex       # official Codex sign-in\nvvault add x --harness grok           # official Grok sign-in\nvvault adopt personal                 # track your existing ~/.claude in place\nvvault list\nvvault open work                      # new terminal window on that account\nvvault run work -- --resume           # same, in the current terminal\nvvault default work                   # plain `claude` now means the work account",
          },
          {
            kind: "code",
            lang: "sh",
            code: "vvault add router --base-url https://openrouter.ai/api --bearer --model vendor/model\nvvault provider add OpenRouter --preset openrouter --model vendor/model-a\nvvault use OpenRouter --with codex --model vendor/model-b\nvvault kit claude --dir ~/.claude\nvvault keepalive                      # exit code 1 when an account needs a new sign-in\nvvault waybar                         # JSON for a status bar",
          },
          {
            kind: "table",
            head: ["Variable", "Default", "Effect"],
            rows: [["VVAULT_HOME", "the platform data folder", "moves the ledger, to keep experiments away from real accounts"]],
          },
          {
            kind: "code",
            lang: "sh",
            code: "mise run check            # rustfmt, clippy, tests, Semgrep\nmise run test             # cargo test --workspace\nmise run dev -- list      # the CLI against a throwaway ledger in /tmp/vvault-dev",
          },
        ],
      },
      {
        id: "architecture",
        title: "Architecture",
        group: "how",
        blocks: [
          { kind: "scene", id: "agents-vault/architecture", caption: "Tray and CLI share one store, which keeps a private locker per account and starts each harness from its own." },
          { kind: "p", text: "crates/core holds all behavior. The CLI and the Tauri backend are thin front ends over the same Store and functions, so the tray app and vvault always agree." },
          {
            kind: "code",
            lang: "text",
            code: "tray app / vvault CLI\n        |\n        v\n   store::Store  --- ledger.json (labels, models, paths; 0600)\n        |             profiles/<id>/   (one harness home per account)\n        |             limits/ status/ balance/ caches\n        v\n   launch::plan  --- secrets (OS keychain, read last)\n        |\n        v\n   claude | codex | grok   with CLAUDE_CONFIG_DIR / CODEX_HOME / GROK_HOME",
          },
          {
            kind: "list",
            items: [
              "model.rs: Harness (Claude, Codex, Grok), Auth (Login or ApiKey), Account, Config, Provider.",
              "launch.rs: builds the Launch (program, args, env) and scrubs the inherited environment.",
              "limits.rs, status.rs, balance.rs, claude.rs, codex.rs: read limits, session state and balances per harness.",
              "kit.rs: links shared instructions into profiles. machine.rs: the machine-wide default account.",
              "terminal.rs: opens a terminal window that re-enters through vvault run.",
            ],
          },
        ],
      },
      {
        id: "open-flow",
        title: "Opening an account",
        group: "how",
        blocks: [
          { kind: "scene", id: "agents-vault/open-flow", caption: "Identity variables are dropped at a gate and the key leaves the keychain only at launch." },
          {
            kind: "steps",
            items: [
              { title: "Pick", text: "You choose an account in the tray app or run vvault open. The terminal runs vvault run <id>, so the key is resolved inside that process." },
              { title: "Validate", text: "launch::plan calls Account::validate, then ensure_home creates the profile directory private to the user." },
              { title: "Scrub", text: "Inherited variables that override identity are removed: ANTHROPIC_*, CLAUDE_CODE_OAUTH_*, CLAUDE_CODE_USE_*, CLAUDE_CONFIG_DIR, CODEX_HOME, CODEX_API_KEY, CODEX_ACCESS_TOKEN, GROK_HOME, XAI_API_KEY, OPENAI_API_KEY, OPENAI_BASE_URL." },
              { title: "Resolve the key", text: "For an API key account, the key is read from the OS keychain at that moment and passed through the environment only." },
              { title: "Launch", text: "The harness starts with the account's home variable, model arguments and any kit entries linked into the profile." },
            ],
          },
          { kind: "p", text: "Per harness, an API key arrives as ANTHROPIC_API_KEY, or ANTHROPIC_AUTH_TOKEN with --bearer, for Claude; as VVAULT_API_KEY read by a provider defined with -c flags for Codex; and as XAI_API_KEY for Grok. Codex needs an endpoint that speaks the Responses API." },
        ],
      },
      {
        id: "ledger",
        title: "Ledger and store",
        group: "deep",
        blocks: [
          {
            kind: "p",
            text: "store::Store opens VVAULT_HOME or the platform data directory (project dirs sh/versatile/vvault). The root is created mode 0700 and ledger.json is written 0600.",
          },
          {
            kind: "list",
            items: [
              "Store::update takes an exclusive lock on .lock, loads the ledger, applies your closure, validates every account and provider, then writes through write_json.",
              "write_json writes a private temporary file in the same directory, calls sync_all and renames it over ledger.json, so a crash never leaves a half-written ledger.",
              "Account fields: id (UUID), label (1 to 80 chars, no control characters), harness, auth, model, fast_model, home, native_home, env, args, kit.",
              "A managed account's home is profiles/<id>. native_home accounts use the harness's own folder, as adopt does, and are never copied.",
              "Caches live in per-id files such as limits/<id>.json; the id must parse as a UUID, which blocks path tricks.",
              "Labels are unique case-insensitively, checked again inside the locked update.",
            ],
          },
        ],
      },
      {
        id: "limits",
        title: "Limits and keep-alive",
        group: "deep",
        blocks: [
          { kind: "scene", id: "agents-vault/limits", caption: "Usage readings fill a ledger with session and weekly gauges per account, kept fresh by a keep-alive clock." },
          {
            kind: "table",
            head: ["Account", "Source", "Freshness"],
            rows: [
              ["Claude Code sign-in", "Anthropic account endpoints, plus rate_limits that Claude Code sends to its status line", "after sign-in, then at most once a minute"],
              ["Codex sign-in", "the Codex CLI's account/read and account/rateLimits/read requests", "after sign-in, then at most once a minute"],
              ["Grok sign-in", "session state only", "none"],
              ["OpenRouter, DeepSeek keys", "the provider's key or balance request", "at most every two minutes"],
            ],
          },
          {
            kind: "list",
            items: [
              "Limits hold a session and a weekly Window (percent 0 to 100, resets_at). settled zeroes any window whose reset time has passed.",
              "The status line is injected with --settings at launch, so your settings.json is not modified. An existing status line keeps running.",
              "status.rs caches login state and re-checks after 50 minutes; keepalive renews idle accounts by asking each harness for its own status.",
              "On macOS Claude Code keeps its sign-in in the Keychain, so there Claude limits come only from the status line.",
            ],
          },
        ],
      },
      {
        id: "safety",
        title: "Safety model",
        group: "deep",
        blocks: [
          { kind: "scene", id: "agents-vault/safety", caption: "One locker per account, no copying, keys stay in the keychain, and plain http is refused." },
          {
            kind: "table",
            head: ["Rule", "Meaning"],
            rows: [
              ["One home per account", "credentials are never copied between folders"],
              ["The harness owns its tokens", "sign-in, refresh and sign-out are done by the harness"],
              ["Keys in the OS keychain", "macOS Keychain, Windows Credential Manager or Secret Service, under service vvault; never in the ledger, a config file or a command line"],
              ["Keys resolved late", "read inside vvault run and passed by environment"],
              ["Clear text refused", "a custom endpoint must be https://, plain http:// only for localhost, 127.0.0.1 or [::1]"],
              ["No key reuse", "an extra env value that repeats the API key is refused"],
            ],
          },
          { kind: "callout", tone: "warn", text: "One read-only exception: to show Claude limits and the plan name, the access token Claude Code saved is read in memory and sent only to Anthropic's account endpoints (api.anthropic.com/api/oauth/usage and /profile). They are undocumented; if they change, limits fall back to the status line." },
        ],
      },
      {
        id: "decisions",
        title: "Decisions and limits",
        group: "decisions",
        blocks: [
          {
            kind: "table",
            head: ["Decision", "Chosen", "Rejected", "Why"],
            rows: [
              ["Token handling", "never touch OAuth tokens", "copy or refresh them", "a rotating refresh token must live in one place"],
              ["Isolation", "a home folder per account via CLAUDE_CONFIG_DIR, CODEX_HOME, GROK_HOME", "swapping credentials in one folder", "no copies, one session"],
              ["Machine default", "point the harness at the account's home", "copy the account into the default home", "nothing is copied; only login accounts, as a key would sit in every shell"],
              ["Key delivery", "keychain read at launch, environment only", "storing keys in the ledger or flags", "keys stay out of files and command lines"],
              ["Ledger writes", "locked, validated, atomic rename", "plain overwrite", "no half-written or invalid ledger"],
              ["UI", "plain HTML, CSS, JS", "a frontend build", "no build step for the tray app"],
            ],
          },
          {
            kind: "list",
            items: [
              "Grok limits are not reported: the Grok CLI exposes session state only.",
              "Grok accounts use the xAI endpoint; a custom endpoint is refused.",
              "Anthropic's usage and profile endpoints are undocumented and may change.",
              "Terminals already open keep their account until you run eval \"$(vvault env)\" or reopen them.",
              "No measured performance numbers are published for this project.",
            ],
          },
        ],
      },
      {
        id: "files",
        title: "Files to read",
        group: "reference",
        blocks: [
          {
            kind: "files",
            items: [
              { path: "README.md", note: "install, usage, configuration, layout" },
              { path: "docs/usage.md", note: "defaults, providers, kit, limits, models, keep-alive" },
              { path: "docs/safety.md", note: "the safety rules in full" },
              { path: "crates/core/src/model.rs", note: "Harness, Auth, Account and validation" },
              { path: "crates/core/src/store.rs", note: "ledger root, locking, atomic writes" },
              { path: "crates/core/src/launch.rs", note: "environment scrub and per-harness launch plan" },
              { path: "crates/core/src/secrets.rs", note: "keychain access" },
              { path: "crates/core/src/limits.rs", note: "limit windows and probe throttling" },
              { path: "crates/core/src/status.rs", note: "session state and keep-alive" },
              { path: "crates/core/src/machine.rs", note: "machine-wide default account" },
              { path: "crates/cli/src/main.rs", note: "the vvault command surface" },
              { path: "app/src-tauri/src/main.rs", note: "tray app commands" },
            ],
          },
        ],
      },
    ],
  },
  es: {
    tagline: "Un único libro mayor para cada cuenta, clave y router de Claude Code, Codex y Grok, cada uno abierto con la sesión iniciada en su propia carpeta home.",
    status: "código disponible (GPL-3.0-or-later)",
    facts: [
      { label: "Lenguaje", value: "Rust 1.89+" },
      { label: "Licencia", value: "GPL-3.0-or-later" },
      { label: "Binarios", value: "vvault, vvault-app (bandeja Tauri)" },
      { label: "Plataformas", value: "Linux, macOS, Windows" },
    ],
    sections: [
      {
        id: "overview",
        title: "Visión general",
        group: "start",
        blocks: [
          { kind: "p", text: "agents-vault mantiene un libro mayor de cada cuenta, clave de API y router de Claude Code, Codex y Grok que usas. Eliges una cuenta y se abre una terminal con la sesión ya iniciada, en el modelo correcto y con tus instrucciones compartidas en su sitio. Un icono en la bandeja muestra los límites de 5 horas y semanales de cada cuenta." },
          { kind: "p", text: "El problema que elimina es compartir credenciales entre cuentas. Cada cuenta tiene su propia carpeta home, así que un refresh token que rota existe en un solo lugar. Nunca guarda, copia ni renueva un token OAuth: el inicio de sesión, la renovación y el cierre de sesión quedan en manos de claude, codex y grok." },
          { kind: "p", text: "Corre en tu máquina como un workspace de Rust: una librería core, el comando vvault y una app de bandeja Tauri. No está afiliado a Anthropic, OpenAI ni xAI." },
          {
            kind: "table",
            head: ["Crate o ruta", "Función"],
            rows: [
              ["crates/core", "libro mayor, lanzador, llavero, límites, keep-alive"],
              ["crates/cli", "el comando vvault"],
              ["app/src-tauri", "backend de la app de bandeja"],
              ["app/ui", "interfaz de la bandeja en HTML, CSS y JS simples, sin paso de build"],
            ],
          },
        ],
      },
      {
        id: "bootstrap",
        title: "Instalar y ejecutar",
        group: "start",
        blocks: [
          { kind: "p", text: "Requisitos: Rust 1.89 o posterior y, para la app de bandeja, las dependencias de sistema de Tauri 2." },
          {
            kind: "code",
            lang: "sh",
            code: "git clone https://github.com/versatile-sh/agents-vault\ncd agents-vault\ncargo install --path crates/cli\ncargo build --release -p vvault-app --features custom-protocol",
            caption: "pon vvault-app junto a vvault, o deja vvault en el PATH; los instaladores salen de cargo tauri build en app/src-tauri",
          },
          { kind: "p", text: "Con un libro mayor nuevo, vvault list responde: No accounts yet. Try `vvault add work` or `vvault adopt personal`." },
          {
            kind: "code",
            lang: "sh",
            code: "vvault add work                       # official Claude Code sign-in\nvvault add team --harness codex       # official Codex sign-in\nvvault add x --harness grok           # official Grok sign-in\nvvault adopt personal                 # track your existing ~/.claude in place\nvvault list\nvvault open work                      # new terminal window on that account\nvvault run work -- --resume           # same, in the current terminal\nvvault default work                   # plain `claude` now means the work account",
          },
          {
            kind: "code",
            lang: "sh",
            code: "vvault add router --base-url https://openrouter.ai/api --bearer --model vendor/model\nvvault provider add OpenRouter --preset openrouter --model vendor/model-a\nvvault use OpenRouter --with codex --model vendor/model-b\nvvault kit claude --dir ~/.claude\nvvault keepalive                      # exit code 1 when an account needs a new sign-in\nvvault waybar                         # JSON for a status bar",
          },
          {
            kind: "table",
            head: ["Variable", "Por defecto", "Efecto"],
            rows: [["VVAULT_HOME", "la carpeta de datos de la plataforma", "mueve el libro mayor, para mantener los experimentos lejos de las cuentas reales"]],
          },
          {
            kind: "code",
            lang: "sh",
            code: "mise run check            # rustfmt, clippy, tests, Semgrep\nmise run test             # cargo test --workspace\nmise run dev -- list      # the CLI against a throwaway ledger in /tmp/vvault-dev",
          },
        ],
      },
      {
        id: "architecture",
        title: "Arquitectura",
        group: "how",
        blocks: [
          { kind: "scene", id: "agents-vault/architecture", caption: "La bandeja y la CLI comparten un store, que guarda un casillero privado por cuenta y arranca cada harness desde el suyo." },
          { kind: "p", text: "crates/core contiene todo el comportamiento. La CLI y el backend de Tauri son front ends finos sobre el mismo Store y las mismas funciones, así que la app de bandeja y vvault siempre coinciden." },
          {
            kind: "code",
            lang: "text",
            code: "tray app / vvault CLI\n        |\n        v\n   store::Store  --- ledger.json (labels, models, paths; 0600)\n        |             profiles/<id>/   (one harness home per account)\n        |             limits/ status/ balance/ caches\n        v\n   launch::plan  --- secrets (OS keychain, read last)\n        |\n        v\n   claude | codex | grok   with CLAUDE_CONFIG_DIR / CODEX_HOME / GROK_HOME",
          },
          {
            kind: "list",
            items: [
              "model.rs: Harness (Claude, Codex, Grok), Auth (Login o ApiKey), Account, Config, Provider.",
              "launch.rs: construye el Launch (programa, args, env) y limpia el entorno heredado.",
              "limits.rs, status.rs, balance.rs, claude.rs, codex.rs: leen límites, estado de sesión y saldos por harness.",
              "kit.rs: enlaza instrucciones compartidas en los perfiles. machine.rs: la cuenta por defecto de toda la máquina.",
              "terminal.rs: abre una ventana de terminal que reentra mediante vvault run.",
            ],
          },
        ],
      },
      {
        id: "open-flow",
        title: "Abrir una cuenta",
        group: "how",
        blocks: [
          { kind: "scene", id: "agents-vault/open-flow", caption: "Las variables de identidad se descartan en una compuerta y la clave sale del llavero solo en el lanzamiento." },
          {
            kind: "steps",
            items: [
              { title: "Elegir", text: "Eliges una cuenta en la app de bandeja o ejecutas vvault open. La terminal ejecuta vvault run <id>, así que la clave se resuelve dentro de ese proceso." },
              { title: "Validar", text: "launch::plan llama a Account::validate, y luego ensure_home crea el directorio del perfil, privado para el usuario." },
              { title: "Limpiar", text: "Se eliminan las variables heredadas que anulan la identidad: ANTHROPIC_*, CLAUDE_CODE_OAUTH_*, CLAUDE_CODE_USE_*, CLAUDE_CONFIG_DIR, CODEX_HOME, CODEX_API_KEY, CODEX_ACCESS_TOKEN, GROK_HOME, XAI_API_KEY, OPENAI_API_KEY, OPENAI_BASE_URL." },
              { title: "Resolver la clave", text: "En una cuenta con clave de API, la clave se lee del llavero del SO en ese momento y se pasa solo por el entorno." },
              { title: "Lanzar", text: "El harness arranca con la variable home de la cuenta, los argumentos de modelo y las entradas del kit enlazadas en el perfil." },
            ],
          },
          { kind: "p", text: "Por harness, una clave de API llega como ANTHROPIC_API_KEY, o ANTHROPIC_AUTH_TOKEN con --bearer, para Claude; como VVAULT_API_KEY leída por un provider definido con flags -c para Codex; y como XAI_API_KEY para Grok. Codex necesita un endpoint que hable la Responses API." },
        ],
      },
      {
        id: "ledger",
        title: "Libro mayor y store",
        group: "deep",
        blocks: [
          {
            kind: "p",
            text: "store::Store abre VVAULT_HOME o el directorio de datos de la plataforma (project dirs sh/versatile/vvault). La raíz se crea con modo 0700 y ledger.json se escribe con 0600.",
          },
          {
            kind: "list",
            items: [
              "Store::update toma un lock exclusivo sobre .lock, carga el libro mayor, aplica tu closure, valida cada cuenta y provider, y escribe mediante write_json.",
              "write_json escribe un archivo temporal privado en el mismo directorio, llama a sync_all y lo renombra sobre ledger.json, así que un crash nunca deja un libro mayor a medio escribir.",
              "Campos de una cuenta: id (UUID), label (1 a 80 caracteres, sin caracteres de control), harness, auth, model, fast_model, home, native_home, env, args, kit.",
              "El home de una cuenta gestionada es profiles/<id>. Las cuentas native_home usan la carpeta propia del harness, como hace adopt, y nunca se copian.",
              "Las cachés viven en archivos por id como limits/<id>.json; el id debe interpretarse como UUID, lo que bloquea trucos de rutas.",
              "Los labels son únicos sin distinguir mayúsculas, y se comprueba de nuevo dentro del update con lock.",
            ],
          },
        ],
      },
      {
        id: "limits",
        title: "Límites y keep-alive",
        group: "deep",
        blocks: [
          { kind: "scene", id: "agents-vault/limits", caption: "Las lecturas de uso llenan un libro mayor con medidores de sesión y semanales por cuenta, mantenidos al día por un reloj de keep-alive." },
          {
            kind: "table",
            head: ["Cuenta", "Fuente", "Frescura"],
            rows: [
              ["Inicio de sesión de Claude Code", "endpoints de cuenta de Anthropic, más los rate_limits que Claude Code envía a su status line", "tras iniciar sesión, luego como máximo una vez por minuto"],
              ["Inicio de sesión de Codex", "las peticiones account/read y account/rateLimits/read de la CLI de Codex", "tras iniciar sesión, luego como máximo una vez por minuto"],
              ["Inicio de sesión de Grok", "solo estado de sesión", "ninguna"],
              ["Claves de OpenRouter, DeepSeek", "la petición de clave o saldo del provider", "como máximo cada dos minutos"],
            ],
          },
          {
            kind: "list",
            items: [
              "Los límites tienen una Window de sesión y una semanal (percent 0 a 100, resets_at). settled pone a cero cualquier ventana cuya hora de reinicio ya pasó.",
              "La status line se inyecta con --settings en el lanzamiento, así que tu settings.json no se modifica. Una status line existente sigue ejecutándose.",
              "status.rs cachea el estado de login y lo vuelve a comprobar a los 50 minutos; keepalive renueva las cuentas inactivas pidiendo a cada harness su propio estado.",
              "En macOS, Claude Code guarda su sesión en el Keychain, así que allí los límites de Claude vienen solo de la status line.",
            ],
          },
        ],
      },
      {
        id: "safety",
        title: "Modelo de seguridad",
        group: "deep",
        blocks: [
          { kind: "scene", id: "agents-vault/safety", caption: "Un casillero por cuenta, sin copias, las claves se quedan en el llavero y el http plano se rechaza." },
          {
            kind: "table",
            head: ["Regla", "Significado"],
            rows: [
              ["Un home por cuenta", "las credenciales nunca se copian entre carpetas"],
              ["El harness es dueño de sus tokens", "el inicio de sesión, la renovación y el cierre los hace el harness"],
              ["Claves en el llavero del SO", "macOS Keychain, Windows Credential Manager o Secret Service, bajo el servicio vvault; nunca en el libro mayor, un archivo de configuración ni una línea de comandos"],
              ["Claves resueltas al final", "se leen dentro de vvault run y se pasan por entorno"],
              ["Texto claro rechazado", "un endpoint personalizado debe ser https://, http:// plano solo para localhost, 127.0.0.1 o [::1]"],
              ["Sin reutilizar claves", "se rechaza un valor env extra que repita la clave de API"],
            ],
          },
          { kind: "callout", tone: "warn", text: "Una excepción de solo lectura: para mostrar los límites de Claude y el nombre del plan, el access token que guardó Claude Code se lee en memoria y se envía solo a los endpoints de cuenta de Anthropic (api.anthropic.com/api/oauth/usage y /profile). No están documentados; si cambian, los límites recurren a la status line." },
        ],
      },
      {
        id: "decisions",
        title: "Decisiones y límites",
        group: "decisions",
        blocks: [
          {
            kind: "table",
            head: ["Decisión", "Elegido", "Descartado", "Por qué"],
            rows: [
              ["Manejo de tokens", "nunca tocar los tokens OAuth", "copiarlos o renovarlos", "un refresh token que rota debe vivir en un solo lugar"],
              ["Aislamiento", "una carpeta home por cuenta mediante CLAUDE_CONFIG_DIR, CODEX_HOME, GROK_HOME", "cambiar credenciales dentro de una carpeta", "sin copias, una sola sesión"],
              ["Cuenta por defecto de la máquina", "apuntar el harness al home de la cuenta", "copiar la cuenta al home por defecto", "no se copia nada; solo cuentas de login, ya que una clave quedaría en cada shell"],
              ["Entrega de claves", "lectura del llavero en el lanzamiento, solo por entorno", "guardar claves en el libro mayor o en flags", "las claves quedan fuera de archivos y líneas de comandos"],
              ["Escrituras del libro mayor", "con lock, validadas, renombrado atómico", "sobrescritura simple", "ningún libro mayor a medias ni inválido"],
              ["UI", "HTML, CSS, JS simples", "un build de frontend", "sin paso de build para la app de bandeja"],
            ],
          },
          {
            kind: "list",
            items: [
              "Los límites de Grok no se informan: la CLI de Grok solo expone el estado de sesión.",
              "Las cuentas de Grok usan el endpoint de xAI; un endpoint personalizado se rechaza.",
              "Los endpoints de uso y perfil de Anthropic no están documentados y pueden cambiar.",
              "Las terminales ya abiertas conservan su cuenta hasta que ejecutes eval \"$(vvault env)\" o las reabras.",
              "No se publican números de rendimiento medidos para este proyecto.",
            ],
          },
        ],
      },
      {
        id: "files",
        title: "Archivos para leer",
        group: "reference",
        blocks: [
          {
            kind: "files",
            items: [
              { path: "README.md", note: "instalación, uso, configuración, estructura" },
              { path: "docs/usage.md", note: "valores por defecto, providers, kit, límites, modelos, keep-alive" },
              { path: "docs/safety.md", note: "las reglas de seguridad completas" },
              { path: "crates/core/src/model.rs", note: "Harness, Auth, Account y validación" },
              { path: "crates/core/src/store.rs", note: "raíz del libro mayor, locking, escrituras atómicas" },
              { path: "crates/core/src/launch.rs", note: "limpieza del entorno y plan de lanzamiento por harness" },
              { path: "crates/core/src/secrets.rs", note: "acceso al llavero" },
              { path: "crates/core/src/limits.rs", note: "ventanas de límites y throttling de sondeos" },
              { path: "crates/core/src/status.rs", note: "estado de sesión y keep-alive" },
              { path: "crates/core/src/machine.rs", note: "cuenta por defecto de toda la máquina" },
              { path: "crates/cli/src/main.rs", note: "la superficie del comando vvault" },
              { path: "app/src-tauri/src/main.rs", note: "comandos de la app de bandeja" },
            ],
          },
        ],
      },
    ],
  },
  "pt-br": {
    tagline: "Um único livro-razão para cada conta, chave e router do Claude Code, Codex e Grok, cada um aberto já logado na sua própria pasta home.",
    status: "código disponível (GPL-3.0-or-later)",
    facts: [
      { label: "Linguagem", value: "Rust 1.89+" },
      { label: "Licença", value: "GPL-3.0-or-later" },
      { label: "Binários", value: "vvault, vvault-app (bandeja Tauri)" },
      { label: "Plataformas", value: "Linux, macOS, Windows" },
    ],
    sections: [
      {
        id: "overview",
        title: "Visão geral",
        group: "start",
        blocks: [
          { kind: "p", text: "O agents-vault mantém um livro-razão de cada conta, chave de API e router do Claude Code, Codex e Grok que você usa. Escolha uma conta e um terminal abre já logado, no modelo certo, com suas instruções compartilhadas no lugar. Um ícone na bandeja mostra os limites de 5 horas e semanais de cada conta." },
          { kind: "p", text: "O problema que ele elimina é o compartilhamento de credenciais entre contas. Cada conta tem sua própria pasta home, então um refresh token que rotaciona existe em um só lugar. Ele nunca guarda, copia nem renova um token OAuth: login, renovação e logout ficam com o claude, o codex e o grok." },
          { kind: "p", text: "Roda na sua máquina como um workspace Rust: uma biblioteca core, o comando vvault e um app de bandeja Tauri. Não é afiliado à Anthropic, OpenAI nem xAI." },
          {
            kind: "table",
            head: ["Crate ou caminho", "Papel"],
            rows: [
              ["crates/core", "livro-razão, launcher, keychain, limites, keep-alive"],
              ["crates/cli", "o comando vvault"],
              ["app/src-tauri", "backend do app de bandeja"],
              ["app/ui", "interface da bandeja em HTML, CSS e JS puros, sem etapa de build"],
            ],
          },
        ],
      },
      {
        id: "bootstrap",
        title: "Instalar e rodar",
        group: "start",
        blocks: [
          { kind: "p", text: "Pré-requisitos: Rust 1.89 ou superior e, para o app de bandeja, as dependências de sistema do Tauri 2." },
          {
            kind: "code",
            lang: "sh",
            code: "git clone https://github.com/versatile-sh/agents-vault\ncd agents-vault\ncargo install --path crates/cli\ncargo build --release -p vvault-app --features custom-protocol",
            caption: "coloque o vvault-app ao lado do vvault, ou deixe o vvault no PATH; os instaladores vêm de cargo tauri build em app/src-tauri",
          },
          { kind: "p", text: "Com um livro-razão novo, vvault list responde: No accounts yet. Try `vvault add work` or `vvault adopt personal`." },
          {
            kind: "code",
            lang: "sh",
            code: "vvault add work                       # official Claude Code sign-in\nvvault add team --harness codex       # official Codex sign-in\nvvault add x --harness grok           # official Grok sign-in\nvvault adopt personal                 # track your existing ~/.claude in place\nvvault list\nvvault open work                      # new terminal window on that account\nvvault run work -- --resume           # same, in the current terminal\nvvault default work                   # plain `claude` now means the work account",
          },
          {
            kind: "code",
            lang: "sh",
            code: "vvault add router --base-url https://openrouter.ai/api --bearer --model vendor/model\nvvault provider add OpenRouter --preset openrouter --model vendor/model-a\nvvault use OpenRouter --with codex --model vendor/model-b\nvvault kit claude --dir ~/.claude\nvvault keepalive                      # exit code 1 when an account needs a new sign-in\nvvault waybar                         # JSON for a status bar",
          },
          {
            kind: "table",
            head: ["Variável", "Padrão", "Efeito"],
            rows: [["VVAULT_HOME", "a pasta de dados da plataforma", "move o livro-razão, para manter experimentos longe das contas reais"]],
          },
          {
            kind: "code",
            lang: "sh",
            code: "mise run check            # rustfmt, clippy, tests, Semgrep\nmise run test             # cargo test --workspace\nmise run dev -- list      # the CLI against a throwaway ledger in /tmp/vvault-dev",
          },
        ],
      },
      {
        id: "architecture",
        title: "Arquitetura",
        group: "how",
        blocks: [
          { kind: "scene", id: "agents-vault/architecture", caption: "A bandeja e a CLI compartilham um store, que guarda um armário privado por conta e inicia cada harness a partir do seu." },
          { kind: "p", text: "crates/core guarda todo o comportamento. A CLI e o backend do Tauri são front ends finos sobre o mesmo Store e as mesmas funções, então o app de bandeja e o vvault sempre concordam." },
          {
            kind: "code",
            lang: "text",
            code: "tray app / vvault CLI\n        |\n        v\n   store::Store  --- ledger.json (labels, models, paths; 0600)\n        |             profiles/<id>/   (one harness home per account)\n        |             limits/ status/ balance/ caches\n        v\n   launch::plan  --- secrets (OS keychain, read last)\n        |\n        v\n   claude | codex | grok   with CLAUDE_CONFIG_DIR / CODEX_HOME / GROK_HOME",
          },
          {
            kind: "list",
            items: [
              "model.rs: Harness (Claude, Codex, Grok), Auth (Login ou ApiKey), Account, Config, Provider.",
              "launch.rs: monta o Launch (programa, args, env) e limpa o ambiente herdado.",
              "limits.rs, status.rs, balance.rs, claude.rs, codex.rs: leem limites, estado de sessão e saldos por harness.",
              "kit.rs: liga instruções compartilhadas aos perfis. machine.rs: a conta padrão da máquina inteira.",
              "terminal.rs: abre uma janela de terminal que reentra por vvault run.",
            ],
          },
        ],
      },
      {
        id: "open-flow",
        title: "Abrindo uma conta",
        group: "how",
        blocks: [
          { kind: "scene", id: "agents-vault/open-flow", caption: "As variáveis de identidade são descartadas numa comporta e a chave sai do keychain só no lançamento." },
          {
            kind: "steps",
            items: [
              { title: "Escolher", text: "Você escolhe uma conta no app de bandeja ou roda vvault open. O terminal executa vvault run <id>, então a chave é resolvida dentro desse processo." },
              { title: "Validar", text: "launch::plan chama Account::validate, e então ensure_home cria o diretório do perfil, privado para o usuário." },
              { title: "Limpar", text: "As variáveis herdadas que sobrescrevem a identidade são removidas: ANTHROPIC_*, CLAUDE_CODE_OAUTH_*, CLAUDE_CODE_USE_*, CLAUDE_CONFIG_DIR, CODEX_HOME, CODEX_API_KEY, CODEX_ACCESS_TOKEN, GROK_HOME, XAI_API_KEY, OPENAI_API_KEY, OPENAI_BASE_URL." },
              { title: "Resolver a chave", text: "Numa conta com chave de API, a chave é lida do keychain do SO naquele momento e passada apenas pelo ambiente." },
              { title: "Lançar", text: "O harness inicia com a variável home da conta, os argumentos de modelo e as entradas do kit ligadas ao perfil." },
            ],
          },
          { kind: "p", text: "Por harness, uma chave de API chega como ANTHROPIC_API_KEY, ou ANTHROPIC_AUTH_TOKEN com --bearer, para o Claude; como VVAULT_API_KEY lida por um provider definido com flags -c para o Codex; e como XAI_API_KEY para o Grok. O Codex precisa de um endpoint que fale a Responses API." },
        ],
      },
      {
        id: "ledger",
        title: "Livro-razão e store",
        group: "deep",
        blocks: [
          {
            kind: "p",
            text: "store::Store abre VVAULT_HOME ou o diretório de dados da plataforma (project dirs sh/versatile/vvault). A raiz é criada com modo 0700 e ledger.json é escrito com 0600.",
          },
          {
            kind: "list",
            items: [
              "Store::update pega um lock exclusivo em .lock, carrega o livro-razão, aplica sua closure, valida cada conta e provider, e então escreve por write_json.",
              "write_json escreve um arquivo temporário privado no mesmo diretório, chama sync_all e o renomeia sobre ledger.json, então um crash nunca deixa um livro-razão pela metade.",
              "Campos de uma conta: id (UUID), label (1 a 80 caracteres, sem caracteres de controle), harness, auth, model, fast_model, home, native_home, env, args, kit.",
              "O home de uma conta gerenciada é profiles/<id>. Contas native_home usam a pasta do próprio harness, como o adopt faz, e nunca são copiadas.",
              "Os caches ficam em arquivos por id como limits/<id>.json; o id precisa ser um UUID válido, o que bloqueia truques de caminho.",
              "Os labels são únicos sem diferenciar maiúsculas, verificado de novo dentro do update com lock.",
            ],
          },
        ],
      },
      {
        id: "limits",
        title: "Limites e keep-alive",
        group: "deep",
        blocks: [
          { kind: "scene", id: "agents-vault/limits", caption: "As leituras de uso preenchem um livro-razão com medidores de sessão e semanais por conta, mantidos em dia por um relógio de keep-alive." },
          {
            kind: "table",
            head: ["Conta", "Fonte", "Atualidade"],
            rows: [
              ["Login do Claude Code", "endpoints de conta da Anthropic, mais os rate_limits que o Claude Code envia à sua status line", "após o login, depois no máximo uma vez por minuto"],
              ["Login do Codex", "as requisições account/read e account/rateLimits/read da CLI do Codex", "após o login, depois no máximo uma vez por minuto"],
              ["Login do Grok", "só o estado da sessão", "nenhuma"],
              ["Chaves OpenRouter, DeepSeek", "a requisição de chave ou saldo do provider", "no máximo a cada dois minutos"],
            ],
          },
          {
            kind: "list",
            items: [
              "Os limites têm uma Window de sessão e uma semanal (percent 0 a 100, resets_at). settled zera qualquer janela cujo horário de reset já passou.",
              "A status line é injetada com --settings no lançamento, então seu settings.json não é modificado. Uma status line existente continua rodando.",
              "status.rs faz cache do estado de login e rechecagem após 50 minutos; keepalive renova contas ociosas pedindo a cada harness o próprio status.",
              "No macOS o Claude Code guarda o login no Keychain, então lá os limites do Claude vêm só da status line.",
            ],
          },
        ],
      },
      {
        id: "safety",
        title: "Modelo de segurança",
        group: "deep",
        blocks: [
          { kind: "scene", id: "agents-vault/safety", caption: "Um armário por conta, sem cópias, as chaves ficam no keychain e http puro é recusado." },
          {
            kind: "table",
            head: ["Regra", "Significado"],
            rows: [
              ["Um home por conta", "credenciais nunca são copiadas entre pastas"],
              ["O harness é dono dos seus tokens", "login, renovação e logout são feitos pelo harness"],
              ["Chaves no keychain do SO", "macOS Keychain, Windows Credential Manager ou Secret Service, sob o serviço vvault; nunca no livro-razão, num arquivo de configuração ou numa linha de comando"],
              ["Chaves resolvidas no fim", "lidas dentro de vvault run e passadas por ambiente"],
              ["Texto puro recusado", "um endpoint customizado precisa ser https://, http:// puro só para localhost, 127.0.0.1 ou [::1]"],
              ["Sem reuso de chave", "um valor env extra que repita a chave de API é recusado"],
            ],
          },
          { kind: "callout", tone: "warn", text: "Uma exceção somente de leitura: para mostrar os limites do Claude e o nome do plano, o access token que o Claude Code salvou é lido em memória e enviado apenas aos endpoints de conta da Anthropic (api.anthropic.com/api/oauth/usage e /profile). Eles não são documentados; se mudarem, os limites recorrem à status line." },
        ],
      },
      {
        id: "decisions",
        title: "Decisões e limites",
        group: "decisions",
        blocks: [
          {
            kind: "table",
            head: ["Decisão", "Escolhido", "Rejeitado", "Por quê"],
            rows: [
              ["Tratamento de tokens", "nunca tocar nos tokens OAuth", "copiá-los ou renová-los", "um refresh token que rotaciona deve viver em um só lugar"],
              ["Isolamento", "uma pasta home por conta via CLAUDE_CONFIG_DIR, CODEX_HOME, GROK_HOME", "trocar credenciais dentro de uma pasta", "sem cópias, uma sessão"],
              ["Padrão da máquina", "apontar o harness para o home da conta", "copiar a conta para o home padrão", "nada é copiado; só contas de login, já que uma chave ficaria em todo shell"],
              ["Entrega de chaves", "leitura do keychain no lançamento, só por ambiente", "guardar chaves no livro-razão ou em flags", "as chaves ficam fora de arquivos e linhas de comando"],
              ["Escritas do livro-razão", "com lock, validadas, rename atômico", "sobrescrita simples", "nenhum livro-razão pela metade ou inválido"],
              ["UI", "HTML, CSS, JS puros", "um build de frontend", "sem etapa de build para o app de bandeja"],
            ],
          },
          {
            kind: "list",
            items: [
              "Os limites do Grok não são informados: a CLI do Grok só expõe o estado da sessão.",
              "As contas do Grok usam o endpoint da xAI; um endpoint customizado é recusado.",
              "Os endpoints de uso e perfil da Anthropic não são documentados e podem mudar.",
              "Terminais já abertos mantêm sua conta até você rodar eval \"$(vvault env)\" ou reabri-los.",
              "Nenhum número de desempenho medido é publicado para este projeto.",
            ],
          },
        ],
      },
      {
        id: "files",
        title: "Arquivos para ler",
        group: "reference",
        blocks: [
          {
            kind: "files",
            items: [
              { path: "README.md", note: "instalação, uso, configuração, estrutura" },
              { path: "docs/usage.md", note: "padrões, providers, kit, limites, modelos, keep-alive" },
              { path: "docs/safety.md", note: "as regras de segurança completas" },
              { path: "crates/core/src/model.rs", note: "Harness, Auth, Account e validação" },
              { path: "crates/core/src/store.rs", note: "raiz do livro-razão, locking, escritas atômicas" },
              { path: "crates/core/src/launch.rs", note: "limpeza do ambiente e plano de lançamento por harness" },
              { path: "crates/core/src/secrets.rs", note: "acesso ao keychain" },
              { path: "crates/core/src/limits.rs", note: "janelas de limite e throttling de sondagens" },
              { path: "crates/core/src/status.rs", note: "estado da sessão e keep-alive" },
              { path: "crates/core/src/machine.rs", note: "conta padrão da máquina inteira" },
              { path: "crates/cli/src/main.rs", note: "a superfície do comando vvault" },
              { path: "app/src-tauri/src/main.rs", note: "comandos do app de bandeja" },
            ],
          },
        ],
      },
    ],
  },
};

export default doc;
