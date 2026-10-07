import { cookies } from "next/headers";
import generatorHtml from "@/lib/generator-html";
import { COOKIE, getSecret, verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

const HEAD = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#ef5026">
<meta name="robots" content="noindex,nofollow">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="icon" href="/icons/icon-192.png">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Workouts K4R">
<style>html{color-scheme:light dark}body{margin:0}img{max-width:100%}[hidden]{display:none!important}:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}</style>
</head><body>`;

// El generador (con las tipografías incrustadas) solo se entrega a usuarios con sesión.
export async function GET(req: Request) {
  const user = await verifyToken((await cookies()).get(COOKIE)?.value, getSecret());
  if (!user) return Response.redirect(new URL("/login", req.url), 307);
  return new Response(HEAD + generatorHtml + "</body></html>", {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "private, no-cache" },
  });
}
