// Arma dist/: la app como sitio estático (sin servidor) lista para publicar en Netlify.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
execFileSync(process.execPath, [join(root, "scripts/build-generator.mjs")], { stdio: "inherit" });
const src = readFileSync(join(root, "lib/generator-html.ts"), "utf8");
const marker = "const html: string = ";
const html = JSON.parse(src.slice(src.indexOf(marker) + marker.length, src.indexOf(";\nexport default")));

const out = join(root, "dist");
rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "icons"), { recursive: true });
for (const f of ["icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png"])
  copyFileSync(join(root, "public/icons", f), join(out, "icons", f));
copyFileSync(join(root, "public/manifest.webmanifest"), join(out, "manifest.webmanifest"));
copyFileSync(join(root, "public/sw.js"), join(out, "sw.js"));

const head = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#ef5026"><meta name="robots" content="noindex,nofollow">
<link rel="manifest" href="/manifest.webmanifest"><link rel="icon" href="/icons/icon-192.png">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Workouts K4R">
<style>html{color-scheme:light dark}body{margin:0}img{max-width:100%}[hidden]{display:none!important}:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}</style>
</head><body>`;
writeFileSync(join(out, "index.html"), head + html + "</body></html>");
writeFileSync(join(out, "netlify.toml"), `[build]\n  command = ""\n  publish = "."\n\n[[headers]]\n  for = "/*"\n  [headers.values]\n    X-Robots-Tag = "noindex, nofollow"\n`);
console.log("dist listo");
