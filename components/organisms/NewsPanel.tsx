import SignedImage from "@/components/atoms/SignedImage";
import Slideshow from "@/components/organisms/Slideshow";

type Props = {
  slug: string;
  slideshowSeqnos: number[];
  hasNewsImage: boolean;
  newsText: string;
};

// 一般ユーザー向け画面「ニュース」タブ: スライドショー → ニュース用画像 → ニュース
export default function NewsPanel({ slug, slideshowSeqnos, hasNewsImage, newsText }: Props) {
  return (
    <div className="flex flex-col items-center gap-6">
      <Slideshow slug={slug} seqnos={slideshowSeqnos} />
      {/* 画像がなければ空白の領域だけを表示する */}
      <div className="relative size-[300px] overflow-hidden rounded-2xl bg-card">
        {hasNewsImage && (
          <SignedImage slug={slug} kind="news" seqno={null} alt="ニュース用画像" />
        )}
      </div>
      <p className="line-clamp-2 w-[20em] text-base break-words">{newsText}</p>
    </div>
  );
}
