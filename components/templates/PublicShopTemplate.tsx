import InformationPanel from "@/components/organisms/InformationPanel";
import NewsPanel from "@/components/organisms/NewsPanel";
import ShopImageGrid from "@/components/organisms/ShopImageGrid";
import TabView from "@/components/organisms/TabView";
import type { PublicShop } from "@/types/shop";

// 一般ユーザー向け画面: 上部にユーザー名、3つのタブ
export default function PublicShopTemplate({ shop }: { shop: PublicShop }) {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-center text-xl font-bold break-all text-primary">{shop.userName}</h1>
      <TabView
        idPrefix="shop"
        tabs={[
          {
            key: "news",
            label: "ニュース",
            content: (
              <NewsPanel
                slug={shop.slug}
                slideshowSeqnos={shop.slideshowSeqnos}
                hasNewsImage={shop.hasNewsImage}
                newsText={shop.newsText}
              />
            ),
          },
          {
            key: "information",
            label: "ご案内",
            content: <InformationPanel information={shop.information} />,
          },
          {
            key: "shop",
            label: "店内",
            content: <ShopImageGrid slug={shop.slug} seqnos={shop.shopImageSeqnos} />,
          },
        ]}
      />
    </div>
  );
}
