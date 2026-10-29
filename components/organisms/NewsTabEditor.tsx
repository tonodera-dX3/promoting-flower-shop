import { updateNewsText } from "@/actions/news";
import ImageSlot from "@/components/organisms/ImageSlot";
import TextSaveForm from "@/components/organisms/TextSaveForm";
import { SLIDESHOW_MAX, seqnoRange } from "@/utils/image-rules";
import { NEWS_MAX_CHARS } from "@/utils/validation";

type Props = {
  slug: string;
  slideshowSeqnos: number[];
  hasNewsImage: boolean;
  newsText: string;
};

// 管理者画面「ニュース」タブ: スライドショー用の画像（枠1〜5）、ニュース用画像、ニュース
export default function NewsTabEditor({
  slug,
  slideshowSeqnos,
  hasNewsImage,
  newsText,
}: Props) {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-primary">スライドショー用の画像（最大5枚）</h2>
        {seqnoRange(SLIDESHOW_MAX).map((seqno) => (
          <div key={seqno} className="flex flex-col gap-1.5 rounded-2xl bg-card p-3">
            <p className="text-base font-bold text-secondary">枠{seqno}</p>
            <ImageSlot
              slug={slug}
              kind="slideshow"
              seqno={seqno}
              label={`スライドショー画像${seqno}`}
              initialHasImage={slideshowSeqnos.includes(seqno)}
            />
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-primary">ニュース用画像</h2>
        <div className="rounded-2xl bg-card p-3">
          <ImageSlot
            slug={slug}
            kind="news"
            seqno={null}
            label="ニュース用画像"
            initialHasImage={hasNewsImage}
          />
        </div>
      </section>

      <section className="rounded-2xl bg-card p-3">
        <TextSaveForm
          id="news-text"
          label="ニュース（30文字以内）"
          initialValue={newsText}
          maxChars={NEWS_MAX_CHARS}
          multiline={false}
          onSave={updateNewsText}
        />
      </section>
    </div>
  );
}
