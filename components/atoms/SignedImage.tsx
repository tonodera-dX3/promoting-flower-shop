"use client";

import Image from "next/image";
import { useSignedImageUrl } from "@/hooks/useSignedImageUrl";
import type { ImageKind } from "@/types/shop";

type Props = {
  slug: string;
  kind: ImageKind;
  seqno: number | null;
  alt: string;
  // 親要素いっぱいに表示する。cover は切り抜き、contain は全体表示
  fit?: "cover" | "contain";
  version?: number;
};

// Cloud Storage の画像を、読み出し用の署名付き URL で表示する。
// 親要素に relative とサイズを指定して使う
export default function SignedImage({
  slug,
  kind,
  seqno,
  alt,
  fit = "cover",
  version = 0,
}: Props) {
  const { url, onError } = useSignedImageUrl(slug, kind, seqno, true, version);
  if (!url) return null;
  return (
    <Image
      src={url}
      alt={alt}
      fill
      unoptimized
      draggable={false}
      onError={onError}
      className={fit === "cover" ? "object-cover" : "object-contain"}
    />
  );
}
