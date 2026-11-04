import assert from "node:assert/strict";
import { chromium, webkit } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { startPreview } from "./preview-server.mjs";

const report = {
  target: "dist/ served under /preview/hamster-hub/",
  checks: [],
  limitations: [],
};
// Outputs go to scratch space; they are evidence for the run, not shipped files.
const out = "test/scratch/validation";
const shots = `${out}/screenshots`;
await mkdir(shots, { recursive: true });
const preview = await startPreview();
let failures = 0;
const check = (name, passed, detail = "") => {
  report.checks.push({ name, passed, detail });
  if (!passed) failures++;
  console.log(
    `${passed ? "PASS" : "FAIL"} ${name}${detail ? `: ${detail}` : ""}`,
  );
};
async function verify(name, fn) {
  try {
    const detail = await fn();
    check(name, true, detail || "");
  } catch (e) {
    check(name, false, e.message.slice(0, 1500));
  }
}
try {
  for (const [browserName, browserType] of Object.entries({
    chromium,
    webkit,
  })) {
    let browser;
    try {
      browser = await browserType.launch({
        headless: true,
        args: browserName === "chromium" ? ["--no-sandbox"] : [],
      });
    } catch (e) {
      report.limitations.push(`${browserName}: ${e.message.slice(0, 1200)}`);
      console.log(
        `UNAVAILABLE ${browserName}: ${e.message.split("\n").slice(0, 4).join(" ")}`,
      );
      continue;
    }
    try {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      page.setDefaultTimeout(5000);
      page.setDefaultNavigationTimeout(10000);
      const errors = [],
        badRequests = [],
        external = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("response", (r) => {
        if (r.status() >= 400) badRequests.push(`${r.status()} ${r.url()}`);
      });
      await page.route("**/*", (route) => {
        const url = route.request().url();
        if (
          url.startsWith(preview.url) ||
          url.startsWith("data:") ||
          url.startsWith("about:")
        )
          return route.continue();
        external.push(url);
        return route.abort();
      });
      const name = (label) => `${browserName} · ${label}`;
      await page.goto(preview.url);
      await page.evaluate(() => document.fonts.ready);
      await verify(name("390px first screen"), async () => {
        const cta = page.getByRole("link", {
          name: "Play Nut Dash",
          exact: true,
        });
        const box = await cta.boundingBox();
        assert.ok(box && box.y >= 0 && box.y + box.height < 844);
        assert.equal(await page.locator("h1").count(), 1);
        assert.ok(await page.locator("h1").isVisible());
        return `Play Nut Dash bottom ${Math.round(box.y + box.height)}px; viewport 844px`;
      });
      await verify(
        name("mobile navigation + Escape focus return"),
        async () => {
          const menu = page.locator(".menu-toggle");
          await menu.click();
          assert.equal(await menu.getAttribute("aria-expanded"), "true");
          assert.ok(
            await page
              .getByRole("navigation")
              .getByRole("link", { name: "Directory" })
              .isVisible(),
          );
          await page.keyboard.press("Escape");
          assert.equal(await menu.getAttribute("aria-expanded"), "false");
          assert.ok(await menu.evaluate((el) => el === document.activeElement));
          await menu.click();
          await page
            .getByRole("navigation")
            .getByRole("link", { name: "Directory" })
            .click();
          await page
            .getByRole("heading", {
              name: "Hamster and IMD project directory",
            })
            .waitFor();
          assert.equal(
            await page
              .locator("main")
              .evaluate((el) => el === document.activeElement),
            true,
          );
          assert.equal(await menu.getAttribute("aria-expanded"), "false");
        },
      );
      await verify(
        name("directory search, category filters, empty recovery"),
        async () => {
          assert.equal(await page.locator(".project-card").count(), 8);
          await page
            .getByRole("button", { name: "Tools 2", exact: true })
            .click();
          assert.equal(await page.locator(".project-card").count(), 2);
          await page
            .getByRole("searchbox", { name: "Find a project" })
            .fill("not-a-real-project");
          await page
            .getByRole("heading", { name: "No resources found." })
            .waitFor();
          await page.getByRole("button", { name: "Clear filters" }).click();
          assert.equal(await page.locator(".project-card").count(), 8);
          await page
            .getByRole("searchbox", { name: "Find a project" })
            .fill("Hamster");
          assert.equal(await page.locator(".project-card").count(), 2);
          await page
            .getByRole("searchbox", { name: "Find a project" })
            .fill("");
        },
      );
      await verify(
        name("saved links, persistence, and empty state"),
        async () => {
          await page
            .getByRole("button", { name: "Save Hamster Hour", exact: true })
            .click();
          assert.equal(
            await page
              .getByRole("button", { name: "Unsave Hamster Hour", exact: true })
              .getAttribute("aria-pressed"),
            "true",
          );
          await page
            .getByRole("button", { name: "Saved (1)", exact: true })
            .click();
          assert.equal(await page.locator(".project-card").count(), 1);
          await page.reload();
          await page
            .getByRole("button", { name: "Saved (1)", exact: true })
            .waitFor();
          await page
            .getByRole("button", { name: "Saved (1)", exact: true })
            .click();
          assert.equal(await page.locator(".project-card").count(), 1);
          await page
            .getByRole("button", { name: "Unsave Hamster Hour", exact: true })
            .click();
          await page
            .getByRole("heading", { name: "Your stash starts here." })
            .waitFor();
          await page.getByRole("button", { name: "Clear filters" }).click();
          await page
            .getByRole("button", { name: "Save Hamster Hour", exact: true })
            .click();
        },
      );
      await verify(
        name("links have useful destinations and safe new tabs"),
        async () => {
          const links = await page
            .locator(".project-card h3 a")
            .evaluateAll((nodes) =>
              nodes.map((a) => ({ url: a.href, target: a.target, rel: a.rel })),
            );
          assert.equal(links.length, 8);
          for (const link of links) {
            assert.ok(link.url.startsWith("https://"));
            assert.equal(link.target, "_blank");
            assert.ok(link.rel.includes("noopener"));
          }
        },
      );
      await verify(
        name("keyboard and touch game controls, pause, score, finish, replay"),
        async () => {
          await page.goto(`${preview.url}#/arcade`);
          await page.clock.install({ time: new Date("2026-11-05T00:00:00Z") });
          await page.clock.pauseAt(new Date("2026-11-05T00:00:01Z"));
          // Controlled game RNG makes the end-to-end catch reproducible; no production code is changed.
          await page.evaluate(() => {
            Math.random = () => 0.5;
          });
          const field = page.getByRole("group", { name: "Nut Dash playfield" });
          const start = page.getByRole("button", {
            name: "Start game",
            exact: true,
          });
          const startBox = await start.boundingBox();
          assert.ok(
            startBox && startBox.y + startBox.height < 844,
            "Start game must be on first phone screen",
          );
          await start.click();
          assert.equal(await field.getAttribute("data-state"), "playing");
          assert.ok(
            await field.evaluate((el) => el === document.activeElement),
          );
          await page.keyboard.press("ArrowLeft");
          assert.equal(await field.getAttribute("data-lane"), "0");
          await page.keyboard.press("ArrowRight");
          assert.equal(await field.getAttribute("data-lane"), "1");
          await page
            .getByRole("button", { name: "Move right", exact: true })
            .click();
          assert.equal(await field.getAttribute("data-lane"), "2");
          await page
            .getByRole("button", { name: "Move left", exact: true })
            .click();
          assert.equal(await field.getAttribute("data-lane"), "1");
          await page.clock.runFor(2800);
          assert.ok(
            Number(await page.getByTestId("score").innerText()) > 0,
            "Catching must increase the score",
          );
          if (browserName === "chromium")
            await page.screenshot({
              path: `${shots}/game-active-390.png`,
              fullPage: true,
            });
          await page
            .getByRole("button", { name: "Pause game", exact: true })
            .click();
          const pausedTime = await page.locator(".game-time").innerText();
          await page.clock.runFor(5000);
          assert.equal(
            await page.locator(".game-time").innerText(),
            pausedTime,
          );
          assert.equal(await field.getAttribute("data-state"), "paused");
          await page
            .getByRole("button", { name: "Keep playing", exact: true })
            .click();
          assert.equal(await field.getAttribute("data-state"), "playing");
          await page.keyboard.press("p");
          assert.equal(await field.getAttribute("data-state"), "paused");
          await page.keyboard.press("Escape");
          assert.equal(await field.getAttribute("data-state"), "playing");
          await page.clock.runFor(28000);
          assert.equal(await field.getAttribute("data-state"), "over");
          const result = Number(await page.getByTestId("score").innerText());
          assert.ok(result > 0);
          assert.ok(
            await page
              .getByRole("button", { name: "Play again", exact: true })
              .evaluate((el) => el === document.activeElement),
          );
          const stats = await page.evaluate(() =>
            JSON.parse(localStorage.getItem("hamster-hub:stats")),
          );
          assert.equal(stats.rounds, 1);
          assert.equal(stats.best, result);
          assert.equal(stats.nuts, result / 10);
          await page
            .getByRole("button", { name: "Play again", exact: true })
            .click();
          assert.equal(await field.getAttribute("data-state"), "playing");
          assert.equal(await page.getByTestId("score").innerText(), "0");
          // A second round of rocks exercises the loss screen and keeps the previous best.
          await page.evaluate(() => {
            Math.random = () => 0.1;
          });
          await page.keyboard.press("ArrowLeft");
          await page.clock.runFor(7000);
          assert.equal(await field.getAttribute("data-state"), "over");
          await page.getByRole("heading", { name: "Out of hearts!" }).waitFor();
          const afterLoss = await page.evaluate(() =>
            JSON.parse(localStorage.getItem("hamster-hub:stats")),
          );
          assert.equal(afterLoss.rounds, 2);
          assert.equal(afterLoss.best, result);
          assert.deepEqual(afterLoss.recent, [0, result]);
          await page.clock.resume();
          return `${result} points saved once; timer holds while paused; replay resets score`;
        },
      );
      await verify(
        name("dashboard shows sourced Hamster Hour facts and local results"),
        async () => {
          await page.goto(`${preview.url}#/dashboard`);
          await page
            .getByRole("heading", { name: "Dashboard", exact: true })
            .waitFor();
          const nums = await page.locator(".stat-number").allTextContents();
          assert.equal(nums[0], "8");
          assert.equal(nums[1], "1");
          assert.ok(Number(nums[2]) > 0);
          assert.ok(Number(nums[3]) > 0);
          await page
            .getByRole("heading", { name: "Hamster Hour at a glance" })
            .waitFor();
          assert.equal(await page.locator(".fact-row").count(), 6);
          const facts = await page.locator(".fact-row").evaluateAll((rows) =>
            rows.map((row) => ({
              label: row.querySelector("dt").textContent,
              links: [...row.querySelectorAll("a")].map((a) => ({
                url: a.href,
                target: a.target,
                rel: a.rel,
                text: a.textContent,
              })),
            })),
          );
          for (const fact of facts) {
            assert.ok(
              fact.links.some((l) => l.text.startsWith("Source:")),
              `${fact.label} needs a source link`,
            );
            for (const link of fact.links) {
              assert.ok(link.url.startsWith("https://"));
              assert.equal(link.target, "_blank");
              assert.ok(link.rel.includes("noopener"));
            }
          }
          assert.match(
            await page.locator(".resource-map").innerText(),
            /0x8e7c7936b4f2d4475dc4bacd174dc228d4d24e86[\s\S]*0x82f636a92364d13754d7b3e72d460f0be20a28cc/,
          );
          assert.equal(
            await page.locator(".saved-section .project-card").count(),
            1,
          );
          assert.equal(await page.locator(".recent-scores li").count(), 2);
          assert.ok(
            await page.getByText("1 round ago", { exact: true }).isVisible(),
          );
          assert.match(
            await page.locator(".dashboard-note").innerText(),
            /No live blockchain feed/,
          );
        },
      );
      await verify(name("FAQ disclosure and hash reload"), async () => {
        await page.goto(`${preview.url}#/about`);
        await page.reload();
        await page
          .getByText("Where do dashboard numbers come from?", { exact: true })
          .click();
        assert.equal(
          await page
            .locator(".about-details details")
            .nth(1)
            .getAttribute("open"),
          "",
        );
        await page
          .getByText("Where do dashboard numbers come from?", { exact: true })
          .click();
        assert.equal(
          await page
            .locator(".about-details details")
            .nth(1)
            .getAttribute("open"),
          null,
        );
      });
      // Every route and representative width, including the two content-driven intermediate layouts.
      for (const width of [320, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        for (const route of [
          "home",
          "dashboard",
          "arcade",
          "directory",
          "about",
        ]) {
          await verify(name(`${route} reflows at ${width}px`), async () => {
            await page.goto(`${preview.url}#/${route}`);
            await page.evaluate(async () => {
              await document.fonts.ready;
              await Promise.all(
                [...document.images].map((img) =>
                  img.complete
                    ? Promise.resolve()
                    : new Promise((resolve) => {
                        img.addEventListener("load", resolve, { once: true });
                        img.addEventListener("error", resolve, { once: true });
                      }),
                ),
              );
            });
            const metrics = await page.evaluate(() => ({
              width: document.documentElement.clientWidth,
              scroll: document.documentElement.scrollWidth,
              headings: document.querySelectorAll("main h1").length,
              broken: [...document.images]
                .filter((i) => !i.complete || !i.naturalWidth)
                .map((i) => i.src),
            }));
            assert.ok(
              metrics.scroll <= metrics.width,
              `overflow ${metrics.scroll} > ${metrics.width}`,
            );
            assert.equal(metrics.headings, 1);
            assert.deepEqual(metrics.broken, []);
            if (
              browserName === "chromium" &&
              ((width === 390 &&
                ["home", "arcade", "directory", "dashboard"].includes(route)) ||
                (width === 1440 &&
                  ["home", "dashboard", "arcade"].includes(route)))
            )
              await page.screenshot({
                path: `${shots}/${route}-${width}.png`,
                fullPage: true,
              });
          });
        }
      }
      await page.setViewportSize({ width: 390, height: 844 });
      for (const route of ["home", "dashboard", "arcade", "directory", "about"])
        await verify(name(`${route} axe accessibility scan`), async () => {
          await page.goto(`${preview.url}#/${route}`);
          const scan = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
            .analyze();
          assert.deepEqual(
            scan.violations.map((v) => ({
              id: v.id,
              impact: v.impact,
              targets: v.nodes.map((n) => n.target),
            })),
            [],
          );
          return `${scan.passes.length} rules passed; ${scan.incomplete.length} rules require manual review`;
        });
      await verify(
        name("fonts load, reduced motion, and keyboard focus"),
        async () => {
          await page.goto(preview.url);
          await page.evaluate(() => document.fonts.ready);
          const fonts = await page.evaluate(() =>
            [...document.fonts].map((f) => ({
              family: f.family,
              status: f.status,
            })),
          );
          assert.equal(fonts.filter((f) => f.status === "loaded").length, 2);
          await page.keyboard.press("Tab");
          assert.equal(
            await page.evaluate(() => document.activeElement.className),
            "skip-link",
          );
          await page.keyboard.press("Enter");
          assert.equal(
            await page.evaluate(() => document.activeElement.id),
            "main",
          );
          await page.keyboard.press("Tab");
          const focus = await page.evaluate(() => ({
            text: document.activeElement.textContent,
            style: getComputedStyle(document.activeElement).outlineStyle,
            width: getComputedStyle(document.activeElement).outlineWidth,
            animations: document
              .getAnimations()
              .filter((a) => a.playState === "running").length,
          }));
          assert.equal(focus.style, "solid");
          assert.equal(focus.width, "3px");
          assert.equal(focus.animations, 0);
          if (browserName === "chromium")
            await page.screenshot({ path: `${shots}/focus-390.png` });
          return JSON.stringify(fonts);
        },
      );
      for (const route of ["home", "dashboard", "arcade", "directory", "about"])
        await verify(
          name(`${route} 200% text enlargement reflows`),
          async () => {
            await page.setViewportSize({ width: 390, height: 844 });
            await page.goto(preview.url + "#/" + route);
            await page.addStyleTag({
              content: "html{font-size:32px!important}",
            });
            await page.evaluate(() => document.fonts.ready);
            const metrics = await page.evaluate(() => ({
              scroll: document.documentElement.scrollWidth,
              width: document.documentElement.clientWidth,
            }));
            assert.ok(
              metrics.scroll <= metrics.width,
              `${metrics.scroll}px exceeds ${metrics.width}px`,
            );
            if (route === "arcade") {
              const clipped = await page
                .locator(".game-message")
                .evaluate((el) => {
                  const p = el.parentElement.getBoundingClientRect(),
                    r = el.getBoundingClientRect();
                  return r.top < p.top || r.bottom > p.bottom;
                });
              assert.equal(
                clipped,
                false,
                "Enlarged game instructions must fit the playfield",
              );
            }
            if (browserName === "chromium" && route === "home")
              await page.screenshot({
                path: `${shots}/text-200-390.png`,
                fullPage: true,
              });
          },
        );
      check(
        name("no script, local resource, or external dependency failures"),
        errors.length === 0 &&
          badRequests.length === 0 &&
          external.length === 0,
        JSON.stringify({ errors, badRequests, externalRequests: external }),
      );
      const blockedContext = await browser.newContext({
        viewport: { width: 390, height: 844 },
      });
      await blockedContext.addInitScript(() => {
        Storage.prototype.setItem = () => {
          throw new DOMException("Storage denied", "SecurityError");
        };
      });
      const blockedPage = await blockedContext.newPage();
      await verify(name("storage-denied recovery"), async () => {
        await blockedPage.goto(`${preview.url}#/directory`);
        await blockedPage
          .getByRole("button", { name: "Save Hamster Hour", exact: true })
          .click();
        await blockedPage
          .getByText(
            "Browser storage is unavailable. Your stash lasts for this visit only.",
          )
          .waitFor();
        await blockedPage
          .getByRole("button", { name: "Saved (1)", exact: true })
          .click();
        assert.equal(await blockedPage.locator(".project-card").count(), 1);
        await blockedPage
          .getByRole("button", { name: "Dismiss storage notice" })
          .click();
        assert.equal(await blockedPage.locator(".storage-notice").count(), 0);
      });
      await blockedContext.close();
      await context.close();
    } finally {
      await browser.close();
    }
  }
} finally {
  await preview.close();
  report.summary = {
    passed: report.checks.filter((c) => c.passed).length,
    failed: failures,
  };
  report.limitations.push(
    "Browser emulation is not a physical-device or screen-reader test. 200% text enlargement is not native browser zoom. External links were verified as destinations, not transactions or endorsements.",
  );
  await writeFile(
    `${out}/browser-validation.json`,
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify(report.summary));
}
process.exitCode = failures ? 1 : 0;
