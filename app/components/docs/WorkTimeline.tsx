import { useId, useLayoutEffect, useRef, useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { SESSIONS, type Role, type Session } from "~/content/experience";
import { StackBadges } from "~/components/docs/StackBadges";

const THUMB_PAD = 6;

function SessionTerminal({ role }: { role: Role }) {
  const available = SESSIONS.filter((s) => role[s].length > 0);
  const [session, setSession] = useState<Session>(available[0] ?? "specs");
  const listRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<{ x: number; w: number } | null>(null);
  const id = useId();

  useLayoutEffect(() => {
    const button = listRef.current?.querySelector<HTMLElement>(`[data-session="${session}"]`);
    const label = button?.querySelector<HTMLElement>("[data-label]");
    if (button && label) setThumb({ x: button.offsetLeft + label.offsetLeft - THUMB_PAD, w: label.offsetWidth + THUMB_PAD * 2 });
  }, [session]);

  return (
    <div className="overflow-hidden rounded-surface border border-line-strong bg-sunken">
      <div className="flex items-center justify-between gap-4 border-b border-line px-5">
        <div ref={listRef} role="tablist" aria-label={role.org} className="relative isolate flex gap-9 pl-1">
          {available.map((s) => (
            <button
              key={s}
              type="button"
              role="tab"
              data-session={s}
              id={`${id}-${s}`}
              aria-selected={s === session}
              aria-controls={`${id}-panel`}
              onClick={() => setSession(s)}
              className={`relative min-h-12 cursor-pointer px-0.5 text-body transition-colors duration-150 ease-out ${s === session ? "text-fg" : "text-muted hover:text-fg"}`}
            >
              <span className="text-faint">~/</span>
              <span data-label>{s}</span>
            </button>
          ))}
          {thumb && (
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-[3px] rounded-full bg-accent transition-[translate,width] duration-[280ms] ease-thumb"
              style={{ width: thumb.w, translate: `${thumb.x}px 0` }}
            />
          )}
        </div>
        <span className="hidden text-meta text-muted sm:block">{role.org.toLowerCase().replace(/\s+/g, "-")}</span>
      </div>
      <div className="grid">
        {available.map((s) => {
          const shown = s === session;
          return (
            <div
              key={s}
              id={shown ? `${id}-panel` : undefined}
              role={shown ? "tabpanel" : undefined}
              aria-labelledby={shown ? `${id}-${s}` : undefined}
              aria-hidden={!shown}
              className={`col-start-1 row-start-1 flex flex-col gap-3 p-5 transition-opacity duration-200 ease-out md:p-6 ${shown ? "opacity-100" : "invisible opacity-0"}`}
            >
              {s === "specs" ? (
                <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                  {role.specs.map((spec) => (
                    <li key={spec.value} className="flex min-w-0 flex-col gap-1.5 border-l border-line-strong pl-4">
                      <span className="text-title text-fg tabular-nums">{spec.value}</span>
                      <span className="text-body text-muted">{spec.text}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="flex flex-col gap-2">
                  {role[s].map((item) => (
                    <li key={item} className="max-w-[78ch] text-body text-fg/85">
                      <span className="text-accent">$ </span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Career rows; each slides open into a terminal whose sessions split the role into specs, projects and experience. */
export function WorkTimeline({ roles }: { roles: Role[] }) {
  const [open, setOpen] = useState<string | null>(roles[0]?.id ?? null);
  const base = useId();

  return (
    <ol className="border-t border-line">
      {roles.map((role, i) => {
        const expanded = open === role.id;
        const panel = `${base}-${role.id}`;
        return (
          <li key={role.id} className="depth-in border-b border-line" style={{ "--depth": 10 + i * 12 } as React.CSSProperties}>
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={panel}
              onClick={() => setOpen(expanded ? null : role.id)}
              className="group grid w-full cursor-pointer grid-cols-[1fr_auto] items-center gap-4 py-5 text-left md:grid-cols-[11rem_1fr_auto]"
            >
              <span className="hidden text-body text-muted tabular-nums md:block">{role.period}</span>
              <span className="flex flex-col gap-0.5">
                <span className="text-meta text-muted tabular-nums md:hidden">{role.period}</span>
                <span className={`text-title transition-colors duration-150 ease-out ${expanded ? "text-fg" : "text-fg/90 group-hover:text-fg"}`}>{role.org}</span>
                <span className="text-body text-muted">{role.title}</span>
              </span>
              <IconPlus
                size={18}
                stroke={1.5}
                aria-hidden="true"
                className={`transition-[rotate,color] duration-[450ms] ease-glide ${expanded ? "rotate-45 text-accent" : "text-muted group-hover:text-fg"}`}
              />
            </button>
            <div
              id={panel}
              role="region"
              aria-label={role.org}
              inert={!expanded}
              className={`grid transition-[grid-template-rows,opacity] duration-[450ms] ease-glide ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="flex flex-col gap-3 pb-6 md:pl-[calc(11rem+1rem)]">
                  <StackBadges items={role.stack} />
                  <SessionTerminal role={role} />
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
