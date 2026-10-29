"use client";

import { useCallback, useState } from "react";
import SignedImage from "@/components/atoms/SignedImage";
import ImageLightbox from "@/components/organisms/ImageLightbox";
import { SHOP_IMAGES_MAX, seqnoRange } from "@/utils/image-rules";

// 一般ユーザー向け画面「店内」タブ: 100×100 の画像を 3×3 で等間隔に並べる。
// seqno 1〜9 を上段左から右、中段、下段の順に置き、画像がない位置は空白にする
export default function ShopImageGrid({
  slug,
  seqnos,
}: {
  slug: string;
  seqnos: number[];
}) {
  const [opened, setOpened] = useState<number | null>(null);
  const close = useCallback(() => setOpened(null), []);

  return (
    <>
      <div className="mx-auto grid w-fit grid-cols-3 gap-4">
        {seqnoRange(SHOP_IMAGES_MAX).map((seqno) =>
          seqnos.includes(seqno) ? (
            <button
              key={seqno}
              type="button"
              aria-label={`店内画像${seqno}を拡大表示`}
              onClick={() => setOpened(seqno)}
              className="relative size-[100px] overflow-hidden rounded-xl bg-card"
            >
              <SignedImage slug={slug} kind="images" seqno={seqno} alt={`店内画像${seqno}`} />
            </button>
          ) : (
            <div key={seqno} className="size-[100px]" aria-hidden />
          ),
        )}
      </div>
      {opened !== null && (
        <ImageLightbox
          slug={slug}
          kind="images"
          seqno={opened}
          alt={`店内画像${opened}`}
          onClose={close}
        />
      )}
    </>
  );
}
