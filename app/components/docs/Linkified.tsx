import type { ReactNode } from "react";

const TOKEN = /(https?:\/\/[^\s)<>"']+[^\s)<>"'.,;:!?]|\bversatile\.sh\b)/g;

/** Text with every URL and every mention of versatile.sh rendered as a link. */
export function Linkified({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) parts.push(text.slice(last, at));
    const raw = m[0];
    const href = raw.startsWith("http") ? raw : "https://versatile.sh";
    parts.push(
      <a key={at} href={href} target="_blank" rel="noopener" className="text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent">
        {raw}
      </a>,
    );
    last = at + raw.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
