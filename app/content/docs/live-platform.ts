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

const doc: Partial<Record<Lang, ProjectDoc>> = { en };

export default doc;
