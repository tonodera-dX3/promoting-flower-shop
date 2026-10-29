import type { ImageKind, ImageSlotKey } from "@/types/shop";

export const IMAGE_KINDS: readonly ImageKind[] = ["news", "slideshow", "images"];

export const SLIDESHOW_MAX = 5;
export const SHOP_IMAGES_MAX = 9;

export const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png"] as const;
export type AllowedContentType = (typeof ALLOWED_CONTENT_TYPES)[number];

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

// 署名付き URL に含め、ブラウザが PUT 時にも送るヘッダーの値
export const CONTENT_LENGTH_RANGE = `0,${MAX_IMAGE_BYTES}`;

export function isImageKind(value: unknown): value is ImageKind {
  return typeof value === "string" && IMAGE_KINDS.includes(value as ImageKind);
}

export function isAllowedContentType(
  value: unknown,
): value is AllowedContentType {
  return (
    typeof value === "string" &&
    (ALLOWED_CONTENT_TYPES as readonly string[]).includes(value)
  );
}

export function isValidImageSize(size: unknown): size is number {
  return (
    typeof size === "number" &&
    Number.isInteger(size) &&
    size >= 1 &&
    size <= MAX_IMAGE_BYTES
  );
}

// スライドショーは 1〜5、店内画像は 1〜9。ニュース用画像は seqno を使わない（null）
export function isValidSeqno(kind: ImageKind, seqno: unknown): boolean {
  if (kind === "news") return seqno === null;
  if (typeof seqno !== "number" || !Number.isInteger(seqno)) return false;
  const max = kind === "slideshow" ? SLIDESHOW_MAX : SHOP_IMAGES_MAX;
  return seqno >= 1 && seqno <= max;
}

// ブラウザから受け取った値を検証し、正しければ ImageSlotKey にする
export function parseImageSlotKey(
  kind: unknown,
  seqno: unknown,
): ImageSlotKey | null {
  if (!isImageKind(kind)) return null;
  const normalized = kind === "news" ? null : seqno;
  if (!isValidSeqno(kind, normalized)) return null;
  return { kind, seqno: normalized as number | null };
}

export function seqnoRange(max: number): number[] {
  return Array.from({ length: max }, (_, i) => i + 1);
}
