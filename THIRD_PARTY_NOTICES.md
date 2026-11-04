# Third-party notices

## Fonts

The local font subsets are redistributed under the SIL Open Font License 1.1, with complete copyright and license text beside the font files (also copied into the production export):

- **DM Sans** — Copyright 2014 The DM Sans Project Authors. Source: https://github.com/googlefonts/dm-fonts. License: `public/fonts/OFL-dmsans.txt`.
- **Pixelify Sans** — Copyright 2021 The Pixelify Sans Project Authors. Source: https://github.com/eifetx/Pixelify-Sans. License: `public/fonts/OFL-pixelifysans.txt`.

The WOFF2 Latin variable subsets were obtained from Google's font distribution. The art, SVG interface icon paths, and game sprites were created for this project; no third-party art is embedded.

## Design guidance and documentation method

The implementation and review were informed by Jakub Krehel's **Better Interface**, MIT, pinned commit `267330e1adfc66a718fb65fa6918c1f06d0a689e`: https://github.com/jakubkrehel/skills/tree/267330e1adfc66a718fb65fa6918c1f06d0a689e/skills/better-interface.

The design documentation structure follows the adapted **Impeccable** documentation method by Paul Bakaus, Apache-2.0, pinned commit `9d715cc4f5564a990ca8345abfdd5df6dc9b41c8`: https://github.com/pbakaus/impeccable/blob/9d715cc4f5564a990ca8345abfdd5df6dc9b41c8/skill/reference/document.md. It has been applied and rewritten specifically for the implemented Hamster Hub source.

Both complete license texts are preserved in `licenses/design-guidance.txt`. These are separate works and retain their original licenses.

## Software

Runtime: React and React DOM. Build/validation: Vite, TypeScript, Playwright, and axe-core. Exact versions and dependency metadata are in `package-lock.json`; package licenses are distributed with installed packages. Dependency directories and package caches are not part of the submission.
