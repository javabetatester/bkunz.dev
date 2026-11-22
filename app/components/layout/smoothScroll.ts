import type { MouseEvent } from "react";

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Glides the page to an element with an in-out curve, below the sticky header; instant under reduced motion. */
export function glideTo(target: HTMLElement, offset = 0) {
  if (window.__lenis) {
    window.__lenis.scrollTo(target, { offset: -offset, duration: 1.1, easing: ease });
    return;
  }
  const startY = window.scrollY;
  const endY = Math.max(0, target.getBoundingClientRect().top + startY - offset);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, endY);
    return;
  }
  const html = document.documentElement;
  const snap = html.style.scrollSnapType;
  html.style.scrollSnapType = "none";
  const distance = endY - startY;
  const duration = Math.min(1000, Math.max(600, Math.abs(distance) * 0.45));
  const t0 = performance.now();
  const frame = (now: number) => {
    const t = Math.min(1, (now - t0) / duration);
    window.scrollTo(0, startY + distance * ease(t));
    if (t < 1) requestAnimationFrame(frame);
    else html.style.scrollSnapType = snap;
  };
  requestAnimationFrame(frame);
}

/** Click handler for in-page anchors: glides to the target and records the hash without a navigation. */
export function smoothScroll(event: MouseEvent<HTMLAnchorElement>) {
  const id = event.currentTarget.getAttribute("href")?.replace(/^#/, "");
  const target = id ? document.getElementById(id) : null;
  if (!target) return;
  event.preventDefault();
  const bar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--spacing-bar")) * 16 || 56;
  glideTo(target, bar + 20);
  history.replaceState(history.state, "", `#${id}`);
}
