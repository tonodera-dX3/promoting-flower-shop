import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/api/session-token";

// Cookie の JWT だけで判定する楽観的なチェック。
// /admin のページ・Server Actions・Route Handler でも改めてセッションを確認する
export async function proxy(request: NextRequest) {
  const usersId = await verifySessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
  );
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" && !usersId) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if ((pathname === "/" || pathname === "/account") && usersId) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/account", "/admin"],
};
