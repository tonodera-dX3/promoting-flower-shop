import InformationTabEditor from "@/components/organisms/InformationTabEditor";
import LogoutButton from "@/components/organisms/LogoutButton";
import NewsTabEditor from "@/components/organisms/NewsTabEditor";
import ShopImagesEditor from "@/components/organisms/ShopImagesEditor";
import TabView from "@/components/organisms/TabView";
import PublicUrlBox from "@/components/molecules/PublicUrlBox";
import type { ShopContent, User } from "@/types/shop";

type Props = {
  user: User;
  content: ShopContent;
  publicUrl: string;
};

// 管理者画面: 上部にユーザーID・ユーザー名、3つのタブ、下部に公開ページの URL とログオフ
export default function AdminTemplate({ user, content, publicUrl }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-2xl bg-card p-4 text-base">
        <dt className="font-bold text-primary">ユーザーID</dt>
        <dd className="break-all">{user.userId}</dd>
        <dt className="font-bold text-primary">ユーザー名</dt>
        <dd className="break-all">{user.userName}</dd>
      </dl>

      <TabView
        idPrefix="admin"
        tabs={[
          {
            key: "news",
            label: "ニュース",
            content: (
              <NewsTabEditor
                slug={user.slug}
                slideshowSeqnos={content.slideshowSeqnos}
                hasNewsImage={content.hasNewsImage}
                newsText={content.newsText}
              />
            ),
          },
          {
            key: "information",
            label: "ご案内",
            content: <InformationTabEditor information={content.information} />,
          },
          {
            key: "shop",
            label: "店内",
            content: (
              <ShopImagesEditor slug={user.slug} shopImageSeqnos={content.shopImageSeqnos} />
            ),
          },
        ]}
      />

      <PublicUrlBox url={publicUrl} />
      <LogoutButton />
    </div>
  );
}
