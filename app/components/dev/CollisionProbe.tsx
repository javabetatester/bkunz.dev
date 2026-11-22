import { useEffect } from "react";

const TOLERANCE = 1;

const flowChildren = (el: Element) =>
  Array.from(el.children).filter((child): child is HTMLElement => {
    if (!(child instanceof HTMLElement) || child.hidden) return false;
    const style = getComputedStyle(child);
    return style.position !== "absolute" && style.position !== "fixed" && style.display !== "none" && style.visibility !== "hidden";
  });

const overlaps = (a: DOMRect, b: DOMRect) =>
  Math.min(a.right, b.right) - Math.max(a.left, b.left) > TOLERANCE && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > TOLERANCE;

const label = (el: Element) => `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ""}.${(el.getAttribute("class") ?? "").split(" ").slice(0, 4).join(".")}`;

function scan() {
  const hits: string[] = [];
  document.querySelectorAll("main *, header *").forEach((parent) => {
    const display = getComputedStyle(parent).display;
    if (!/grid|flex/.test(display)) return;
    const kids = flowChildren(parent);
    const rects = kids.map((k) => k.getBoundingClientRect());
    for (let i = 0; i < kids.length; i++) {
      for (let j = i + 1; j < kids.length; j++) {
        const a = rects[i];
        const b = rects[j];
        if (a && b && overlaps(a, b)) {
          kids[i]?.style.setProperty("outline", "1px solid red");
          kids[j]?.style.setProperty("outline", "1px solid red");
          hits.push(`${label(kids[i]!)}  ×  ${label(kids[j]!)}`);
        }
      }
    }
  });
  document.querySelectorAll<HTMLElement>("main *").forEach((el) => {
    const parent = el.parentElement;
    if (!parent) return;
    const style = getComputedStyle(parent);
    if (/auto|scroll|hidden|clip/.test(style.overflowY + style.overflowX)) return;
    const a = el.getBoundingClientRect();
    const b = parent.getBoundingClientRect();
    if (a.height && (a.bottom > b.bottom + TOLERANCE || a.right > b.right + TOLERANCE)) {
      if (getComputedStyle(el).position === "absolute") return;
      el.style.setProperty("outline", "1px dashed orange");
      hits.push(`${label(el)}  overflows  ${label(parent)}`);
    }
  });
  if (hits.length) console.warn(`[collision] ${hits.length} overlapping sibling(s):\n${hits.join("\n")}`);
}

/** Dev only: outlines in red and logs sibling boxes of a grid or flex container that overlap. */
export function CollisionProbe() {
  useEffect(() => {
    let timer = 0;
    const run = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(scan, 1500);
    };
    run();
    window.addEventListener("resize", run);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", run);
    };
  }, []);
  return null;
}
