"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { DbError } from "@/api/db";
import { getCurrentUser } from "@/api/session";
import {
  deleteImageRecord,
  findImageRecord,
  shopCacheTag,
  upsertImageRecord,
} from "@/api/shop";
import { deleteObject, getObjectContentType, StorageError } from "@/api/storage";
import { buildObjectPath } from "@/api/storage-path";
import type { ActionResult } from "@/types/action-result";
import type { User } from "@/types/shop";
import { isAllowedContentType, parseImageSlotKey } from "@/utils/image-rules";
import { MESSAGES } from "@/utils/messages";

async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  return user;
}

function toErrorResult(error: unknown, storageMessage: string): ActionResult {
  if (error instanceof DbError) return { ok: false, error: MESSAGES.databaseFailed };
  if (error instanceof StorageError) return { ok: false, error: storageMessage };
  throw error;
}

// アップロード（PUT）が終わった画像を DB に登録する。
// パスはサーバーで組み立て直し、content-type は Cloud Storage のメタデータから取る
export async function registerImage(
  kind: string,
  seqno: number | null,
): Promise<ActionResult> {
  const slot = parseImageSlotKey(kind, seqno);
  if (!slot) return { ok: false, error: MESSAGES.imageSaveFailed };

  let user: User;
  try {
    user = await requireUser();
    const path = buildObjectPath(user.id, slot);
    const contentType = await getObjectContentType(path);
    if (contentType === null) return { ok: false, error: MESSAGES.imageSaveFailed };
    if (!isAllowedContentType(contentType)) {
      return { ok: false, error: MESSAGES.invalidImage };
    }
    await upsertImageRecord(user.id, slot, { path, contentType });
  } catch (error) {
    return toErrorResult(error, MESSAGES.imageSaveFailed);
  }

  updateTag(shopCacheTag(user.slug));
  return { ok: true };
}

// 削除できるのは、ログイン中のユーザーの行と、その行に保存されたパスのファイルだけ
export async function deleteImage(
  kind: string,
  seqno: number | null,
): Promise<ActionResult> {
  const slot = parseImageSlotKey(kind, seqno);
  if (!slot) return { ok: false, error: MESSAGES.imageDeleteFailed };

  let user: User;
  try {
    user = await requireUser();
    const record = await findImageRecord(user.id, slot);
    if (record) await deleteObject(record.path);
    await deleteImageRecord(user.id, slot);
  } catch (error) {
    return toErrorResult(error, MESSAGES.imageDeleteFailed);
  }

  updateTag(shopCacheTag(user.slug));
  return { ok: true };
}
