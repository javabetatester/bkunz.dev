export type Block =
  | { kind: "p"; text: string }
  | { kind: "code"; lang: string; code: string; caption?: string }
  | { kind: "list"; items: string[] }
  | { kind: "steps"; items: { title: string; text: string }[] }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "callout"; tone: "note" | "warn"; text: string }
  | { kind: "files"; items: { path: string; note: string }[] }
  | { kind: "scene"; id: string; caption: string };

export type DocSection = { id: string; title: string; group: "start" | "how" | "deep" | "decisions" | "reference"; blocks: Block[] };

export type ProjectDoc = {
  tagline: string;
  status: string;
  facts: { label: string; value: string }[];
  sections: DocSection[];
};
