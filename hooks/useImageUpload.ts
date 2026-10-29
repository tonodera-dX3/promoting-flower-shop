"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteImage, registerImage } from "@/actions/images";
import type { ImageKind } from "@/types/shop";
import {
  isAllowedContentType,
  isValidImageSize,
} from "@/utils/image-rules";
import { MESSAGES } from "@/utils/messages";

type UploadUrlResponse = { url: string; headers: Record<string, string> };

export function isAcceptableImage(file: File): boolean {
  return isAllowedContentType(file.type) && isValidImageSize(file.size);
}

// セッション切れ（401）を表す。呼び出し側でログイン画面へ移動する
const UNAUTHORIZED = Symbol("unauthorized");

// 1. Route Handler から署名付き URL を取得 → 2. 直接 PUT → 3. Server Action で DB に登録
async function uploadImage(
  kind: ImageKind,
  seqno: number | null,
  file: File,
): Promise<string | typeof UNAUTHORIZED | null> {
  if (!isAcceptableImage(file)) return MESSAGES.invalidImage;

  try {
    const res = await fetch("/api/images/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, seqno, contentType: file.type, size: file.size }),
    });
    if (res.status === 401) return UNAUTHORIZED;
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      return data?.error ?? MESSAGES.imageSaveFailed;
    }
    const { url, headers } = (await res.json()) as UploadUrlResponse;

    const put = await fetch(url, { method: "PUT", headers, body: file });
    if (!put.ok) return MESSAGES.imageSaveFailed;
  } catch {
    return MESSAGES.imageSaveFailed;
  }

  const result = await registerImage(kind, seqno);
  return result.ok ? null : result.error;
}

// 画像の枠1つ分の保存・削除と、その状態を管理する
export function useImageUpload(kind: ImageKind, seqno: number | null) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function save(file: File, onSaved: () => void) {
    setError(null);
    startTransition(async () => {
      const message = await uploadImage(kind, seqno, file);
      if (message === UNAUTHORIZED) {
        router.push("/");
      } else if (message) {
        setError(message);
      } else {
        onSaved();
      }
    });
  }

  function remove(onDeleted: () => void) {
    setError(null);
    startTransition(async () => {
      const result = await deleteImage(kind, seqno);
      if (result.ok) {
        onDeleted();
      } else {
        setError(result.error);
      }
    });
  }

  return { error, setError, pending, save, remove };
}
