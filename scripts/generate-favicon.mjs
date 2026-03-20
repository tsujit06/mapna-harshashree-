/**
 * Builds public/favicon.ico from the REXU logo (multi-size ICO for browsers).
 * Run: node scripts/generate-favicon.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import toIco from "to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "public", "icon.png");
const outIco = path.join(root, "public", "favicon.ico");
const outAppIcon = path.join(root, "src", "app", "icon.png");

async function main() {
  const buf16 = await sharp(src).resize(16, 16).png().toBuffer();
  const buf32 = await sharp(src).resize(32, 32).png().toBuffer();
  const buf48 = await sharp(src).resize(48, 48).png().toBuffer();
  const ico = await toIco([buf16, buf32, buf48]);
  fs.writeFileSync(outIco, ico);
  console.log("Wrote", outIco, "(" + ico.length + " bytes)");
  // Small app/icon.png so Next.js can optimize it (avoid huge 1024px source in /app)
  fs.writeFileSync(outAppIcon, buf48);
  console.log("Wrote", outAppIcon, "(" + buf48.length + " bytes)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
