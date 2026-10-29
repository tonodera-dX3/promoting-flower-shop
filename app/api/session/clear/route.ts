import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/api/session-token";

// Cookie の JWT は有効だが DB にユーザーがいない場合（DB を作り直したときなど）に使う。
// Cookie を消さずに / へ戻すと、proxy が /admin へ戻してループになるため
export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
