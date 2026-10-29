"use client";

import { useEffect } from "react";
import Button from "@/components/atoms/Button";
import SignedImage from "@/components/atoms/SignedImage";
import type { ImageKind } from "@/types/shop";

type Props = {
  slug: string;
  kind: ImageKind;
  seqno: number;
  alt: string;
  onClose: () => void;
};

// 画像の拡大表示。背景か「閉じる」ボタンのタップ、Esc キーで閉じる
export default function ImageLightbox({ slug, kind, seqno, alt, onClose }: Props) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${alt}の拡大表示`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/85 px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
      onClick={onClose}
    >
      <div className="flex w-full max-w-[398px] flex-col gap-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
          <SignedImage slug={slug} kind={kind} seqno={seqno} alt={alt} fit="contain" />
        </div>
        <Button variant="secondary" onClick={onClose} className="w-full">
          閉じる
        </Button>
      </div>
    </div>
  );
}
