import { NextResponse } from "next/server";
import { COOKIE, checkPassword, cookieOptions, createToken, getSecret } from "@/lib/auth";

// Enlace de acceso personal: se abre una vez y el dispositivo queda reconocido, sin escribir nada.
export async function GET(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const secret = getSecret();
  const user = checkPassword(decodeURIComponent(token));
  if (!secret || !user) return NextResponse.redirect(new URL("/login?e=link", req.url), 303);
  const res = NextResponse.redirect(new URL("/", req.url), 303);
  res.cookies.set(COOKIE, await createToken(user, secret), cookieOptions);
  return res;
}
