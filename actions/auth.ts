"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { DbError } from "@/api/db";
import { createSession, deleteSession } from "@/api/session";
import { findUserForLogin } from "@/api/users";
import type { LoginResult } from "@/types/action-result";
import { MESSAGES } from "@/utils/messages";
import { validateLogin } from "@/utils/validation";

// 成功時は /admin へ redirect する。失敗時だけ結果を返す
export async function login(
  userId: string,
  password: string,
): Promise<LoginResult> {
  const validationError = validateLogin(userId, password);
  if (validationError) return { error: validationError, clearInputs: false };

  let usersId: string;
  try {
    const user = await findUserForLogin(userId);
    const matched =
      user !== null && (await bcrypt.compare(password, user.passwordHash));
    if (!user || !matched) {
      return { error: MESSAGES.authFailed, clearInputs: true };
    }
    usersId = user.id;
  } catch (error) {
    if (error instanceof DbError) {
      return { error: MESSAGES.databaseFailed, clearInputs: false };
    }
    throw error;
  }

  await createSession(usersId);
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/");
}
