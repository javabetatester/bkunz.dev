import { IconArrowUpRight, IconBrandGithub, IconBrandLinkedin, IconBrandX, IconTerminal2 } from "@tabler/icons-react";
import { LINKS } from "~/content/copy";
import { usePage } from "~/content/useCopy";

const BRAND = {
  github: { name: "GitHub", Icon: IconBrandGithub },
  linkedin: { name: "LinkedIn", Icon: IconBrandLinkedin },
  x: { name: "X", Icon: IconBrandX },
  versatile: { name: "versatile.sh", Icon: IconTerminal2 },
} as const;

type DepthStyle = React.CSSProperties & { "--depth": number };

export function Elsewhere() {
  const { copy } = usePage();

  return (
    <section id="elsewhere" aria-labelledby="elsewhere-title" className="px-gutter">
      <h2 id="elsewhere-title" className="text-heading text-fg">{copy.elsewhere.title}</h2>
      <p className="mt-3 max-w-[60ch] text-title text-muted">{copy.elsewhere.lead}</p>
      <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {LINKS.map((link, i) => {
          const { name, Icon } = BRAND[link.id];
          return (
            <li key={link.id} className="depth-in" style={{ "--depth": 30 + i * 20 } as DepthStyle}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-full min-h-44 flex-col justify-between gap-6 rounded-surface border border-line-strong bg-raised p-6 shadow-[inset_0_0_0_0_var(--color-accent)] transition-shadow duration-[280ms] ease-thumb hover:shadow-[inset_0_2px_0_0_var(--color-accent)] focus-visible:shadow-[inset_0_2px_0_0_var(--color-accent)] md:min-h-52 md:p-8"
              >
                <Icon size={40} stroke={1.5} aria-hidden="true" className="text-muted transition-colors duration-[280ms] ease-thumb group-hover:text-fg group-focus-visible:text-fg" />
                <span className="flex flex-col gap-1">
                  <span className="text-title text-fg">{name}</span>
                  <span className="text-meta text-muted">{link.short}</span>
                </span>
                <IconArrowUpRight size={24} stroke={1.5} aria-hidden="true" className="absolute right-6 bottom-6 text-muted transition-[transform,color] duration-[280ms] ease-thumb group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent group-focus-visible:-translate-y-1 group-focus-visible:translate-x-1 group-focus-visible:text-accent md:right-8 md:bottom-8" />
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
