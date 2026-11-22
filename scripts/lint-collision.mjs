#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../app", import.meta.url).pathname;
const CLASS_ATTR = /className=(?:"([^"]*)"|\{`([^`]*)`\})/g;
const ASPECT = /^aspect-/;
const MIN_BOX = /^min-(h|w)-(?!0$)/;

const files = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : /\.tsx$/.test(name) ? [path] : [];
  });

const split = (token) => {
  const at = token.lastIndexOf(":");
  return at === -1 ? ["", token] : [token.slice(0, at), token.slice(at + 1)];
};

const reachable = (aspectBp, minBp) => minBp === "" || aspectBp === minBp || aspectBp === "";

const findings = [];
for (const file of files(ROOT)) {
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(CLASS_ATTR)) {
    const tokens = (match[1] ?? match[2] ?? "").split(/\s+/).filter(Boolean).map(split);
    const aspects = tokens.filter(([, u]) => ASPECT.test(u) && u !== "aspect-auto");
    const mins = tokens.filter(([, u]) => MIN_BOX.test(u));
    for (const [aBp, a] of aspects) {
      for (const [mBp, m] of mins) {
        if (!reachable(aBp, mBp)) continue;
        const line = source.slice(0, match.index).split("\n").length;
        findings.push(`${file.replace(`${ROOT}/`, "app/")}:${line}: ${aBp ? `${aBp}:` : ""}${a} with ${mBp ? `${mBp}:` : ""}${m}: a fixed ratio plus a minimum size forces the box wider than its track and it collides with its neighbour`);
      }
    }
  }
}

if (findings.length) {
  console.error(findings.join("\n"));
  console.error(`\nlint:collision: ${findings.length} finding(s). Use a min size or a ratio, not both, at the same breakpoint.`);
  process.exit(1);
}
console.log("lint:collision: ok");
