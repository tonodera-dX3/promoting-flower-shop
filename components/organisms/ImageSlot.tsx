"use client";

/* eslint-disable @next/next/no-img-element -- ローカルの blob: URL のプレビューには next/image を使わない */

import { useEffect, useRef, useState } from "react";
import Button from "@/components/atoms/Button";
import ErrorText from "@/components/atoms/ErrorText";
import SignedImage from "@/components/atoms/SignedImage";
import ImageDropZone from "@/components/molecules/ImageDropZone";
import { isAcceptableImage, useImageUpload } from "@/hooks/useImageUpload";
import type { ImageKind } from "@/types/shop";
import { MESSAGES } from "@/utils/messages";

type Props = {
  slug: string;
  kind: ImageKind;
  seqno: number | null;
  label: string;
  initialHasImage: boolean;
  // 領域の大きさ（正方形）。compact は 3×3 の店内画像用
  compact?: boolean;
};

// 画像の枠1つ。貼り付け領域と「保存」「削除」ボタン
export default function ImageSlot({
  slug,
  kind,
  seqno,
  label,
  initialHasImage,
  compact = false,
}: Props) {
  const [hasImage, setHasImage] = useState(initialHasImage);
  const [version, setVersion] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);
  const { error, setError, pending, save, remove } = useImageUpload(kind, seqno);

  function changePreview(next: File | null) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = next ? URL.createObjectURL(next) : null;
    setPreviewUrl(previewRef.current);
    setFile(next);
  }

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  function handleSelect(selected: File) {
    if (!isAcceptableImage(selected)) {
      setError(MESSAGES.invalidImage);
      return;
    }
    setError(null);
    changePreview(selected);
  }

  function handleSave() {
    if (!file) return;
    save(file, () => {
      changePreview(null);
      setHasImage(true);
      setVersion((v) => v + 1);
    });
  }

  function handleDelete() {
    // 未保存の画像を選んでいるだけなら、選択を取り消すだけにする
    if (!hasImage) {
      changePreview(null);
      setError(null);
      return;
    }
    remove(() => {
      changePreview(null);
      setHasImage(false);
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <ImageDropZone
        label={label}
        onSelect={handleSelect}
        disabled={pending}
        className={compact ? "aspect-square w-full" : "aspect-square w-full max-w-[300px] self-center"}
      >
        {previewUrl ? (
          <img src={previewUrl} alt={`${label}のプレビュー`} className="size-full object-cover" />
        ) : hasImage ? (
          <SignedImage slug={slug} kind={kind} seqno={seqno} alt={label} version={version} />
        ) : undefined}
      </ImageDropZone>
      <div className={`flex gap-1 ${compact ? "" : "self-center w-full max-w-[300px]"}`}>
        <Button
          className={`flex-1 ${compact ? "px-1" : ""}`}
          onClick={handleSave}
          disabled={pending || !file}
        >
          保存
        </Button>
        <Button
          variant="secondary"
          className={`flex-1 ${compact ? "px-1" : ""}`}
          onClick={handleDelete}
          disabled={pending || (!hasImage && !file)}
        >
          削除
        </Button>
      </div>
      <ErrorText message={error} />
    </div>
  );
}
