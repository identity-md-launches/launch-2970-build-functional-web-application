import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { resolve, dirname } from "node:path";
const html = await readFile("dist/index.html", "utf8");
for (const text of [
  "<title>Hamster Hub",
  'name="description"',
  'property="og:title"',
  'property="og:image"',
  'rel="icon"',
])
  assert.ok(html.includes(text), `Missing metadata: ${text}`);
let files = 0,
  bytes = 0;
async function walk(path) {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const file = `${path}/${entry.name}`;
    if (entry.isDirectory()) await walk(file);
    else {
      files++;
      bytes += (await stat(file)).size;
    }
  }
}
for (const match of html.matchAll(/(?:src|href|content)="(\.\/[^"#]+)"/g)) {
  const file = resolve("dist", match[1]);
  assert.ok((await stat(file)).isFile(), `Missing local asset ${match[1]}`);
}
for (const file of await readdir("dist/assets")) {
  if (!file.endsWith(".css")) continue;
  const css = await readFile(`dist/assets/${file}`, "utf8");
  for (const match of css.matchAll(/url\(([^)]+)\)/g)) {
    const url = match[1].replace(/["']/g, "");
    if (url.startsWith("data:")) continue;
    assert.ok(
      !url.startsWith("/") && !url.startsWith("http"),
      `Non-relative asset: ${url}`,
    );
    assert.ok(
      (await stat(resolve(dirname(`dist/assets/${file}`), url))).isFile(),
    );
  }
}
assert.ok(!/(?:src|href)="\/(?!\/)/.test(html), "Root-relative runtime asset");
const card = await readFile("dist/social-card.png");
assert.equal(card.readUInt32BE(16), 1200);
assert.equal(card.readUInt32BE(20), 630);
await walk("dist");
assert.ok(bytes < 1024 * 1024, "Production export should stay below 1 MiB");
console.log(
  `Export passed: ${files} files, ${bytes.toLocaleString()} bytes, local assets resolve, metadata complete, 1200×630 PNG share card.`,
);
