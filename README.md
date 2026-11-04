# Hamster Hub

A pixel-art companion for exploring Hamster and the IMD ecosystem. Play a quick game, find useful resources, and keep a personal collection of project links.

## What works

- **Home:** original pixel artwork, direct access to Nut Dash, featured resources, and navigation to every tool.
- **Dashboard:** resource count, published Hamster Hour facts with their sources, saved projects, personal best, total acorns, and the last five completed rounds. The facts are dated, not a live feed. All personal activity is local to the current browser.
- **Nut Dash:** a three-lane, 30-second arcade game. Catch acorns for 10 points; rocks cost one of three hearts. Move with Left/Right, A/D, or the touch buttons. Pause with P, Escape, or the pause button. Replay after either time runs out or all hearts are lost. Leaving the tab pauses play.
- **Directory:** eight sourced resources, text search, category filters, saved-only filtering, and recoverable empty states.
- **About:** an introduction to Hamster and IMD, data provenance, and practical FAQs.

There is no wallet connection, transaction flow, token deployment, shared leaderboard, analytics, or backend. Game points have no financial value. The dashboard does not display fabricated prices, balances, or live blockchain statistics.

## Install, develop, and preview

Use Node.js 22.12 or newer; Node.js 24 was used for this build. Versions are pinned in `package-lock.json`.

```sh
npm ci
npm run dev
```

To rebuild and preview the production export:

```sh
npm run typecheck
npm run build
npm run preview
```

Open the local URL Vite prints. Preview through HTTP, rather than opening `index.html` as a local file. The ready-to-serve export is **`dist/index.html` plus the rest of `dist/`**. Fonts, artwork, favicon, and share image are bundled locally.

## Static hosting and IPFS

`vite.config.ts` sets `base: "./"`. Navigation uses hash routes, so gateways do not need server rewrites. An earlier export was exercised under `/preview/hamster-hub/`, including its fonts and dynamic images; the current export has not been.

IdentityMD's publishing pipeline pins the delivered `dist/` directory to IPFS after submission. That publication is **after this local build**; no public CID, gateway URL, or completed pin is claimed here. Publish the directory as a unit, with `index.html` at its root. The supplied relative `og:image` can be made absolute once the publisher assigns the final URL.

## Checks and actual results

**The current `dist/` has not been built, tested, or opened in a browser.** In the latest revision the worker's shell failed to start ("Sandbox is required but failed to initialize: Failed to create bridge sockets after 5 attempts") and the browser tool had no Chrome installed, so `npm`, Vite, `tsc`, and the taste probe could not run. `dist/` had gone stale against `src/`, so it was corrected by hand instead:

- `dist/assets/index-CFvpd2iV.css`: added the `.fact-*` rules from `src/styles.css`, including the 820px `.fact-row` rule, and removed rules for classes the source no longer uses.
- `dist/assets/index-Coz8Y3Ax.js`: changed the Arcade title to `Nut Dash`.

The bundle's app code was compared by reading it against `src/`; that title was the only difference found. Both filenames keep their old content hashes, because files could not be renamed or deleted. To replace the hand edits with a real build, run:

```sh
npm ci && npm run typecheck && npm run build && npm test && npm run check:export && npm run validate:browser
```

The results below were recorded in an earlier round and **do not cover the current export**. They are kept as history:

| Command | Result |
| --- | --- |
| `npm run typecheck` | Passed |
| `npm run build` | Passed; 13 production files, 392,688 bytes |
| `npm test` | 8 engine tests passed |
| `npm run check:export` | Passed; metadata, local relative assets, and 1200×630 PNG checked |
| `npm run validate:browser` | 46 Chromium checks passed, 0 failed; WebKit unavailable |
| Pinned `taste.mjs --out test/scratch/taste --offline` | All 16 checks passed |

That earlier browser validation covered navigation, focus return, search and filters, save/unsave persistence, empty recovery, keyboard and touch game controls, pause/resume, scoring, timed completion, losing all hearts, replay, stored history, five-page reflow at 320/390/768/1024/1440px, 200% text enlargement, and storage-denied recovery. Axe scans reported zero violations on all five routes. No script errors, failed local resources, or external runtime requests were observed.

To rerun browser checks on a machine with supported browser libraries:

```sh
npx playwright install chromium webkit
npm run validate:browser
```

If the browser libraries are missing, install Playwright's OS dependencies on that machine. The script records unavailable engines separately; a skipped engine is not a pass. The worker used `PLAYWRIGHT_BROWSERS_PATH="$PWD/test/scratch/browsers"` to keep downloaded browsers in scratch space. The pinned taste probe is an assignment input, not a build dependency.

WebKit/Safari, physical devices, a screen-reader session, and native browser zoom remain unverified. Nut Dash is a visual timed game; its falling items are not individually narrated. Text enlargement is checked separately from native zoom.

## Better Interface review

The earlier six-domain review's detailed report and screenshots are not in this repository; only the summaries in this README and `DESIGN.md` remain. The latest revision re-reviewed only the dashboard facts and the Arcade heading, by reading the code. Every rendered check is unperformed, including contrast, overflow, and screenshots.

| Domain | Coverage and findings |
| --- | --- |
| Accessibility | Facts use `dl`/`dt`/`dd` (`src/App.tsx:479`). External links announce new tabs (`src/App.tsx:96`). Touch targets rise to 44px on coarse pointers (`src/styles.css:911`). No new finding. |
| Layout | **Fixed:** the address-wrapping and link-row rules (`src/styles.css:887`, `:893`) were missing from `dist/`, which overflowed 320px and 390px screens according to the reviewer's measurements. The fix is not yet re-measured. |
| Writing | **Fixed:** the Arcade `h1` in `dist/` still used old copy; it now matches `src/App.tsx:602`. |
| Typography | Facts use the existing `--text-small` token, so no size was added. Addresses use a system monospace stack (`src/styles.css:888`). No new finding. |
| Colors | Facts use existing text and border tokens. Contrast was not re-measured. |
| UI | **Open, low:** `.fact-link:hover` (`src/styles.css:908`) is not gated by `(hover: hover)` like the other hover rules, so the color can stick after a tap. Left unchanged to keep this revision to the reported defects. |

## Data and editing

The brief did not identify a canonical Hamster domain. This companion uses **Hamster Hour**, whose IMD connection is documented in its [published project source](https://github.com/identity-md-launches/launch-2336-hamster-hour), rather than treating unrelated Hamster-branded projects as one network.

Resource links and descriptions live in `src/data.ts`. Their primary references are [IMD](https://imd.fun/), [its documentation](https://imd.fun/docs/), [Awesome IMD](https://github.com/Identity-md/awesome-imd), and the [Hamster Hour source](https://github.com/identity-md-launches/launch-2336-hamster-hour). Each card links to its source. A listing is not a safety rating or endorsement, and destination availability can change. The Hamster Hour frontend could not be retrieved by the research tool; its published source establishes the destination, not current frontend availability.

The only persistent keys are `hamster-hub:saved` and `hamster-hub:stats`. Clear this site's browser data to reset them. If storage is blocked, play and saving still work for the current visit. Results are not synchronized across tabs or devices.

## Structure and artwork

- `src/App.tsx`: hash navigation and the five pages.
- `src/components/`: game UI, project cards, and the shared SVG icon set.
- `src/game/engine.ts`: pure game simulation; covered by `scripts/test-engine.mjs`.
- `src/styles.css`: actual design tokens and responsive styles; documented in [DESIGN.md](DESIGN.md).
- `public/`: locally bundled runtime assets, copied to `dist/` by Vite.
- `scripts/`: reproducible build checks, browser validation, and original art generators.

`npm run art:generate` regenerates the original SVG sprites and valley using Python 3. `npm run art:share` regenerates the PNG share card with Playwright Chromium. Rebuild after changing either asset. Font licenses and design-guidance credits are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Submission size and ignore budget

The total added submission must stay below 8,388,608 bytes. Explicit path budgets: `.gitignore` 512 B; `src/` 128 KiB; `scripts/` 128 KiB; `public/` 256 KiB; `dist/` 1 MiB; root documentation/configuration/lockfile 512 KiB; `licenses/` 64 KiB.

`.gitignore` is 260 bytes. Dependency directories, package caches, build caches, browser reports, and `test/scratch/` have a **zero submitted-byte budget**, including nested dependency/cache directories. `dist/` is deliberately included. No dependency archive, registry mirror, or git submodule is part of this delivery.
