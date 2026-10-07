// Arma lib/generator-html.ts desde generator/template.html, incrustando las tipografías y el logo.
// Las tipografías están cifradas en el repo (generator/fonts/*.woff2.enc) y se descifran aquí con
// FONTS_KEY (variable de entorno de Netlify). El resultado solo vive en el servidor y la página
// solo se entrega a usuarios con sesión, así que ningún archivo de fuente queda público.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createDecipheriv } from "node:crypto";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fontsDir = join(root, "generator/fonts");
const key = process.env.FONTS_KEY ? Buffer.from(process.env.FONTS_KEY, "hex") : null;

function fontBytes(name) {
  const plain = join(fontsDir, name + ".woff2");
  if (existsSync(plain)) return readFileSync(plain); // desarrollo local
  if (!key || key.length !== 32) throw new Error("Falta FONTS_KEY (64 caracteres hex) para descifrar las tipografías.");
  const raw = readFileSync(join(fontsDir, name + ".woff2.enc"));
  const d = createDecipheriv("aes-256-gcm", key, raw.subarray(0, 12));
  d.setAuthTag(raw.subarray(12, 28));
  return Buffer.concat([d.update(raw.subarray(28)), d.final()]);
}

let html = readFileSync(join(root, "generator/template.html"), "utf8");

// Pestaña Tiempos: el fragmento (estilos, controles y animación) y sus imágenes, incrustadas como data URIs.
const tDir = join(root, "generator/tiempos");
const dataUri = (file, type) => `data:${type};base64,${readFileSync(join(tDir, file)).toString("base64")}`;
let tiempos = readFileSync(join(root, "generator/tiempos.html"), "utf8");
for (const [ph, file, type] of [
  ["__T-KINDER__", "k4r.png", "image/png"],
  ["__T-HSINK__", "header-hs-ink.png", "image/png"],
  ["__T-HSOR__", "header-hs-orange.png", "image/png"],
  ["__T-HS__", "high-school.png", "image/png"],
  ["__T-TR__", "tiles-top-right.webp", "image/webp"],
  ["__T-BL__", "tiles-bottom-left.webp", "image/webp"],
]) tiempos = tiempos.split(ph).join(dataUri(file, type));
tiempos = tiempos.split("__T-GLYPHS__").join(readFileSync(join(tDir, "bebas-kai-glyphs.json"), "utf8").trim());
html = html.replace("__TIEMPOS__", () => tiempos);

// Tipografías libres (licencia OFL, sin cifrar): generator/fonts-ofl/*.woff2 → __Nombre__
const oflDir = join(root, "generator/fonts-ofl");
for (const f of readdirSync(oflDir).filter((f) => f.endsWith(".woff2")))
  html = html.split(`__${f.replace(/\.woff2$/, "")}__`).join(readFileSync(join(oflDir, f)).toString("base64"));

// Tipografías con licencia (cifradas en el repo). Solo se descifran las que la plantilla todavía usa.
const names = [...new Set(readdirSync(fontsDir).filter((f) => /\.woff2(\.enc)?$/.test(f)).map((f) => f.replace(/\.woff2(\.enc)?$/, "")))];
for (const name of names) if (html.includes(`__${name}__`)) html = html.split(`__${name}__`).join(fontBytes(name).toString("base64"));
html = html.replace("__LOGO__", readFileSync(join(root, "generator/logo.json"), "utf8").trim());
const left = html.match(/__[A-Za-z-]+__/);
if (left) throw new Error(`Placeholder sin reemplazar en el generador: ${left[0]}`);
mkdirSync(join(root, "lib"), { recursive: true });
writeFileSync(join(root, "lib/generator-html.ts"), `// Archivo generado por scripts/build-generator.mjs. No editar.\nconst html: string = ${JSON.stringify(html)};\nexport default html;\n`);
console.log(`Generador listo (${(html.length / 1024).toFixed(0)} KB, ${names.length} tipografías)`);
