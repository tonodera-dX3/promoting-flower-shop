import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ErrorText from "@/components/atoms/ErrorText";
import AdminTemplate from "@/components/templates/AdminTemplate";
import { DbError } from "@/api/db";
import { getCurrentUser } from "@/api/session";
import { getAdminShopContent } from "@/api/shop";
import type { ShopContent, User } from "@/types/shop";
import { MESSAGES } from "@/utils/messages";

export const metadata: Metadata = {
  title: "管理者画面 | promoting-flower-shop",
};

function publicUrlOf(slug: string): string {
  const base = (process.env.APP_BASE_URL ?? "").replace(/\/+$/, "");
  return `${base}/users/${slug}`;
}

// セッションを読むため、Suspense の中でリクエストごとに描画する
async function AdminContent() {
  let user: User | null;
  let content: ShopContent;
  try {
    user = await getCurrentUser();
    if (!user) {
      // JWT は有効だが DB にユーザーがいない場合は Cookie も消す（proxy とのループ防止）
      redirect("/api/session/clear");
    }
    content = await getAdminShopContent(user.id);
  } catch (error) {
    if (error instanceof DbError) return <ErrorText message={MESSAGES.databaseFailed} />;
    throw error;
  }
  return <AdminTemplate user={user} content={content} publicUrl={publicUrlOf(user.slug)} />;
}

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="text-center text-base text-secondary">読み込み中…</p>}>
      <AdminContent />
    </Suspense>
  );
}
