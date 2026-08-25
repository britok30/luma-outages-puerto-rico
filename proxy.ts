import { NextResponse, type NextRequest } from "next/server";
import { LANG_COOKIE, isLang } from "@/lib/lang";

/**
 * Resolves the UI language once per request so `?lang=en` is a real,
 * indexable URL (hreflang) while the cookie keeps the choice on later visits.
 * The resolved value is passed to the layout via the `x-lang` header.
 */
export function proxy(request: NextRequest) {
  const param = request.nextUrl.searchParams.get("lang");
  const cookie = request.cookies.get(LANG_COOKIE)?.value;
  const lang = isLang(param) ? param : isLang(cookie) ? cookie : "es";

  const headers = new Headers(request.headers);
  headers.set("x-lang", lang);
  const response = NextResponse.next({ request: { headers } });

  if (isLang(param) && param !== cookie) {
    response.cookies.set(LANG_COOKIE, param, { path: "/", maxAge: 31536000, sameSite: "lax" });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
