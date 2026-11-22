import type { Post } from "./types";

const post: Post = {
  slug: "the-1ms-animation-that-never-finished",
  category: "discoveries",
  date: "2026-11-21",
  published: "2026-11-21",
  title: "The 1 ms animation that never finished",
  summary: "A typed terminal on this site left 148 of 430 glyphs invisible even though the browser reported every animation as finished. The fix, the measurement, and a second gotcha with calc() and var().",
  tags: ["css", "animation", "debugging", "chromium"],
  sections: [
    {
      id: "symptom",
      title: "Symptom",
      blocks: [
        { kind: "p", text: "The home page has a terminal that types itself. To get a per-character reveal without JavaScript timers, each glyph is a span with its own CSS animation, delayed by its index. It looked right on my machine and wrong on others: some characters never appeared." },
        { kind: "p", text: "I counted instead of trusting my eyes. After load, 148 of 430 glyphs had a computed opacity of 0. The odd part is that element.getAnimations() reported those same animations as finished." },
      ],
    },
    {
      id: "before",
      title: "The code that failed",
      blocks: [
        { kind: "code", lang: "css", caption: "before", code: ".type-glyph {\n  opacity: 0;\n  animation: type-glyph 1ms steps(1) var(--d) forwards;\n}\n\n@keyframes type-glyph {\n  to { opacity: 1; }\n}" },
        { kind: "p", text: "The base style hides the glyph. The animation is supposed to flip it to visible after its delay and hold that value with forwards. A one millisecond duration with a single step looked like the cheapest way to say \"switch on at time d\"." },
      ],
    },
    {
      id: "measure",
      title: "How I measured it",
      blocks: [
        { kind: "p", text: "The check is a short script run in the page after load. It walks every glyph, reads the computed opacity, and counts the ones still at 0. It also compares that with the animation state. This is the shape of it, not a test file in the repository." },
        { kind: "code", lang: "js", code: "const glyphs = [...document.querySelectorAll(\".type-glyph\")];\nconst hidden = glyphs.filter((g) => getComputedStyle(g).opacity === \"0\");\nconst finished = glyphs.filter((g) =>\n  g.getAnimations().every((a) => a.playState === \"finished\"),\n);\nconsole.log({ total: glyphs.length, hidden: hidden.length, finished: finished.length });" },
        { kind: "p", text: "Before the fix this printed 430 total and 148 hidden, with the animations reported as finished. A finished animation with a hidden result means the end state of the animation was not applied to the computed style." },
      ],
    },
    {
      id: "fix",
      title: "The fix",
      blocks: [
        { kind: "code", lang: "css", caption: "after", code: ".type-glyph {\n  animation: type-glyph 40ms linear var(--d) both;\n}\n\n@keyframes type-glyph {\n  from { opacity: 0; }\n}" },
        { kind: "list", items: [
          "No base opacity. The element is visible by default, so a glyph can never be stuck hidden by a missing animation effect.",
          "The keyframe animates from the hidden value to the element's own value, so the resting state is the normal style, not a filled-forward value.",
          "both fills backwards as well, which keeps the glyph hidden during its delay.",
          "40 ms linear instead of 1 ms steps(1). The reveal is a short fade rather than a switch.",
        ] },
        { kind: "p", text: "Same script, same page: 0 of 430 hidden." },
        { kind: "callout", tone: "note", text: "Cause, as hypotheses. I did not verify any of this in the Chromium source. One: with a 1 ms duration and many animations starting in the same frames, an animation can reach its end between style updates, and a forwards fill of the final keyframe may not be applied over the opacity: 0 base. Two: the base opacity: 0 and a forwards fill are two separate declarations that must win in the cascade, and I removed that dependency instead of proving which side lost. The fix works; the explanation is a guess." },
      ],
    },
    {
      id: "calc",
      title: "A second gotcha, same day",
      blocks: [
        { kind: "p", text: "The line-by-line typing used one animation per line, with its duration computed from the character count." },
        { kind: "code", lang: "css", code: ".type-line {\n  animation: type calc(var(--chars) * var(--type-step, 20ms)) steps(var(--chars), end) var(--delay, 0ms) both;\n}" },
        { kind: "p", text: "A line of 10 characters had --type-step: 90ms set inline on the same element, so I expected 0.9 s. The computed animation-duration was 0.2 s, which is 10 times the 20 ms fallback. The inline custom property was ignored inside that calc()." },
        { kind: "code", lang: "tsx", caption: "workaround", code: "<span\n  className=\"type-line\"\n  style={{ \"--chars\": text.length, animationDuration: `${text.length * 90}ms` }}\n>" },
        { kind: "p", text: "Setting animationDuration inline gave 0.9 s. As before, I do not know the root cause. My hypotheses are an ordering problem between the shorthand's var() substitution and the inline property, or a unit-typed value reaching calc() as the fallback. Neither is verified." },
      ],
    },
    {
      id: "lesson",
      title: "What I would do next time",
      blocks: [
        { kind: "list", items: [
          "Trust computed style, not getAnimations(). The first said 148 glyphs were hidden; the second said everything was fine.",
          "Make the default state the visible one, and let the animation take things away, not add them.",
          "Avoid sub-frame durations. At 60 Hz one frame is about 16.7 ms, so 1 ms asks for an effect the page cannot show.",
          "When a value is computed from a custom property and comes out as the fallback, set the final value inline and move on.",
        ] },
      ],
    },
  ],
};

export default post;
