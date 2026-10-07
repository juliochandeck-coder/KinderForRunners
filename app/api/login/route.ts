import { NextResponse } from "next/server";
import { COOKIE, SESSION_DAYS, checkPassword, createToken, getSecret } from "@/lib/auth";

export async function POST(req: Request) {
  const secret = getSecret();
  const back = (q: string) => NextResponse.redirect(new URL(`/login${q}`, req.url), 303);
  if (!secret || !(process.env.APP_USERS || process.env.APP_PASSWORD)) return back("?e=config");
  const form = await req.formData();
  const user = checkPassword(String(form.get("password") || ""));
  if (!user) {
    await new Promise((r) => setTimeout(r, 700)); // frena intentos repetidos
    return back("?e=1");
  }
  const res = NextResponse.redirect(new URL("/", req.url), 303);
  res.cookies.set(COOKIE, await createToken(user, secret), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_DAYS * 86400,
  });
  return res;
}
