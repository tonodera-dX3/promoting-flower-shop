import "server-only";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  signSessionToken,
  verifySessionToken,
} from "@/api/session-token";
import { findUserById } from "@/api/users";
import type { User } from "@/types/shop";

export async function createSession(usersId: string): Promise<void> {
  const token = await signSessionToken(usersId);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function deleteSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getSessionUsersId(): Promise<string | null> {
  return verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
}

// セッションが有効で、DB にユーザーが存在するときだけ返す
export async function getCurrentUser(): Promise<User | null> {
  const usersId = await getSessionUsersId();
  if (!usersId) return null;
  return findUserById(usersId);
}
