"use server";

import bcrypt from "bcryptjs";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { DbError, isUniqueViolation } from "@/api/db";
import { createSession } from "@/api/session";
import { shopCacheTag } from "@/api/shop";
import { createUser } from "@/api/users";
import type { AccountResult } from "@/types/action-result";
import { MESSAGES } from "@/utils/messages";
import { hasErrors, validateAccount } from "@/utils/validation";

const BCRYPT_SALT_ROUNDS = 10;

// 成功時はログイン状態にして /admin へ redirect する。失敗時だけ結果を返す
export async function createAccount(input: {
  userId: string;
  userName: string;
  password: string;
}): Promise<AccountResult> {
  const fieldErrors = validateAccount(input);
  if (hasErrors(fieldErrors)) return { fieldErrors };

  let usersId: string;
  let slug: string;
  try {
    const passwordHash = await bcrypt.hash(input.password, BCRYPT_SALT_ROUNDS);
    const user = await createUser({
      userId: input.userId,
      userName: input.userName,
      passwordHash,
    });
    usersId = user.id;
    slug = user.slug;
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { fieldErrors: { userId: MESSAGES.alreadyRegistered } };
    }
    if (error instanceof DbError) {
      return { fieldErrors: {}, error: MESSAGES.databaseFailed };
    }
    throw error;
  }

  // 作成前にこの slug の 404 がキャッシュされていても、すぐに公開ページが開けるようにする
  updateTag(shopCacheTag(slug));
  await createSession(usersId);
  redirect("/admin");
}
