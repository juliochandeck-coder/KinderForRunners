import { cookies } from "next/headers";
import { COOKIE, getSecret, tokenForUser, verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

// La app instalada abre con el enlace personal de quien la instaló, así nunca pide clave
// (en iPhone la app de inicio guarda sus cookies aparte de Safari).
export async function GET() {
  const user = await verifyToken((await cookies()).get(COOKIE)?.value, getSecret());
  const token = user ? tokenForUser(user) : null;
  const manifest = {
    name: "Workouts K4R",
    short_name: "Workouts K4R",
    description: "Generador de artes de rutinas de Kinder for Runners",
    start_url: token ? `/k/${encodeURIComponent(token)}` : "/",
    scope: "/",
    display: "standalone",
    background_color: "#141211",
    theme_color: "#ef5026",
    lang: "es",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
  return new Response(JSON.stringify(manifest), {
    headers: { "Content-Type": "application/manifest+json", "Cache-Control": "private, no-store" },
  });
}
