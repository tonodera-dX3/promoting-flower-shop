import ImageSlot from "@/components/organisms/ImageSlot";
import { SHOP_IMAGES_MAX, seqnoRange } from "@/utils/image-rules";

// 管理者画面「店内」タブ: 枠1〜9を、一般ユーザー向け画面と同じ 3×3 で並べる
export default function ShopImagesEditor({
  slug,
  shopImageSeqnos,
}: {
  slug: string;
  shopImageSeqnos: number[];
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-primary">店内画像（最大9枚）</h2>
      <div className="grid grid-cols-3 gap-2">
        {seqnoRange(SHOP_IMAGES_MAX).map((seqno) => (
          <ImageSlot
            key={seqno}
            slug={slug}
            kind="images"
            seqno={seqno}
            label={`店内画像${seqno}`}
            initialHasImage={shopImageSeqnos.includes(seqno)}
            compact
          />
        ))}
      </div>
    </section>
  );
}
