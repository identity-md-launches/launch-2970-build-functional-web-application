import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
export async function startPreview(
  root = "dist",
  prefix = "/preview/hamster-hub/",
) {
  const folder = resolve(root);
  const types = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript",
    ".css": "text/css",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".webp": "image/webp",
    ".woff2": "font/woff2",
    ".txt": "text/plain",
  };
  const server = createServer(async (req, res) => {
    try {
      const path = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      if (!path.startsWith(prefix)) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      let file = resolve(folder, path.slice(prefix.length) || "index.html");
      if (!file.startsWith(folder + sep)) {
        res.writeHead(403);
        res.end();
        return;
      }
      if ((await stat(file)).isDirectory()) file += "/index.html";
      const body = await readFile(file);
      res.writeHead(200, {
        "Content-Type": types[extname(file)] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  });
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  return {
    url: `http://127.0.0.1:${server.address().port}${prefix}`,
    close: () => new Promise((done) => server.close(done)),
  };
}
