import type { MouseEvent } from "react";
import type { NavigateFunction } from "react-router";

const OVERSHOOT = 1.5;

export function irisRadius(x: number, y: number, width: number, height: number): number {
  return Math.hypot(Math.max(x, width - x), Math.max(y, height - y)) * OVERSHOOT;
}

/** Navigates with a circle that opens from the click; plain navigation for modified clicks. */
export function irisNavigate(event: MouseEvent<HTMLAnchorElement>, to: string, navigate: NavigateFunction) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const { clientX: x, clientY: y } = event;
  const root = document.documentElement.style;
  root.setProperty("--iris-x", `${x}px`);
  root.setProperty("--iris-y", `${y}px`);
  root.setProperty("--iris-r", `${irisRadius(x, y, window.innerWidth, window.innerHeight)}px`);
  navigate(to, { viewTransition: true });
}
