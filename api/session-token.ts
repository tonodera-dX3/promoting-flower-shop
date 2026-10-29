import "server-only";
import { SignJWT, jwtVerify } from "jose";

// proxy.ts からも使うため、next/headers に依存しない JWT の処理だけをここに置く

export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(secret);
}

// payload の sub に users.id（uuid）を入れる
export async function signSessionToken(usersId: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(usersId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(secretKey());
}

// 署名や有効期限が不正なら null
export async function verifySessionToken(
  token: string | undefined,
): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
    });
    return payload.sub ?? null;
  } catch {
    return null;
  }
}
