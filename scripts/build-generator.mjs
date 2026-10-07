// Arma lib/generator-html.ts desde generator/template.html, incrustando las tipografías y el logo.
// Las tipografías están cifradas en el repo (generator/fonts/*.woff2.enc) y se descifran aquí con
// FONTS_KEY (variable de entorno de Netlify). El resultado solo vive en el servidor y la página
// solo se entrega a usuarios con sesión, así que ningún archivo de fuente queda público.
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
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
const names = [...new Set(readdirSync(fontsDir).filter((f) => /\.woff2(\.enc)?$/.test(f)).map((f) => f.replace(/\.woff2(\.enc)?$/, "")))];
for (const name of names) html = html.split(`__${name}__`).join(fontBytes(name).toString("base64"));
html = html.replace("__LOGO__", readFileSync(join(root, "generator/logo.json"), "utf8").trim());
const left = html.match(/__[A-Za-z-]+__/);
if (left) throw new Error(`Placeholder sin reemplazar en el generador: ${left[0]}`);
writeFileSync(join(root, "lib/generator-html.ts"), `// Archivo generado por scripts/build-generator.mjs. No editar.\nconst html: string = ${JSON.stringify(html)};\nexport default html;\n`);
console.log(`Generador listo (${(html.length / 1024).toFixed(0)} KB, ${names.length} tipografías)`);
