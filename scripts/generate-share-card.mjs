import { chromium } from "playwright";
import { readFile } from "node:fs/promises";
const data = async (path, mime) =>
  `data:${mime};base64,${(await readFile(path)).toString("base64")}`;
const pixel = await data("public/fonts/pixelify-latin.woff2", "font/woff2");
const sans = await data("public/fonts/dm-sans-latin.woff2", "font/woff2");
const hamster = await data("public/art/hamster.svg", "image/svg+xml");
const valley = await data("public/art/valley.svg", "image/svg+xml");
const acorn = await data("public/art/acorn.svg", "image/svg+xml");
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(
    `<!doctype html><style>@font-face{font-family:Pixel;src:url(${pixel});font-weight:400 700}@font-face{font-family:DM;src:url(${sans});font-weight:400 700}*{box-sizing:border-box}body{margin:0;background:#f8f3e9;color:#35291f;font-family:DM}header{display:flex;gap:12px;align-items:center;margin:48px 56px;font-family:Pixel;font-size:32px;font-weight:600}header img{width:48px;image-rendering:pixelated}.layout{display:flex;margin:40px 56px;align-items:center;gap:30px}.text{width:540px}h1{font-family:Pixel;font-size:64px;line-height:1.05;font-weight:600;margin:0 0 22px}h1 span{color:#a54b22}p{font-size:20px;line-height:1.5;max-width:430px}.cta{margin-top:28px;display:inline-block;background:#f49b54;padding:16px 24px;font-size:18px;font-weight:600;border-radius:4px}.scene{position:relative;width:540px;height:350px}.valley{width:100%;height:100%;object-fit:cover;image-rendering:pixelated}.hamster{position:absolute;width:172px;left:160px;bottom:50px;image-rendering:pixelated}.acorn{position:absolute;width:52px;left:122px;top:66px;transform:rotate(-20deg);image-rendering:pixelated}footer{position:absolute;bottom:34px;left:56px;right:56px;border-top:1px solid #ded2bf;padding-top:20px;color:#665442;font-size:16px}</style><header><img src="${hamster}"/>Hamster Hub.</header><div class="layout"><div class="text"><h1>Small paws.<br/><span>Big possibilities.</span></h1><p>Your cozy companion to Hamster and IMD.</p><div class="cta">Play Nut Dash &nbsp; →</div></div><div class="scene"><img class="valley" src="${valley}"/><img class="hamster" src="${hamster}"/><img class="acorn" src="${acorn}"/></div></div><footer>A little exploring. A little playing. All Hamster.</footer>`,
  );
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "public/social-card.png", type: "png" });
  console.log("Generated public/social-card.png (1200×630).");
} finally {
  await browser.close();
}
