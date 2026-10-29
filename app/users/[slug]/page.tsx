import { notFound } from "next/navigation";
import { Suspense } from "react";
import ErrorText from "@/components/atoms/ErrorText";
import PublicShopTemplate from "@/components/templates/PublicShopTemplate";
import { DbError } from "@/api/db";
import { getPublicShop } from "@/api/shop";
import { MESSAGES } from "@/utils/messages";
import { isValidSlug } from "@/utils/validation";

// params は実行時のデータなので Suspense の中で読む。
// ストリーミング中の notFound() は HTTP ステータスが 200 になる場合がある（spec で許容）
async function PublicShopContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isValidSlug(slug)) notFound();

  let shop;
  try {
    shop = await getPublicShop(slug);
  } catch (error) {
    if (error instanceof DbError) return <ErrorText message={MESSAGES.databaseFailed} />;
    throw error;
  }
  if (!shop) notFound();
  return <PublicShopTemplate shop={shop} />;
}

export default function PublicShopPage({ params }: PageProps<"/users/[slug]">) {
  return (
    <Suspense fallback={<p className="text-center text-base text-secondary">読み込み中…</p>}>
      <PublicShopContent params={params} />
    </Suspense>
  );
}
