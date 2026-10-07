// Sesión firmada con HMAC (Web Crypto, funciona en el proxy y en las rutas).
export const COOKIE = "k4r_session";
export const SESSION_DAYS = 90;

const enc = new TextEncoder();

function b64url(buf: ArrayBuffer): string {
  let s = "";
  new Uint8Array(buf).forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export function getSecret(): string | null {
  const s = process.env.AUTH_SECRET;
  return s && s.length >= 16 ? s : null;
}

export async function createToken(user: string, secret: string): Promise<string> {
  const payload = `${encodeURIComponent(user)}.${Date.now() + SESSION_DAYS * 864e5}`;
  return `${payload}.${await sign(payload, secret)}`;
}

export async function verifyToken(token: string | undefined, secret: string | null): Promise<string | null> {
  if (!token || !secret) return null;
  const i = token.lastIndexOf(".");
  if (i < 0) return null;
  const payload = token.slice(0, i), sig = token.slice(i + 1);
  const [user, exp] = payload.split(".");
  if (!user || !exp || Number(exp) < Date.now()) return null;
  return safeEqual(sig, await sign(payload, secret)) ? decodeURIComponent(user) : null;
}

// APP_USERS="julio:clave,mandri:otra-clave"  (o APP_PASSWORD="clave" para un solo usuario)
export function checkPassword(password: string): string | null {
  const users = (process.env.APP_USERS || "")
    .split(",").map((p) => p.trim()).filter(Boolean)
    .map((p) => { const j = p.indexOf(":"); return [p.slice(0, j), p.slice(j + 1)] as const; });
  if (process.env.APP_PASSWORD) users.push(["julio", process.env.APP_PASSWORD]);
  for (const [user, pass] of users) if (pass && safeEqual(password, pass)) return user || "usuario";
  return null;
}
