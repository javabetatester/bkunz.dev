import { Link, useNavigate } from "react-router";
import { IconArrowDown, IconArrowUpRight, IconBrain, IconServer2, IconTool } from "@tabler/icons-react";
import { pagePath } from "~/content/pages";
import { usePage } from "~/content/useCopy";
import { irisNavigate } from "~/components/layout/iris";
import { Occlude } from "~/components/home/Occlude";
import { HeroTerminal } from "~/components/home/HeroTerminal";
import { EXPERIENCE } from "~/content/experience";

const PROMPT = "bk@bkunz.dev ~ $ whoami";
const NAME = "Bernardo Kunz";
const MOTTO = "Measure twice, optimize once.";
const ROLE_ICONS = [IconBrain, IconTool, IconServer2];

type LayerStyle = React.CSSProperties & { "--depth": number; "--delay"?: string; "--chars"?: number };

const layer = (depth: number, delay = 0): LayerStyle => ({ "--depth": depth, "--delay": `${delay}ms` });
const chars = (n: number, delay: number): LayerStyle => ({ "--depth": 0, "--chars": n, "--delay": `${delay}ms` });
const drift = (depth: number): LayerStyle => ({ "--depth": depth });

function Avatar() {
  return (
    <img
      src="/avatar.webp"
      alt="Bernardo Kunz"
      width={72}
      height={72}
      className="size-[4.2em] shrink-0 rounded-full border border-line-strong object-cover"
    />
  );
}

export function Hero() {
  const { copy, lang } = usePage();
  const { hero } = copy;
  const navigate = useNavigate();
  const work = pagePath(lang, "work");

  return (
    <section className="hero-fit flex flex-col justify-between gap-[1.6em] px-gutter pt-[2.2em] pb-[1.4em] lg:h-[calc(100svh-var(--spacing-bar))] lg:min-h-[34rem]">
      <div className="grid min-h-0 grid-cols-1 gap-x-gutter gap-y-[1.4em] lg:grid-cols-12">
        <div className="flex flex-col gap-[1.1em] lg:col-span-8 lg:row-start-1">
          <div className="depth-in" style={layer(80)}>
            <div className="parallax" style={drift(140)}>
              <p className="hs-body text-muted">
                <span className="type-line" style={chars(PROMPT.length, 0)}>
                  bk@bkunz.dev ~ <span className="text-accent">$</span> whoami
                </span>
              </p>
            </div>
          </div>
          <div className="depth-in" style={layer(20)}>
            <div className="parallax" style={drift(60)}>
              <h1 className="hs-name text-fg">
                <Occlude text={NAME} delay={150} step={32} />
              </h1>
            </div>
          </div>
        </div>

        <div className="depth-in lg:col-span-8 lg:row-start-2" style={layer(10, 200)}>
          <div className="parallax max-w-[74ch]" style={drift(20)}>
            <HeroTerminal
              lines={[
                { cmd: "cat role.txt", chips: hero.roles.map((label, i) => ({ label, Icon: ROLE_ICONS[i] ?? IconBrain })) },
                { cmd: "echo $FOCUS", out: hero.focus, tone: "accent" },
                { cmd: "cat about.md", out: hero.about, tone: "muted" },
              ]}
            />
          </div>
        </div>

        <div className="depth-in flex flex-col gap-[1em] lg:col-span-4 lg:row-start-1 lg:justify-end" style={layer(30, 250)}>
          <div className="parallax flex items-center gap-[1em]" style={drift(80)}>
            <Avatar />
            <a
              href="https://github.com/javabetatester"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col"
            >
              <span className="hs-lead text-fg">@javabetatester</span>
              <span className="hs-body inline-flex items-center gap-1 text-muted underline decoration-line-strong underline-offset-4 transition-colors duration-150 ease-out group-hover:text-fg group-hover:decoration-accent">
                {hero.handleNote}
                <IconArrowUpRight size="1em" stroke={1.5} aria-hidden="true" className="transition-[translate,color] duration-300 ease-thumb group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
              </span>
            </a>
          </div>
          <p className="parallax hs-lead text-accent" style={drift(70)}>
            <Occlude text={MOTTO} delay={400} step={14} />
          </p>
        </div>

        <aside className="depth-in lg:col-span-4 lg:row-start-2" style={layer(30, 500)}>
          <h2 className="hs-body mb-[0.6em] text-muted">{hero.track}</h2>
          <ol className="border-t border-line">
            {EXPERIENCE[lang].map((role) => (
              <li key={role.id} className="grid grid-cols-[7.5em_1fr] gap-[1em] border-b border-line py-[0.7em]">
                <span className="hs-meta pt-[0.15em] text-muted tabular-nums">{role.period}</span>
                <span className="flex min-w-0 flex-col">
                  <span className="hs-body truncate text-fg">{role.org}</span>
                  <span className="hs-meta truncate text-muted">{role.title}</span>
                </span>
              </li>
            ))}
          </ol>
          <Link
            to={work}
            onClick={(e) => irisNavigate(e, work, navigate)}
            className="group hs-body mt-[0.4em] inline-flex min-h-11 items-center gap-2 text-muted underline decoration-line-strong underline-offset-4 transition-colors duration-150 ease-out hover:text-fg hover:decoration-accent"
          >
            ~/work · {hero.trackCta}
            <IconArrowUpRight size="1em" stroke={1.5} className="transition-[translate,color] duration-300 ease-thumb group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
          </Link>
        </aside>
      </div>

      <div aria-hidden="true" className="depth-in hs-body mx-auto flex w-fit flex-col items-center gap-[0.4em] text-muted" style={layer(10, 900)}>
        <span className="cue grid size-8 place-items-center">
          <IconArrowDown size={18} stroke={1.5} />
        </span>
        <span>{hero.scrollHint}</span>
      </div>
    </section>
  );
}
