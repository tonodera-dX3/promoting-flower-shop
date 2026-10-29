"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { DbError } from "@/api/db";
import { getCurrentUser } from "@/api/session";
import { saveInformation, saveNewsText, shopCacheTag } from "@/api/shop";
import type { ActionResult } from "@/types/action-result";
import type { User } from "@/types/shop";
import { normalizeNewlines } from "@/utils/char-count";
import { MESSAGES } from "@/utils/messages";
import {
  normalizeNewsText,
  validateInformation,
  validateNewsText,
} from "@/utils/validation";

async function saveText(
  text: unknown,
  normalize: (value: string) => string,
  validate: (value: string) => string | null,
  save: (usersId: string, value: string) => Promise<void>,
): Promise<ActionResult> {
  if (typeof text !== "string") return { ok: false, error: MESSAGES.databaseFailed };
  const value = normalize(text);
  const validationError = validate(value);
  if (validationError) return { ok: false, error: validationError };

  let user: User | null;
  try {
    user = await getCurrentUser();
    if (user) await save(user.id, value);
  } catch (error) {
    if (error instanceof DbError) return { ok: false, error: MESSAGES.databaseFailed };
    throw error;
  }
  if (!user) redirect("/");

  updateTag(shopCacheTag(user.slug));
  return { ok: true };
}

export async function updateNewsText(text: string): Promise<ActionResult> {
  return saveText(text, normalizeNewsText, validateNewsText, saveNewsText);
}

export async function updateInformation(text: string): Promise<ActionResult> {
  return saveText(text, normalizeNewlines, validateInformation, saveInformation);
}
