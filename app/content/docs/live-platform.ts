import type { Lang } from "../copy";
import type { ProjectDoc } from "./types";

const en: ProjectDoc = {
  tagline: "A browser call that shares screen, voice and camera from a link, served by one Go binary with its own WebRTC media server.",
  status: "open source (GPL-3.0-or-later)",
  facts: [
    { label: "Server", value: "Go 1.27.4, Pion SFU, gnet" },
    { label: "Client", value: "React 19, Vite, Tailwind 4" },
    { label: "License", value: "GPL-3.0-or-later" },
    { label: "Deploy unit", value: "one container, no database" },
  ],
  sections: [
    {
      id: "overview",
      title: "Overview",
      group: "start",
      blocks: [
        { kind: "p", text: "live-platform is a browser call for people who need to show something to someone right now: a pair-programming session, a quick look at a screen, a call with a friend who has no account anywhere. The room is the address, and whoever opens a free name owns that room. No account, nothing to install." },
        { kind: "p", text: "One Go process serves the page, the signalling and its own selective forwarding unit (SFU) built on Pion. Media is not routed through a hosted service and does not use a peer-to-peer mesh, where each person would upload one copy per listener." },
        { kind: "p", text: "It is deliberately narrow. It is not a recording or transcription product, and it has no end-to-end encryption yet. The security section lists what is and is not built." },
        {
          kind: "table",
          head: ["Fact", "Value"],
          rows: [
            ["Room size", "Up to 10 people"],
            ["Room release", "30 seconds after the last person leaves"],
            ["Access", "Public (link) or private (room code); either can be listed in the lobby"],
            ["Media", "Microphone, camera, screen with its sound, push to talk, background blur"],
            ["Extras", "Chat, raised hand, Excalidraw whiteboard, owner controls"],
            ["Languages", "English and Portuguese, from the browser"],
          ],
        },
      ],
    },
    {
      id: "bootstrap",
      title: "Run it",
      group: "start",
      blocks: [
        { kind: "p", text: "Needs Go 1.27.4, Node.js 26 and a browser with WebRTC. Two terminals; the Vite dev server proxies /api to 127.0.0.1:8080 and /ws to 127.0.0.1:8081." },
        {
          kind: "code",
          lang: "sh",
          code: "cd server\nPUBLIC_ORIGIN=http://localhost:5173 go run ./cmd/live\n\ncd web\nnpm ci\nnpm run dev        # http://localhost:5173",
          caption: "Development",
        },
        { kind: "p", text: "Open http://localhost:5173/any-name in two tabs to try a call. To serve everything from one binary:" },
        {
          kind: "code",
          lang: "sh",
          code: "cd web && npm ci && npm run build\ncd ../server && CGO_ENABLED=0 go build -trimpath -o live ./cmd/live\nWEB_DIR=../web/dist ./live        # page and API on :8080; GET /up answers 200",
          caption: "Single binary",
        },
        { kind: "p", text: "Without WEB_DIR the server answers the API only. The page and the signalling use different ports, so in front of a browser both must sit behind one origin. The Dockerfile builds a static binary on distroless, non-root, with PORT=3000, SIGNAL_PORT=3001 and WEB_DIR=/web." },
        {
          kind: "code",
          lang: "sh",
          code: "mise install        # pinned Go, golangci-lint, vlint, revive\nlefthook install    # fast lint on commit, changed-package lint on push\nmise run check      # lint-full, race tests, Semgrep\nmise run test       # go test -race -count=1 ./...\ncd web && npx vitest run\ncd web && npm run test:live   # client against a real server",
          caption: "Checks",
        },
        {
          kind: "table",
          head: ["Variable", "Default", "Effect"],
          rows: [
            ["PORT", "8080 (3000 in the image)", "HTTP: page, API and /up"],
            ["SIGNAL_PORT", "8081 (3001 in the image)", "Signalling WebSocket at /ws"],
            ["PUBLIC_ORIGIN", "empty", "Origins allowed to open the socket; empty allows only the request's own host"],
            ["WEB_DIR", "empty (/web in the image)", "Built client; empty serves the API only"],
            ["WEB_LIVE_DIR", "empty", "Directory laid over WEB_DIR so a newer client can be served without a restart"],
            ["MEDIA", "on", "off runs presence and chat without the SFU"],
            ["MEDIA_UDP_PORT", "0", "One shared UDP port for all media; 0 lets each connection pick its own"],
            ["MEDIA_PUBLIC_IP", "empty", "Address announced to browsers behind NAT"],
            ["HANDOVER_DIR", "empty", "Directory shared with the next process for planned restarts"],
            ["AUDIT_DIR", "empty", "Audit trail directory; empty turns it off"],
            ["AUDIT_RETENTION_DAYS", "183", "Days of audit files kept"],
            ["OTEL_EXPORTER_OTLP_ENDPOINT", "empty", "OTLP/HTTP collector; empty turns tracing off"],
          ],
        },
        { kind: "callout", tone: "note", text: "Everything is read from the environment once, at start. A value that cannot be parsed stops the server and names the setting." },
      ],
    },
    {
      id: "architecture",
      title: "Architecture",
      group: "how",
      blocks: [
        { kind: "p", text: "One binary, three listeners. HTTP serves the built client and a small JSON API. A gnet event loop carries the lv.1 WebSocket. Pion carries media over UDP with DTLS-SRTP, straight between browser and server." },
        {
          kind: "code",
          lang: "text",
          code: "Browser (React 19)                     live (one Go process)\n+----------------------+  HTTPS        +---------------------------+\n| pages and stores     |-------------->| net/http   page, /api     |\n|                      |  WSS /ws      +---------------------------+\n|                      |-------------->| gnet + gobwas/ws  lv.1    |\n|                      |               |        |                  |\n|                      |               |  presence hub             |\n|                      |               |  one actor per room       |\n|                      |               |        |                  |\n| publish PeerConn     |  UDP, DTLS    |  Pion SFU                 |\n| subscribe PeerConn   |<=============>|                           |\n+----------------------+  SRTP         +---------------------------+",
        },
        {
          kind: "table",
          head: ["Listener", "Library", "Carries"],
          rows: [
            ["HTTP (PORT)", "net/http", "client, GET /api/rooms/{slug}, /api/lobby, /api/project, /api/pass/{id}, /up"],
            ["Signalling (SIGNAL_PORT)", "gnet + gobwas/ws", "lv.1: presence, chat, whiteboard, owner actions, SDP and ICE"],
            ["Media (MEDIA_UDP_PORT)", "Pion WebRTC", "RTP over DTLS-SRTP"],
          ],
        },
        { kind: "p", text: "The server follows ports and adapters, with dependencies pointing inward." },
        {
          kind: "code",
          lang: "text",
          code: "server/\n  cmd/live/            binary; `live audit` reads the audit trail\n  app/                 composition root: env read and checked once\n  core/room/           Room aggregate. Pure: no clock, no I/O\n  port/inbound|outbound/\n  service/presence/    hub + one goroutine per room\n  signal/              lv.1 over WebSocket on gnet\n  httpapi/  page/      JSON routes; client with security headers\n  sfu/                 Pion media engine\n  handoff/  audit/  guestpass/  clientinfo/  github/",
        },
        { kind: "p", text: "The client lives in web/src, one folder per concern: room, media, signal, session, lobby, board, domain, ui, i18n. It uses no router and no state library; three pages and one store per concern do not need them." },
      ],
    },
    {
      id: "join-flow",
      title: "Join flow",
      group: "how",
      blocks: [
        { kind: "scene", id: "live-platform/join", caption: "A link is a ticket: the guest walks through the door, the room claims a seat, and everyone inside is told." },
        {
          kind: "steps",
          items: [
            { title: "Open the socket", text: "The browser opens the lv.1 WebSocket and sends join. The socket accepts only the configured origins." },
            { title: "Claim a seat", text: "The signalling server hands the frame to the presence hub. The room's actor claims a seat." },
            { title: "Receive state", text: "The browser gets joined with its seat, generation and resume secret, then the whole roster with a version number." },
            { title: "Negotiate publish", text: "The browser sends its SDP offer over the same socket in an rtc frame. The hub negotiates the publish connection with the SFU." },
            { title: "Send media", text: "Media goes straight to the SFU over UDP. The SFU forwards packets, undecoded, to everyone else." },
            { title: "Broadcast changes", text: "Each change in the room sends everyone a new whole roster." },
          ],
        },
        { kind: "p", text: "Each participant keeps two peer connections: one publishes, one receives everyone else. Forwarded tracks are named by who sent them and what they are (microphone, camera, screen, screen sound), from the sources the publisher declared." },
      ],
    },
    {
      id: "presence",
      title: "Presence",
      group: "how",
      blocks: [
        { kind: "scene", id: "live-platform/presence", caption: "The roster is the server's: a quiet guest turns unstable, a reloading guest keeps a held seat, and a timer decides who is removed." },
        { kind: "p", text: "The server is the only authority on who is in a room. Browsers only report. It watches three signals: the socket, a heartbeat and the media path." },
        {
          kind: "steps",
          items: [
            { title: "First missed signal", text: "Others see the participant as unstable." },
            { title: "After a 4 second grace", text: "The participant shows as reconnecting." },
            { title: "No return", text: "The participant is removed. Leaving on purpose is immediate." },
          ],
        },
        { kind: "p", text: "A reload keeps the seat. The browser holds a per-room secret for the tab's lifetime and presents it to resume. The secret rotates on every resume and the old one is refused." },
        { kind: "p", text: "On a planned restart the stopping server can write its rooms to HANDOVER_DIR. The new process adopts them and holds each seat for 12 seconds while browsers reconnect. A crash loses the rooms." },
      ],
    },
    {
      id: "room-model",
      title: "Room model",
      group: "deep",
      blocks: [
        { kind: "p", text: "Every change to a room goes through its actor, in order, so there are no locks around room state. The Room aggregate in core/room is told the time and answers with what changed. It has no clock and no I/O, so every presence rule is a plain unit test." },
        {
          kind: "list",
          items: [
            "Seats are a uint64 bitmap.",
            "What a participant has on (microphone, camera, screen, screen audio, hand, owner, unstable) is a uint16 of flags.",
            "Rosters are sent whole, with a version number, never as a diff. A browser that missed a message is right again at the next one.",
            "Each room publishes an atomic summary, so listing the lobby never blocks on a room's goroutine.",
          ],
        },
        { kind: "p", text: "Room code derivation in private rooms is covered under Security. The room aggregate keeps the owner rules: transfer, remove, ban, mute all, speak by raised hand, access and listing changes." },
      ],
    },
    {
      id: "protocol",
      title: "Protocol lv.1",
      group: "deep",
      blocks: [
        { kind: "p", text: "JSON text frames over one WebSocket, each with its type in t." },
        {
          kind: "table",
          head: ["Direction", "Frames"],
          rows: [
            ["Browser to server", "join, resume, hb, leave, media, rtc, look, photo, chat, board, owner, remove, ban, transfer, listed, password"],
            ["Server to browser", "joined, roster (versioned, whole), rtc, chat, photo, board, error"],
          ],
        },
        { kind: "p", text: "Application close codes tell the browser why a socket ended." },
        {
          kind: "table",
          head: ["Code", "Meaning"],
          rows: [
            ["4001", "Superseded by another tab"],
            ["4012", "Server restarting"],
            ["4400", "Bad frame"],
            ["4401", "No hello"],
            ["4403", "Removed"],
            ["4404", "Banned"],
            ["4408", "Silent"],
            ["4409", "Too slow to read"],
            ["4429", "Flooding"],
          ],
        },
        { kind: "p", text: "Signalling limits: 128 KiB per frame, 2 MiB of unsent data, 20 frames per second with a burst of 80. A client past them is disconnected with a code that says why." },
      ],
    },
    {
      id: "media-path",
      title: "Media path",
      group: "deep",
      blocks: [
        { kind: "scene", id: "live-platform/forward", caption: "The SFU is a post office: each track a guest sends is forwarded, unopened, to every other guest." },
        {
          kind: "list",
          items: [
            "The SFU forwards RTP without decoding it.",
            "Codecs are Pion's defaults. The server asks publishers for a keyframe every 2 seconds so late joiners get a picture quickly.",
            "No simulcast and no forwarding on demand: every stream goes to everyone at the quality it was sent.",
            "Audio processing runs in the browser only: RNNoise for the strongest voice filter, plus gain, a noise gate and echo cancellation. Background blur runs MediaPipe in the browser.",
            "One UDP port for all media when MEDIA_UDP_PORT is set, announced at MEDIA_PUBLIC_IP.",
            "There is no TURN relay, so a network that blocks UDP cannot carry media.",
          ],
        },
        { kind: "p", text: "Because every stream is forwarded to every other participant, the server's upload grows with the square of a room's size. The room cap of 10 bounds it." },
        { kind: "p", text: "The whiteboard is Excalidraw, pinned and loaded only when opened. It lives in the browsers; the server relays its pieces without reading them and keeps nothing." },
      ],
    },
    {
      id: "security",
      title: "Security model",
      group: "deep",
      blocks: [
        { kind: "p", text: "In a private room the browser derives 64 bytes from the room code with PBKDF2-SHA-256 at 600,000 iterations, salted with the room's address. The first 32 bytes are a verifier sent to the server, which stores only its SHA-256. The other 32 are reserved as a media key and never leave the browser. A shared link carries the code after #, which browsers do not send. Ten wrong attempts lock the door for five minutes." },
        {
          kind: "list",
          items: [
            "CSP: default-src 'none', own-origin scripts, styles, fonts and connections, no inline script or style. 'wasm-unsafe-eval' is allowed for the voice filter and blur.",
            "Supply chain: exact versions, committed lockfiles, npm install scripts disabled, base images and CI actions pinned by digest, Dependabot, govulncheck, go mod verify, npm audit, and a CycloneDX SBOM for server and client.",
            "Image: distroless, static, non-root.",
            "Audit: without AUDIT_DIR the server records nothing. With it, one JSON line per fact goes to a daily file, deleted after AUDIT_RETENTION_DAYS. A public room's chat text is recorded; a private room's chat keeps who, when and length only.",
            "Tracing spans carry the room name and flags, never an address, a name or chat text.",
          ],
        },
        { kind: "callout", tone: "warn", text: "No end-to-end encryption. Media is encrypted between each browser and the server (DTLS-SRTP) and the server could read it. Chat, private messages and the whiteboard pass through the server in clear." },
      ],
    },
    {
      id: "decisions",
      title: "Decisions",
      group: "decisions",
      blocks: [
        {
          kind: "table",
          head: ["Decision", "Chosen", "Rejected", "Why"],
          rows: [
            ["Media topology", "Own SFU on Pion for every room", "Mesh; hosted SFU", "A mesh costs each person one upload per listener; a hosted SFU puts media on someone else's server."],
            ["Signalling", "gnet event loop", "Plain net/http WebSocket", "Holds many idle sockets cheaply. It carries signalling only."],
            ["Page and API", "net/http", "A framework", "Nothing here needs more."],
            ["Client state", "No router, no state library", "Router and global store", "Three pages and one store per concern do not need them."],
            ["Room state", "One actor per room", "Shared state with locks", "Ordered changes, pure aggregate, simple unit tests."],
            ["Roster sync", "Whole roster, versioned", "Diffs", "A missed message heals at the next one."],
          ],
        },
        {
          kind: "list",
          items: [
            "No end-to-end encryption yet; the derived media key is reserved for it.",
            "No TURN relay: networks that block UDP get no media.",
            "No simulcast or forwarding on demand: hidden streams still reach the client.",
            "Rooms survive a planned handover only, not a crash.",
            "Not built: recording, transcription, extensions.",
          ],
        },
      ],
    },
    {
      id: "files",
      title: "Files",
      group: "reference",
      blocks: [
        {
          kind: "files",
          items: [
            { path: "README.md", note: "Overview, install, usage, configuration summary" },
            { path: "docs/architecture.md", note: "Components, server layout, lv.1, presence, media" },
            { path: "docs/security.md", note: "Room codes, hardening, what is not built, privacy" },
            { path: "docs/configuration.md", note: "Every environment variable and the audit CLI" },
            { path: "docs/self-hosting.md", note: "Proxy, UDP, handover, sizing" },
            { path: "server/cmd/live/main.go", note: "The binary entry point" },
            { path: "server/app/config.go", note: "Environment parsing and validation" },
            { path: "server/core/room/room.go", note: "The Room aggregate" },
            { path: "server/service/presence/hub.go", note: "The presence hub" },
            { path: "server/service/presence/actor.go", note: "One goroutine per room" },
            { path: "server/sfu", note: "The Pion media engine" },
            { path: "server/signal", note: "lv.1 frames, close codes, rate limits" },
            { path: "web/DESIGN.md", note: "Client design rules" },
            { path: "mise.toml", note: "Pinned toolchain and the lint, test and check tasks" },
          ],
        },
      ],
    },
  ],
};

const es: ProjectDoc = {
  tagline: "Una llamada en el navegador que comparte pantalla, voz y cámara desde un enlace, servida por un único binario Go con su propio servidor de medios WebRTC.",
  status: "código abierto (GPL-3.0-or-later)",
  facts: [
    { label: "Servidor", value: "Go 1.27.4, Pion SFU, gnet" },
    { label: "Cliente", value: "React 19, Vite, Tailwind 4" },
    { label: "Licencia", value: "GPL-3.0-or-later" },
    { label: "Unidad de despliegue", value: "un contenedor, sin base de datos" },
  ],
  sections: [
    {
      id: "overview",
      title: "Visión general",
      group: "start",
      blocks: [
        { kind: "p", text: "live-platform es una llamada en el navegador para quien necesita mostrarle algo a alguien ahora mismo: una sesión de pair programming, un vistazo rápido a una pantalla, una llamada con un amigo que no tiene cuenta en ningún sitio. La sala es la dirección, y quien abre un nombre libre es el dueño de esa sala. Sin cuenta, nada que instalar." },
        { kind: "p", text: "Un proceso Go sirve la página, la señalización y su propia unidad de reenvío selectivo (SFU) construida sobre Pion. Los medios no pasan por un servicio alojado ni usan una malla peer-to-peer, donde cada persona subiría una copia por oyente." },
        { kind: "p", text: "Es deliberadamente acotado. No es un producto de grabación ni de transcripción, y todavía no tiene cifrado de extremo a extremo. La sección de seguridad lista lo que está construido y lo que no." },
        {
          kind: "table",
          head: ["Dato", "Valor"],
          rows: [
            ["Tamaño de la sala", "Hasta 10 personas"],
            ["Liberación de la sala", "30 segundos después de que salga la última persona"],
            ["Acceso", "Pública (enlace) o privada (código de sala); cualquiera puede aparecer en el lobby"],
            ["Medios", "Micrófono, cámara, pantalla con su sonido, push to talk, desenfoque de fondo"],
            ["Extras", "Chat, mano levantada, pizarra Excalidraw, controles del dueño"],
            ["Idiomas", "Inglés y portugués, según el navegador"],
          ],
        },
      ],
    },
    {
      id: "bootstrap",
      title: "Ejecutarlo",
      group: "start",
      blocks: [
        { kind: "p", text: "Requiere Go 1.27.4, Node.js 26 y un navegador con WebRTC. Dos terminales; el servidor de desarrollo de Vite hace proxy de /api a 127.0.0.1:8080 y de /ws a 127.0.0.1:8081." },
        {
          kind: "code",
          lang: "sh",
          code: "cd server\nPUBLIC_ORIGIN=http://localhost:5173 go run ./cmd/live\n\ncd web\nnpm ci\nnpm run dev        # http://localhost:5173",
          caption: "Desarrollo",
        },
        { kind: "p", text: "Abre http://localhost:5173/any-name en dos pestañas para probar una llamada. Para servir todo desde un único binario:" },
        {
          kind: "code",
          lang: "sh",
          code: "cd web && npm ci && npm run build\ncd ../server && CGO_ENABLED=0 go build -trimpath -o live ./cmd/live\nWEB_DIR=../web/dist ./live        # page and API on :8080; GET /up answers 200",
          caption: "Binario único",
        },
        { kind: "p", text: "Sin WEB_DIR el servidor responde solo la API. La página y la señalización usan puertos distintos, así que frente a un navegador ambos deben quedar detrás de un único origen. El Dockerfile construye un binario estático sobre distroless, sin root, con PORT=3000, SIGNAL_PORT=3001 y WEB_DIR=/web." },
        {
          kind: "code",
          lang: "sh",
          code: "mise install        # pinned Go, golangci-lint, vlint, revive\nlefthook install    # fast lint on commit, changed-package lint on push\nmise run check      # lint-full, race tests, Semgrep\nmise run test       # go test -race -count=1 ./...\ncd web && npx vitest run\ncd web && npm run test:live   # client against a real server",
          caption: "Comprobaciones",
        },
        {
          kind: "table",
          head: ["Variable", "Por defecto", "Efecto"],
          rows: [
            ["PORT", "8080 (3000 en la imagen)", "HTTP: página, API y /up"],
            ["SIGNAL_PORT", "8081 (3001 en la imagen)", "WebSocket de señalización en /ws"],
            ["PUBLIC_ORIGIN", "vacío", "Orígenes autorizados a abrir el socket; vacío permite solo el host de la propia petición"],
            ["WEB_DIR", "vacío (/web en la imagen)", "Cliente compilado; vacío sirve solo la API"],
            ["WEB_LIVE_DIR", "vacío", "Directorio superpuesto a WEB_DIR para servir un cliente más nuevo sin reiniciar"],
            ["MEDIA", "on", "off ejecuta presencia y chat sin el SFU"],
            ["MEDIA_UDP_PORT", "0", "Un puerto UDP compartido para todos los medios; 0 deja que cada conexión elija el suyo"],
            ["MEDIA_PUBLIC_IP", "vacío", "Dirección anunciada a los navegadores detrás de NAT"],
            ["HANDOVER_DIR", "vacío", "Directorio compartido con el siguiente proceso en reinicios planificados"],
            ["AUDIT_DIR", "vacío", "Directorio del registro de auditoría; vacío lo desactiva"],
            ["AUDIT_RETENTION_DAYS", "183", "Días de archivos de auditoría que se conservan"],
            ["OTEL_EXPORTER_OTLP_ENDPOINT", "vacío", "Colector OTLP/HTTP; vacío desactiva el tracing"],
          ],
        },
        { kind: "callout", tone: "note", text: "Todo se lee del entorno una sola vez, al arrancar. Un valor que no se puede interpretar detiene el servidor y nombra el ajuste." },
      ],
    },
    {
      id: "architecture",
      title: "Arquitectura",
      group: "how",
      blocks: [
        { kind: "p", text: "Un binario, tres listeners. HTTP sirve el cliente compilado y una pequeña API JSON. Un event loop de gnet transporta el WebSocket lv.1. Pion transporta los medios por UDP con DTLS-SRTP, directamente entre navegador y servidor." },
        {
          kind: "code",
          lang: "text",
          code: "Browser (React 19)                     live (one Go process)\n+----------------------+  HTTPS        +---------------------------+\n| pages and stores     |-------------->| net/http   page, /api     |\n|                      |  WSS /ws      +---------------------------+\n|                      |-------------->| gnet + gobwas/ws  lv.1    |\n|                      |               |        |                  |\n|                      |               |  presence hub             |\n|                      |               |  one actor per room       |\n|                      |               |        |                  |\n| publish PeerConn     |  UDP, DTLS    |  Pion SFU                 |\n| subscribe PeerConn   |<=============>|                           |\n+----------------------+  SRTP         +---------------------------+",
        },
        {
          kind: "table",
          head: ["Listener", "Biblioteca", "Transporta"],
          rows: [
            ["HTTP (PORT)", "net/http", "cliente, GET /api/rooms/{slug}, /api/lobby, /api/project, /api/pass/{id}, /up"],
            ["Señalización (SIGNAL_PORT)", "gnet + gobwas/ws", "lv.1: presencia, chat, pizarra, acciones del dueño, SDP e ICE"],
            ["Medios (MEDIA_UDP_PORT)", "Pion WebRTC", "RTP sobre DTLS-SRTP"],
          ],
        },
        { kind: "p", text: "El servidor sigue puertos y adaptadores, con las dependencias apuntando hacia dentro." },
        {
          kind: "code",
          lang: "text",
          code: "server/\n  cmd/live/            binary; `live audit` reads the audit trail\n  app/                 composition root: env read and checked once\n  core/room/           Room aggregate. Pure: no clock, no I/O\n  port/inbound|outbound/\n  service/presence/    hub + one goroutine per room\n  signal/              lv.1 over WebSocket on gnet\n  httpapi/  page/      JSON routes; client with security headers\n  sfu/                 Pion media engine\n  handoff/  audit/  guestpass/  clientinfo/  github/",
        },
        { kind: "p", text: "El cliente vive en web/src, una carpeta por responsabilidad: room, media, signal, session, lobby, board, domain, ui, i18n. No usa router ni librería de estado; tres páginas y un store por responsabilidad no los necesitan." },
      ],
    },
    {
      id: "join-flow",
      title: "Flujo de entrada",
      group: "how",
      blocks: [
        { kind: "scene", id: "live-platform/join", caption: "Un enlace es una entrada: el invitado cruza la puerta, la sala le asigna un asiento y todos los de dentro se enteran." },
        {
          kind: "steps",
          items: [
            { title: "Abrir el socket", text: "El navegador abre el WebSocket lv.1 y envía join. El socket acepta solo los orígenes configurados." },
            { title: "Reclamar un asiento", text: "El servidor de señalización pasa el frame al hub de presencia. El actor de la sala reclama un asiento." },
            { title: "Recibir el estado", text: "El navegador recibe joined con su asiento, generación y secreto de reanudación, y después todo el roster con un número de versión." },
            { title: "Negociar la publicación", text: "El navegador envía su SDP offer por el mismo socket en un frame rtc. El hub negocia con el SFU la conexión de publicación." },
            { title: "Enviar medios", text: "Los medios van directo al SFU por UDP. El SFU reenvía los paquetes, sin decodificar, a todos los demás." },
            { title: "Difundir cambios", text: "Cada cambio en la sala envía a todos un roster completo nuevo." },
          ],
        },
        { kind: "p", text: "Cada participante mantiene dos conexiones peer: una publica, otra recibe a todos los demás. Los tracks reenviados se nombran por quién los envió y qué son (micrófono, cámara, pantalla, sonido de pantalla), según las fuentes que declaró el publicador." },
      ],
    },
    {
      id: "presence",
      title: "Presencia",
      group: "how",
      blocks: [
        { kind: "scene", id: "live-platform/presence", caption: "El roster es del servidor: un invitado callado pasa a inestable, uno que recarga conserva su asiento retenido y un temporizador decide a quién se retira." },
        { kind: "p", text: "El servidor es la única autoridad sobre quién está en una sala. Los navegadores solo informan. Vigila tres señales: el socket, un heartbeat y la ruta de medios." },
        {
          kind: "steps",
          items: [
            { title: "Primera señal perdida", text: "Los demás ven al participante como inestable." },
            { title: "Tras 4 segundos de gracia", text: "El participante aparece como reconectando." },
            { title: "Sin regreso", text: "Se retira al participante. Salir a propósito es inmediato." },
          ],
        },
        { kind: "p", text: "Recargar conserva el asiento. El navegador guarda un secreto por sala durante la vida de la pestaña y lo presenta para reanudar. El secreto rota en cada reanudación y el anterior se rechaza." },
        { kind: "p", text: "En un reinicio planificado, el servidor que se detiene puede escribir sus salas en HANDOVER_DIR. El nuevo proceso las adopta y retiene cada asiento 12 segundos mientras los navegadores se reconectan. Un crash pierde las salas." },
      ],
    },
    {
      id: "room-model",
      title: "Modelo de sala",
      group: "deep",
      blocks: [
        { kind: "p", text: "Todo cambio en una sala pasa por su actor, en orden, así que no hay locks alrededor del estado de la sala. Al agregado Room de core/room se le da la hora y responde con lo que cambió. No tiene reloj ni I/O, así que cada regla de presencia es un test unitario simple." },
        {
          kind: "list",
          items: [
            "Los asientos son un bitmap uint64.",
            "Lo que un participante tiene activo (micrófono, cámara, pantalla, audio de pantalla, mano, dueño, inestable) es un uint16 de flags.",
            "Los rosters se envían completos, con número de versión, nunca como diff. Un navegador que perdió un mensaje queda al día en el siguiente.",
            "Cada sala publica un resumen atómico, así que listar el lobby nunca bloquea sobre la goroutine de una sala.",
          ],
        },
        { kind: "p", text: "La derivación del código de sala en salas privadas se trata en Seguridad. El agregado de sala guarda las reglas del dueño: transferir, expulsar, banear, silenciar a todos, hablar por mano levantada, cambios de acceso y de listado." },
      ],
    },
    {
      id: "protocol",
      title: "Protocolo lv.1",
      group: "deep",
      blocks: [
        { kind: "p", text: "Frames de texto JSON sobre un WebSocket, cada uno con su tipo en t." },
        {
          kind: "table",
          head: ["Dirección", "Frames"],
          rows: [
            ["Navegador a servidor", "join, resume, hb, leave, media, rtc, look, photo, chat, board, owner, remove, ban, transfer, listed, password"],
            ["Servidor a navegador", "joined, roster (versionado, completo), rtc, chat, photo, board, error"],
          ],
        },
        { kind: "p", text: "Los códigos de cierre de la aplicación le dicen al navegador por qué terminó un socket." },
        {
          kind: "table",
          head: ["Código", "Significado"],
          rows: [
            ["4001", "Reemplazado por otra pestaña"],
            ["4012", "Servidor reiniciando"],
            ["4400", "Frame inválido"],
            ["4401", "Sin hello"],
            ["4403", "Expulsado"],
            ["4404", "Baneado"],
            ["4408", "Silencioso"],
            ["4409", "Demasiado lento para leer"],
            ["4429", "Inundación"],
          ],
        },
        { kind: "p", text: "Límites de señalización: 128 KiB por frame, 2 MiB de datos sin enviar, 20 frames por segundo con una ráfaga de 80. Un cliente que los supera se desconecta con un código que dice por qué." },
      ],
    },
    {
      id: "media-path",
      title: "Ruta de medios",
      group: "deep",
      blocks: [
        { kind: "scene", id: "live-platform/forward", caption: "El SFU es una oficina de correos: cada track que envía un invitado se reenvía, sin abrir, a todos los demás." },
        {
          kind: "list",
          items: [
            "El SFU reenvía RTP sin decodificarlo.",
            "Los códecs son los por defecto de Pion. El servidor pide a los publicadores un keyframe cada 2 segundos para que quien entra tarde vea imagen rápido.",
            "Sin simulcast ni reenvío bajo demanda: cada stream llega a todos con la calidad con que se envió.",
            "El procesamiento de audio corre solo en el navegador: RNNoise para el filtro de voz más fuerte, más ganancia, una noise gate y cancelación de eco. El desenfoque de fondo ejecuta MediaPipe en el navegador.",
            "Un puerto UDP para todos los medios cuando MEDIA_UDP_PORT está definido, anunciado en MEDIA_PUBLIC_IP.",
            "No hay relay TURN, así que una red que bloquea UDP no puede transportar medios.",
          ],
        },
        { kind: "p", text: "Como cada stream se reenvía a todos los demás participantes, el upload del servidor crece con el cuadrado del tamaño de la sala. El tope de 10 por sala lo acota." },
        { kind: "p", text: "La pizarra es Excalidraw, fijada en una versión y cargada solo al abrirla. Vive en los navegadores; el servidor retransmite sus piezas sin leerlas y no guarda nada." },
      ],
    },
    {
      id: "security",
      title: "Modelo de seguridad",
      group: "deep",
      blocks: [
        { kind: "p", text: "En una sala privada el navegador deriva 64 bytes del código de sala con PBKDF2-SHA-256 a 600.000 iteraciones, con la dirección de la sala como sal. Los primeros 32 bytes son un verificador enviado al servidor, que guarda solo su SHA-256. Los otros 32 quedan reservados como clave de medios y nunca salen del navegador. Un enlace compartido lleva el código tras #, que los navegadores no envían. Diez intentos erróneos bloquean la puerta durante cinco minutos." },
        {
          kind: "list",
          items: [
            "CSP: default-src 'none', scripts, estilos, fuentes y conexiones del propio origen, sin script ni estilo inline. 'wasm-unsafe-eval' se permite para el filtro de voz y el desenfoque.",
            "Cadena de suministro: versiones exactas, lockfiles versionados, scripts de instalación de npm desactivados, imágenes base y acciones de CI fijadas por digest, Dependabot, govulncheck, go mod verify, npm audit y un SBOM CycloneDX para servidor y cliente.",
            "Imagen: distroless, estática, sin root.",
            "Auditoría: sin AUDIT_DIR el servidor no registra nada. Con él, una línea JSON por hecho va a un archivo diario, borrado tras AUDIT_RETENTION_DAYS. El texto del chat de una sala pública se registra; el chat de una sala privada guarda solo quién, cuándo y longitud.",
            "Los spans de tracing llevan el nombre de la sala y flags, nunca una dirección, un nombre ni texto de chat.",
          ],
        },
        { kind: "callout", tone: "warn", text: "Sin cifrado de extremo a extremo. Los medios se cifran entre cada navegador y el servidor (DTLS-SRTP) y el servidor podría leerlos. El chat, los mensajes privados y la pizarra pasan por el servidor en claro." },
      ],
    },
    {
      id: "decisions",
      title: "Decisiones",
      group: "decisions",
      blocks: [
        {
          kind: "table",
          head: ["Decisión", "Elegido", "Descartado", "Por qué"],
          rows: [
            ["Topología de medios", "SFU propio sobre Pion para cada sala", "Malla; SFU alojado", "Una malla cuesta a cada persona un upload por oyente; un SFU alojado pone los medios en el servidor de otro."],
            ["Señalización", "Event loop de gnet", "WebSocket de net/http simple", "Mantiene muchos sockets inactivos de forma barata. Transporta solo señalización."],
            ["Página y API", "net/http", "Un framework", "Nada aquí necesita más."],
            ["Estado del cliente", "Sin router ni librería de estado", "Router y store global", "Tres páginas y un store por responsabilidad no los necesitan."],
            ["Estado de la sala", "Un actor por sala", "Estado compartido con locks", "Cambios ordenados, agregado puro, tests unitarios simples."],
            ["Sincronización del roster", "Roster completo, versionado", "Diffs", "Un mensaje perdido se corrige en el siguiente."],
          ],
        },
        {
          kind: "list",
          items: [
            "Todavía sin cifrado de extremo a extremo; la clave de medios derivada queda reservada para él.",
            "Sin relay TURN: las redes que bloquean UDP no reciben medios.",
            "Sin simulcast ni reenvío bajo demanda: los streams ocultos igualmente llegan al cliente.",
            "Las salas sobreviven solo a un handover planificado, no a un crash.",
            "No construido: grabación, transcripción, extensiones.",
          ],
        },
      ],
    },
    {
      id: "files",
      title: "Archivos",
      group: "reference",
      blocks: [
        {
          kind: "files",
          items: [
            { path: "README.md", note: "Visión general, instalación, uso, resumen de configuración" },
            { path: "docs/architecture.md", note: "Componentes, estructura del servidor, lv.1, presencia, medios" },
            { path: "docs/security.md", note: "Códigos de sala, hardening, lo que no está construido, privacidad" },
            { path: "docs/configuration.md", note: "Cada variable de entorno y la CLI de auditoría" },
            { path: "docs/self-hosting.md", note: "Proxy, UDP, handover, dimensionamiento" },
            { path: "server/cmd/live/main.go", note: "El punto de entrada del binario" },
            { path: "server/app/config.go", note: "Lectura y validación del entorno" },
            { path: "server/core/room/room.go", note: "El agregado Room" },
            { path: "server/service/presence/hub.go", note: "El hub de presencia" },
            { path: "server/service/presence/actor.go", note: "Una goroutine por sala" },
            { path: "server/sfu", note: "El motor de medios Pion" },
            { path: "server/signal", note: "Frames lv.1, códigos de cierre, límites de tasa" },
            { path: "web/DESIGN.md", note: "Reglas de diseño del cliente" },
            { path: "mise.toml", note: "Toolchain fijado y las tareas de lint, test y check" },
          ],
        },
      ],
    },
  ],
};

const ptBr: ProjectDoc = {
  tagline: "Uma chamada no navegador que compartilha tela, voz e câmera a partir de um link, servida por um único binário Go com seu próprio servidor de mídia WebRTC.",
  status: "código aberto (GPL-3.0-or-later)",
  facts: [
    { label: "Servidor", value: "Go 1.27.4, Pion SFU, gnet" },
    { label: "Cliente", value: "React 19, Vite, Tailwind 4" },
    { label: "Licença", value: "GPL-3.0-or-later" },
    { label: "Unidade de deploy", value: "um contêiner, sem banco de dados" },
  ],
  sections: [
    {
      id: "overview",
      title: "Visão geral",
      group: "start",
      blocks: [
        { kind: "p", text: "O live-platform é uma chamada no navegador para quem precisa mostrar algo a alguém agora: uma sessão de pair programming, uma olhada rápida numa tela, uma chamada com um amigo que não tem conta em lugar nenhum. A sala é o endereço, e quem abre um nome livre é o dono daquela sala. Sem conta, nada para instalar." },
        { kind: "p", text: "Um processo Go serve a página, a sinalização e a sua própria unidade de encaminhamento seletivo (SFU) construída sobre o Pion. A mídia não passa por um serviço hospedado nem usa uma malha peer-to-peer, em que cada pessoa enviaria uma cópia por ouvinte." },
        { kind: "p", text: "Ele é deliberadamente restrito. Não é um produto de gravação ou transcrição, e ainda não tem criptografia de ponta a ponta. A seção de segurança lista o que está e o que não está construído." },
        {
          kind: "table",
          head: ["Fato", "Valor"],
          rows: [
            ["Tamanho da sala", "Até 10 pessoas"],
            ["Liberação da sala", "30 segundos depois que a última pessoa sai"],
            ["Acesso", "Pública (link) ou privada (código da sala); qualquer uma pode aparecer no lobby"],
            ["Mídia", "Microfone, câmera, tela com seu som, push to talk, desfoque de fundo"],
            ["Extras", "Chat, mão levantada, lousa Excalidraw, controles do dono"],
            ["Idiomas", "Inglês e português, conforme o navegador"],
          ],
        },
      ],
    },
    {
      id: "bootstrap",
      title: "Rodar",
      group: "start",
      blocks: [
        { kind: "p", text: "Precisa de Go 1.27.4, Node.js 26 e um navegador com WebRTC. Dois terminais; o servidor de desenvolvimento do Vite faz proxy de /api para 127.0.0.1:8080 e de /ws para 127.0.0.1:8081." },
        {
          kind: "code",
          lang: "sh",
          code: "cd server\nPUBLIC_ORIGIN=http://localhost:5173 go run ./cmd/live\n\ncd web\nnpm ci\nnpm run dev        # http://localhost:5173",
          caption: "Desenvolvimento",
        },
        { kind: "p", text: "Abra http://localhost:5173/any-name em duas abas para testar uma chamada. Para servir tudo de um único binário:" },
        {
          kind: "code",
          lang: "sh",
          code: "cd web && npm ci && npm run build\ncd ../server && CGO_ENABLED=0 go build -trimpath -o live ./cmd/live\nWEB_DIR=../web/dist ./live        # page and API on :8080; GET /up answers 200",
          caption: "Binário único",
        },
        { kind: "p", text: "Sem WEB_DIR o servidor responde apenas a API. A página e a sinalização usam portas diferentes, então diante de um navegador as duas precisam ficar atrás de uma única origem. O Dockerfile gera um binário estático sobre distroless, sem root, com PORT=3000, SIGNAL_PORT=3001 e WEB_DIR=/web." },
        {
          kind: "code",
          lang: "sh",
          code: "mise install        # pinned Go, golangci-lint, vlint, revive\nlefthook install    # fast lint on commit, changed-package lint on push\nmise run check      # lint-full, race tests, Semgrep\nmise run test       # go test -race -count=1 ./...\ncd web && npx vitest run\ncd web && npm run test:live   # client against a real server",
          caption: "Verificações",
        },
        {
          kind: "table",
          head: ["Variável", "Padrão", "Efeito"],
          rows: [
            ["PORT", "8080 (3000 na imagem)", "HTTP: página, API e /up"],
            ["SIGNAL_PORT", "8081 (3001 na imagem)", "WebSocket de sinalização em /ws"],
            ["PUBLIC_ORIGIN", "vazio", "Origens autorizadas a abrir o socket; vazio permite só o host da própria requisição"],
            ["WEB_DIR", "vazio (/web na imagem)", "Cliente compilado; vazio serve só a API"],
            ["WEB_LIVE_DIR", "vazio", "Diretório sobreposto a WEB_DIR para servir um cliente mais novo sem reiniciar"],
            ["MEDIA", "on", "off roda presença e chat sem o SFU"],
            ["MEDIA_UDP_PORT", "0", "Uma porta UDP compartilhada para toda a mídia; 0 deixa cada conexão escolher a sua"],
            ["MEDIA_PUBLIC_IP", "vazio", "Endereço anunciado aos navegadores atrás de NAT"],
            ["HANDOVER_DIR", "vazio", "Diretório compartilhado com o próximo processo em reinícios planejados"],
            ["AUDIT_DIR", "vazio", "Diretório da trilha de auditoria; vazio a desliga"],
            ["AUDIT_RETENTION_DAYS", "183", "Dias de arquivos de auditoria mantidos"],
            ["OTEL_EXPORTER_OTLP_ENDPOINT", "vazio", "Coletor OTLP/HTTP; vazio desliga o tracing"],
          ],
        },
        { kind: "callout", tone: "note", text: "Tudo é lido do ambiente uma única vez, na partida. Um valor que não pode ser interpretado para o servidor e nomeia a configuração." },
      ],
    },
    {
      id: "architecture",
      title: "Arquitetura",
      group: "how",
      blocks: [
        { kind: "p", text: "Um binário, três listeners. O HTTP serve o cliente compilado e uma pequena API JSON. Um event loop do gnet carrega o WebSocket lv.1. O Pion carrega a mídia por UDP com DTLS-SRTP, direto entre navegador e servidor." },
        {
          kind: "code",
          lang: "text",
          code: "Browser (React 19)                     live (one Go process)\n+----------------------+  HTTPS        +---------------------------+\n| pages and stores     |-------------->| net/http   page, /api     |\n|                      |  WSS /ws      +---------------------------+\n|                      |-------------->| gnet + gobwas/ws  lv.1    |\n|                      |               |        |                  |\n|                      |               |  presence hub             |\n|                      |               |  one actor per room       |\n|                      |               |        |                  |\n| publish PeerConn     |  UDP, DTLS    |  Pion SFU                 |\n| subscribe PeerConn   |<=============>|                           |\n+----------------------+  SRTP         +---------------------------+",
        },
        {
          kind: "table",
          head: ["Listener", "Biblioteca", "Carrega"],
          rows: [
            ["HTTP (PORT)", "net/http", "cliente, GET /api/rooms/{slug}, /api/lobby, /api/project, /api/pass/{id}, /up"],
            ["Sinalização (SIGNAL_PORT)", "gnet + gobwas/ws", "lv.1: presença, chat, lousa, ações do dono, SDP e ICE"],
            ["Mídia (MEDIA_UDP_PORT)", "Pion WebRTC", "RTP sobre DTLS-SRTP"],
          ],
        },
        { kind: "p", text: "O servidor segue portas e adaptadores, com as dependências apontando para dentro." },
        {
          kind: "code",
          lang: "text",
          code: "server/\n  cmd/live/            binary; `live audit` reads the audit trail\n  app/                 composition root: env read and checked once\n  core/room/           Room aggregate. Pure: no clock, no I/O\n  port/inbound|outbound/\n  service/presence/    hub + one goroutine per room\n  signal/              lv.1 over WebSocket on gnet\n  httpapi/  page/      JSON routes; client with security headers\n  sfu/                 Pion media engine\n  handoff/  audit/  guestpass/  clientinfo/  github/",
        },
        { kind: "p", text: "O cliente vive em web/src, uma pasta por responsabilidade: room, media, signal, session, lobby, board, domain, ui, i18n. Não usa router nem biblioteca de estado; três páginas e um store por responsabilidade não precisam deles." },
      ],
    },
    {
      id: "join-flow",
      title: "Fluxo de entrada",
      group: "how",
      blocks: [
        { kind: "scene", id: "live-platform/join", caption: "Um link é um ingresso: o convidado passa pela porta, a sala reserva um assento e todos lá dentro são avisados." },
        {
          kind: "steps",
          items: [
            { title: "Abrir o socket", text: "O navegador abre o WebSocket lv.1 e envia join. O socket aceita apenas as origens configuradas." },
            { title: "Reservar um assento", text: "O servidor de sinalização entrega o frame ao hub de presença. O ator da sala reserva um assento." },
            { title: "Receber o estado", text: "O navegador recebe joined com seu assento, geração e segredo de retomada, depois o roster inteiro com um número de versão." },
            { title: "Negociar a publicação", text: "O navegador envia seu SDP offer pelo mesmo socket num frame rtc. O hub negocia com o SFU a conexão de publicação." },
            { title: "Enviar mídia", text: "A mídia vai direto ao SFU por UDP. O SFU encaminha os pacotes, sem decodificar, para todos os outros." },
            { title: "Difundir mudanças", text: "Cada mudança na sala envia a todos um novo roster completo." },
          ],
        },
        { kind: "p", text: "Cada participante mantém duas conexões peer: uma publica, a outra recebe todos os demais. Os tracks encaminhados são nomeados por quem os enviou e o que são (microfone, câmera, tela, som da tela), a partir das fontes que o publicador declarou." },
      ],
    },
    {
      id: "presence",
      title: "Presença",
      group: "how",
      blocks: [
        { kind: "scene", id: "live-platform/presence", caption: "O roster é do servidor: um convidado quieto vira instável, um que recarrega mantém o assento retido e um timer decide quem é removido." },
        { kind: "p", text: "O servidor é a única autoridade sobre quem está numa sala. Os navegadores só informam. Ele observa três sinais: o socket, um heartbeat e o caminho de mídia." },
        {
          kind: "steps",
          items: [
            { title: "Primeiro sinal perdido", text: "Os outros veem o participante como instável." },
            { title: "Após 4 segundos de tolerância", text: "O participante aparece como reconectando." },
            { title: "Sem retorno", text: "O participante é removido. Sair de propósito é imediato." },
          ],
        },
        { kind: "p", text: "Recarregar mantém o assento. O navegador guarda um segredo por sala durante a vida da aba e o apresenta para retomar. O segredo gira a cada retomada e o antigo é recusado." },
        { kind: "p", text: "Num reinício planejado, o servidor que está parando pode escrever suas salas em HANDOVER_DIR. O novo processo as adota e retém cada assento por 12 segundos enquanto os navegadores reconectam. Um crash perde as salas." },
      ],
    },
    {
      id: "room-model",
      title: "Modelo de sala",
      group: "deep",
      blocks: [
        { kind: "p", text: "Toda mudança numa sala passa pelo seu ator, em ordem, então não há locks em volta do estado da sala. O agregado Room em core/room recebe a hora e responde com o que mudou. Ele não tem relógio nem I/O, então cada regra de presença é um teste unitário simples." },
        {
          kind: "list",
          items: [
            "Os assentos são um bitmap uint64.",
            "O que um participante tem ligado (microfone, câmera, tela, áudio da tela, mão, dono, instável) é um uint16 de flags.",
            "Os rosters são enviados inteiros, com número de versão, nunca como diff. Um navegador que perdeu uma mensagem fica certo de novo na seguinte.",
            "Cada sala publica um resumo atômico, então listar o lobby nunca bloqueia na goroutine de uma sala.",
          ],
        },
        { kind: "p", text: "A derivação do código da sala em salas privadas é tratada em Segurança. O agregado da sala guarda as regras do dono: transferir, remover, banir, silenciar todos, falar por mão levantada, mudanças de acesso e de listagem." },
      ],
    },
    {
      id: "protocol",
      title: "Protocolo lv.1",
      group: "deep",
      blocks: [
        { kind: "p", text: "Frames de texto JSON sobre um WebSocket, cada um com seu tipo em t." },
        {
          kind: "table",
          head: ["Direção", "Frames"],
          rows: [
            ["Navegador para servidor", "join, resume, hb, leave, media, rtc, look, photo, chat, board, owner, remove, ban, transfer, listed, password"],
            ["Servidor para navegador", "joined, roster (versionado, inteiro), rtc, chat, photo, board, error"],
          ],
        },
        { kind: "p", text: "Os códigos de fechamento da aplicação dizem ao navegador por que um socket terminou." },
        {
          kind: "table",
          head: ["Código", "Significado"],
          rows: [
            ["4001", "Substituído por outra aba"],
            ["4012", "Servidor reiniciando"],
            ["4400", "Frame inválido"],
            ["4401", "Sem hello"],
            ["4403", "Removido"],
            ["4404", "Banido"],
            ["4408", "Silencioso"],
            ["4409", "Lento demais para ler"],
            ["4429", "Inundação"],
          ],
        },
        { kind: "p", text: "Limites de sinalização: 128 KiB por frame, 2 MiB de dados não enviados, 20 frames por segundo com rajada de 80. Um cliente que os ultrapassa é desconectado com um código que diz o motivo." },
      ],
    },
    {
      id: "media-path",
      title: "Caminho da mídia",
      group: "deep",
      blocks: [
        { kind: "scene", id: "live-platform/forward", caption: "O SFU é uma agência dos correios: cada track que um convidado envia é encaminhado, sem abrir, a todos os outros convidados." },
        {
          kind: "list",
          items: [
            "O SFU encaminha RTP sem decodificar.",
            "Os codecs são os padrões do Pion. O servidor pede aos publicadores um keyframe a cada 2 segundos para quem entra tarde ver imagem rápido.",
            "Sem simulcast e sem encaminhamento sob demanda: cada stream vai a todos na qualidade em que foi enviado.",
            "O processamento de áudio roda só no navegador: RNNoise para o filtro de voz mais forte, além de ganho, noise gate e cancelamento de eco. O desfoque de fundo roda o MediaPipe no navegador.",
            "Uma porta UDP para toda a mídia quando MEDIA_UDP_PORT está definido, anunciada em MEDIA_PUBLIC_IP.",
            "Não há relay TURN, então uma rede que bloqueia UDP não consegue transportar mídia.",
          ],
        },
        { kind: "p", text: "Como cada stream é encaminhado para todos os outros participantes, o upload do servidor cresce com o quadrado do tamanho da sala. O teto de 10 por sala o limita." },
        { kind: "p", text: "A lousa é o Excalidraw, fixado numa versão e carregado só quando aberto. Ela vive nos navegadores; o servidor repassa suas peças sem lê-las e não guarda nada." },
      ],
    },
    {
      id: "security",
      title: "Modelo de segurança",
      group: "deep",
      blocks: [
        { kind: "p", text: "Numa sala privada, o navegador deriva 64 bytes do código da sala com PBKDF2-SHA-256 a 600.000 iterações, usando o endereço da sala como salt. Os primeiros 32 bytes são um verificador enviado ao servidor, que guarda apenas o seu SHA-256. Os outros 32 ficam reservados como chave de mídia e nunca saem do navegador. Um link compartilhado leva o código depois do #, que os navegadores não enviam. Dez tentativas erradas trancam a porta por cinco minutos." },
        {
          kind: "list",
          items: [
            "CSP: default-src 'none', scripts, estilos, fontes e conexões da própria origem, sem script nem estilo inline. 'wasm-unsafe-eval' é permitido para o filtro de voz e o desfoque.",
            "Cadeia de suprimentos: versões exatas, lockfiles versionados, scripts de instalação do npm desativados, imagens base e actions de CI fixadas por digest, Dependabot, govulncheck, go mod verify, npm audit e um SBOM CycloneDX para servidor e cliente.",
            "Imagem: distroless, estática, sem root.",
            "Auditoria: sem AUDIT_DIR o servidor não registra nada. Com ele, uma linha JSON por fato vai para um arquivo diário, apagado após AUDIT_RETENTION_DAYS. O texto do chat de uma sala pública é registrado; o chat de uma sala privada guarda só quem, quando e o tamanho.",
            "Os spans de tracing levam o nome da sala e flags, nunca um endereço, um nome ou texto de chat.",
          ],
        },
        { kind: "callout", tone: "warn", text: "Sem criptografia de ponta a ponta. A mídia é criptografada entre cada navegador e o servidor (DTLS-SRTP) e o servidor poderia lê-la. O chat, as mensagens privadas e a lousa passam pelo servidor em claro." },
      ],
    },
    {
      id: "decisions",
      title: "Decisões",
      group: "decisions",
      blocks: [
        {
          kind: "table",
          head: ["Decisão", "Escolhido", "Rejeitado", "Por quê"],
          rows: [
            ["Topologia de mídia", "SFU próprio sobre o Pion para toda sala", "Malha; SFU hospedado", "Uma malha custa a cada pessoa um upload por ouvinte; um SFU hospedado coloca a mídia no servidor de outra pessoa."],
            ["Sinalização", "Event loop do gnet", "WebSocket simples do net/http", "Segura muitos sockets ociosos de forma barata. Carrega só sinalização."],
            ["Página e API", "net/http", "Um framework", "Nada aqui precisa de mais."],
            ["Estado do cliente", "Sem router, sem biblioteca de estado", "Router e store global", "Três páginas e um store por responsabilidade não precisam deles."],
            ["Estado da sala", "Um ator por sala", "Estado compartilhado com locks", "Mudanças ordenadas, agregado puro, testes unitários simples."],
            ["Sincronização do roster", "Roster inteiro, versionado", "Diffs", "Uma mensagem perdida se corrige na seguinte."],
          ],
        },
        {
          kind: "list",
          items: [
            "Ainda sem criptografia de ponta a ponta; a chave de mídia derivada fica reservada para ela.",
            "Sem relay TURN: redes que bloqueiam UDP ficam sem mídia.",
            "Sem simulcast nem encaminhamento sob demanda: streams ocultos ainda chegam ao cliente.",
            "As salas sobrevivem apenas a um handover planejado, não a um crash.",
            "Não construído: gravação, transcrição, extensões.",
          ],
        },
      ],
    },
    {
      id: "files",
      title: "Arquivos",
      group: "reference",
      blocks: [
        {
          kind: "files",
          items: [
            { path: "README.md", note: "Visão geral, instalação, uso, resumo da configuração" },
            { path: "docs/architecture.md", note: "Componentes, estrutura do servidor, lv.1, presença, mídia" },
            { path: "docs/security.md", note: "Códigos de sala, hardening, o que não está construído, privacidade" },
            { path: "docs/configuration.md", note: "Cada variável de ambiente e a CLI de auditoria" },
            { path: "docs/self-hosting.md", note: "Proxy, UDP, handover, dimensionamento" },
            { path: "server/cmd/live/main.go", note: "O ponto de entrada do binário" },
            { path: "server/app/config.go", note: "Leitura e validação do ambiente" },
            { path: "server/core/room/room.go", note: "O agregado Room" },
            { path: "server/service/presence/hub.go", note: "O hub de presença" },
            { path: "server/service/presence/actor.go", note: "Uma goroutine por sala" },
            { path: "server/sfu", note: "O motor de mídia Pion" },
            { path: "server/signal", note: "Frames lv.1, códigos de fechamento, limites de taxa" },
            { path: "web/DESIGN.md", note: "Regras de design do cliente" },
            { path: "mise.toml", note: "Toolchain fixado e as tarefas de lint, test e check" },
          ],
        },
      ],
    },
  ],
};

const doc: Partial<Record<Lang, ProjectDoc>> = { en, es, "pt-br": ptBr };

export default doc;
