"use client";

import Dot from "@/components/atoms/Dot";
import SignedImage from "@/components/atoms/SignedImage";
import { useSlideshow } from "@/hooks/useSlideshow";

// 300×300。seqno の昇順で左から右に並べ、横方向に切り替える
export default function Slideshow({ slug, seqnos }: { slug: string; seqnos: number[] }) {
  const { current, swipeHandlers } = useSlideshow(seqnos.length);

  if (seqnos.length === 0) {
    return (
      <div className="flex size-[300px] items-center justify-center rounded-2xl bg-card text-base text-secondary">
        画像がありません
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative size-[300px] touch-pan-y overflow-hidden rounded-2xl bg-card select-none"
        aria-roledescription="スライドショー"
        {...swipeHandlers}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {seqnos.map((seqno, i) => (
            <div
              key={seqno}
              className="relative size-[300px] shrink-0"
              aria-hidden={i !== current}
            >
              <SignedImage
                slug={slug}
                kind="slideshow"
                seqno={seqno}
                alt={`スライド${i + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2" aria-label={`${seqnos.length}枚中${current + 1}枚目`}>
        {seqnos.map((seqno, i) => (
          <Dot key={seqno} active={i === current} />
        ))}
      </div>
    </div>
  );
}
