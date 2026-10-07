import generatorHtml from "@/lib/generator-html";

export const dynamic = "force-dynamic";

const HEAD = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#ef5026">
<meta name="robots" content="noindex,nofollow">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="icon" href="/icons/icon-192.png">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="K4R Studio">
<style>html{color-scheme:light dark}body{margin:0}img{max-width:100%}[hidden]{display:none!important}:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}</style>
</head><body>`;

export function GET() {
  return new Response(HEAD + generatorHtml + "</body></html>", {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" },
  });
}
