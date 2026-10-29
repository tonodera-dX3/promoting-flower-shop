"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ImageKind } from "@/types/shop";

// 有効期限（15分）が切れる前、取得から14分後に取り直す
const REFRESH_AFTER_MS = 14 * 60 * 1000;

type ReadUrlResponse = { url: string; expiresAt: number };

// 読み出し用の署名付き URL を Route Handler から取得する。
// version を変えると取り直す（同じ枠に画像を上書き保存したとき用）
export function useSignedImageUrl(
  slug: string,
  kind: ImageKind,
  seqno: number | null,
  enabled: boolean,
  version = 0,
) {
  const [url, setUrl] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  // 読み込みエラーで取り直すのは、定期的な取り直しの間に1度だけ（無限ループ防止）
  const retriedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;

    const params = new URLSearchParams({ slug, kind });
    if (seqno !== null) params.set("seqno", String(seqno));

    fetch(`/api/images/read-url?${params}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((res) => (res.ok ? (res.json() as Promise<ReadUrlResponse>) : null))
      .then((data) => {
        if (!data) return;
        setUrl(data.url);
        timer = setTimeout(() => {
          retriedRef.current = false;
          setReloadKey((key) => key + 1);
        }, REFRESH_AFTER_MS);
      })
      .catch(() => {
        // 中断や通信エラー時は表示しない
      });

    return () => {
      controller.abort();
      if (timer) clearTimeout(timer);
    };
  }, [slug, kind, seqno, enabled, version, reloadKey]);

  // 画像を上書き保存したら、読み込みエラー時の取り直しをもう一度許可する
  useEffect(() => {
    retriedRef.current = false;
  }, [version]);

  const onError = useCallback(() => {
    if (retriedRef.current) return;
    retriedRef.current = true;
    setReloadKey((key) => key + 1);
  }, []);

  return { url: enabled ? url : null, onError };
}
