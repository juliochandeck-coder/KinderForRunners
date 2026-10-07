// Cifra las tipografías con AES-256-GCM para poder guardarlas en el repo sin exponerlas.
// Uso: FONTS_KEY=<64 hex> node scripts/encrypt-fonts.mjs
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createCipheriv, randomBytes } from "node:crypto";

const dir = join(dirname(fileURLToPath(import.meta.url)), "../generator/fonts");
const key = Buffer.from(process.env.FONTS_KEY || "", "hex");
if (key.length !== 32) throw new Error("FONTS_KEY debe tener 64 caracteres hexadecimales");
for (const f of readdirSync(dir).filter((f) => f.endsWith(".woff2"))) {
  const iv = randomBytes(12), c = createCipheriv("aes-256-gcm", key, iv);
  const body = Buffer.concat([c.update(readFileSync(join(dir, f))), c.final()]);
  writeFileSync(join(dir, f + ".enc"), Buffer.concat([iv, c.getAuthTag(), body]));
  console.log("cifrada", f);
}
