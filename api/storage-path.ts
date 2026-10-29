import "server-only";
import type { ImageSlotKey } from "@/types/shop";

// オブジェクトパスはここでだけ組み立てる。ブラウザから受け取ったパスは使わない
export function buildObjectPath(usersId: string, slot: ImageSlotKey): string {
  const base = `uploads_image/${usersId}`;
  switch (slot.kind) {
    case "news":
      return `${base}/shop_news/news`;
    case "slideshow":
      return `${base}/shop_slideshow/${slot.seqno}/slideshow`;
    case "images":
      return `${base}/shop_images/${slot.seqno}/images`;
  }
}
