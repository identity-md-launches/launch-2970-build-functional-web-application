# Hamster Hub design

## Overview

Hamster Hub is a friendly companion for people exploring Hamster and IMD. Its defining visual is an original pixel hamster in an autumn valley. Cream backgrounds, brown text, orange actions, and restrained olive surfaces carry that idea through the directory, local dashboard, and arcade.

The homepage uses a two-column introduction and scene. Tool pages lead with the task, then controls and results. Reuse the shared header, content edges, project cards, action styles, and type scale; the homepage hero is not a required template for every page.

The implemented source of truth is `src/styles.css`, with page composition in `src/App.tsx` and reusable components under `src/components/`.

## Colors

The CSS uses hex primitives and semantic aliases. Use the semantic role in components.

| Semantic token | Value | Actual use |
| --- | --- | --- |
| `--color-bg` | `#f8f3e9` | Cream page and game message background |
| `--color-surface` | `#fffaf2` | Project/stat cards and game toolbar |
| `--color-surface-soft` | `#eee5d6` | Neutral inset controls, tracks, subtle surfaces |
| `--color-text` | `#35291f` | Headings, primary text, orange-button text, dark banner |
| `--color-text-secondary` | `#665442` | Descriptions and secondary labels |
| `--color-text-muted` | `#776550` | Footer copy and secondary icons |
| `--color-border` | `#ded2bf` | Structural dividers and outline controls |
| `--color-accent` | `#f49b54` | Primary action fill |
| `--color-accent-hover` | `#ed873d` | Primary action hover |
| `--color-brand-text` | `#a54b22` | Hero's second line, navigation marker, link hover |
| `--color-focus` | `#245a70` | Explicit keyboard focus indicator |
| `--color-favorite` | `#9d4435` | Filled saved hearts and game lives |

`--orange-100: #f6e4d4` and `--olive-100: #e9ebd9` provide the warm and olive feature surfaces. Pixel-art colors are authored in `scripts/generate-art.py` and `public/art/`; the scene label uses `#4f452e` over the image's `#f2e2bf` sky. The current site has one light theme. The declared `--color-positive` alias is reserved and not rendered as a success state.

Measured browser pairs are recorded in `artifacts/contrast.json`: primary text/page **12.76:1**, secondary/page **6.52:1**, muted/page **5.05:1**, button text/orange **6.49:1**, card text/surface **13.58:1**, scene label/decoded SVG sky **7.38:1**, and focus/page **6.85:1**. These measurements cover the named pairs, not every possible screenshot pixel or browser.

## Typography

Two local variable WOFF2 files are declared at weights 400–700, normal style, with `font-display: swap`:

- `Pixelify Sans`, fallback `sans-serif`: brand, h1/h2, and large dashboard numbers; `public/fonts/pixelify-latin.woff2`.
- `DM Sans`, fallback `sans-serif`: prose, controls, h3, labels, and small numbers; `public/fonts/dm-sans-latin.woff2`.

The final browser check confirmed both font faces loaded. The Latin subset is used; no separate italic face is supplied. The interface uses weights **400, 600, and 700** and does not rely on synthesized styles.

| Token | Default size | Role |
| --- | --- | --- |
| `--text-small` | 14px / .875rem | Captions, card prose, navigation, secondary actions |
| `--text-body` | 16px / 1rem | Main prose, inputs, standard actions |
| `--text-card` | 20px / 1.25rem | Card titles |
| `--text-section` | 28px / 1.75rem | Section headings and header brand |
| `--text-page` | 40px / 2.5rem | Tool-page titles, dashboard numbers, mobile hero |
| `--text-display` | 64px / 4rem | Wide-screen homepage headline |

Body line-height is 1.6; headings default to 1.2, the homepage headline to 1.06 (1.08 on mobile), and page titles to 1.15. Large desktop hero tracking is −.02em; mobile and prose use natural tracking. Paragraphs cap at 68ch, with narrower measures for hero and card copy. Headings balance and allow long words to wrap. Changing counters use tabular numerals. Mobile search inputs remain 16px to avoid unintended iOS input zoom.

## Layout

`.content-width` caps at 1200px. Wide layouts have 48px side margins; these become 32px at 1120px, 20px at 820px, and 16px at 360px. Text and controls share those edges.

The declared spacing reference is 4/8/12/16/24/32/48/64/80px. Current rules express those steps directly, with 20px card gaps and optical/control exceptions such as 10px icon gaps and 44px hit areas. Sections usually separate by 52px on desktop and 36–40px on phones. Cards use 24–28px padding; rounded surfaces use `--radius: 8px`, and buttons use 4px.

| Breakpoint | Implemented behavior |
| --- | --- |
| Above 1440px | Hero gets additional vertical space |
| ≤1120px | 40px hero title; compact header utility; arcade guide moves beneath game |
| ≤820px | Toggle navigation; 72px minimum header; two-column resource cards; tighter dashboard |
| ≤600px | Single-column hero, resource cards, and about content; compact feature rows; stacked arcade guide; two-column dashboard stats retained |
| ≤360px | 16px side margins; compact game toolbar and actions |

At 390px the homepage action's bottom is 303px from the viewport top. The first screen shows the product and main action. Search filters wrap rather than scrolling horizontally. Game controls stay below the scene; mobile controls fill two generous columns. The playfield explicitly uses `width: 100%` plus an 18rem minimum height so text enlargement can increase its height without forcing a wider page. Five routes were checked at 320, 390, 768, 1024, and 1440px; 200% root-text enlargement was checked at 390px. Native zoom and physical devices were not tested.

## Components

- **Header and navigation (`App`)**: real hash links; selected page has an underline and `aria-current`. Mobile uses a disclosure button with `aria-expanded`. Escape closes it and returns focus. Route changes close navigation, reset scroll, and focus the main landmark. A skip link is first in keyboard order.
- **Buttons and links (`.button`, `.text-link`)**: orange fill for the primary action; secondary actions use structural outlines or text with an arrow. External links use an external-link icon and a new-tab accessible label.
- **ProjectCard**: source-linked title, short description, category, source link, and 44px save toggle. Saved state changes both the heart fill and `aria-pressed`. Cards use a flat surface without border-plus-shadow stacking.
- **Directory controls**: a visible search label, native search input, category buttons with pressed states and counts, and a saved-only toggle. Empty results include a working Clear filters action. A stable status region reports result count.
- **Dashboard**: resource totals derive from `PROJECTS`; saved and game totals derive from browser state. The category bars use the same category order as the filters. Recent rounds and saved project cards make the summary inspectable.
- **Game**: a pure simulation (`src/game/engine.ts`) and DOM/SVG UI (`Game`). Ready, playing, paused, timed finish, and out-of-hearts states are implemented. Starting focuses the playfield; finishing focuses Play again. Touch buttons and keyboard controls move between bounded lanes. A polite status announces start/pause/result. The falling game items remain a visual task.
- **Disclosure and notices**: native `details`/`summary` for FAQs and game help. Storage errors explain that the current visit still works, with an explicit dismiss action. There is no modal, wallet picker, network-loading state, or form submission in this product.

## Motion and assets

There are no decorative infinite animations or page-load entrances. Interactive transitions name background/transform properties, last 150ms, and use `--ease: cubic-bezier(.2,0,0,1)`. Press feedback scales buttons to .96 only when reduced motion is not requested. Hover effects are gated by pointer capability. Reduced-motion styles remove transitions and decorative animation; the deliberately started game's falling items still move, and the game has a pause control.

Icons use the original shared `Icon` component, `currentColor`, and a consistent 1.8px stroke. Pixel art uses crisp SVG edges and `image-rendering: pixelated`. `scripts/generate-art.py` reproduces the hamster, acorn, rock, valley, and favicon. `scripts/generate-share-card.mjs` reproduces the 1200×630 PNG. Required assets are local; Vite rewrites font URLs relative to its exported stylesheet.

## Accessibility and maintenance

Keep native buttons/links, their accessible names, the 3px focus perimeter with 4px offset, and reduced-motion handling. Baseline target spacing passed the pinned probe; ten measured links are below the optional 44px comfort target, while primary and save/game controls have larger targets. Forced-colors CSS uses system highlight/button colors, but that mode has not been visually inspected.

Reuse the six text tokens and the two existing fonts. Do not introduce extra kicker labels, unrelated gradients, fabricated live metrics, wallet infrastructure, or cards nested inside cards. Preserve source links and the clear separation between directory information and personal browser activity.

Review evidence, corrected findings, browser limitations, and screenshots are in `artifacts/validation.md`. Design guidance and documentation-method credits are preserved in `THIRD_PARTY_NOTICES.md` and `licenses/design-guidance.txt`.
