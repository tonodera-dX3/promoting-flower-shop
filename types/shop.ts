// 画像の種類: news（ニュース用画像） / slideshow（スライドショー用の画像） / images（店内画像）
export type ImageKind = "news" | "slideshow" | "images";

// ニュース用画像は seqno を使わないため null
export type ImageSlotKey = {
  kind: ImageKind;
  seqno: number | null;
};

// 管理者画面・一般ユーザー向け画面の両方で表示するコンテンツ。
// オブジェクトパスはブラウザに渡さないため含めない
export type ShopContent = {
  newsText: string;
  information: string;
  hasNewsImage: boolean;
  slideshowSeqnos: number[];
  shopImageSeqnos: number[];
};

export type PublicShop = ShopContent & {
  slug: string;
  userName: string;
};

export type User = {
  id: string;
  userId: string;
  userName: string;
  slug: string;
};
