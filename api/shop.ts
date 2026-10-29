import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { query } from "@/api/db";
import type { ImageSlotKey, PublicShop, ShopContent } from "@/types/shop";

// 一般ユーザー向け画面のキャッシュタグ。保存・削除時に updateTag で破棄する
export function shopCacheTag(slug: string): string {
  return `shop-${slug}`;
}

async function loadShopContent(usersId: string): Promise<ShopContent> {
  const [news, slideshow, shopImages] = await Promise.all([
    query<{ news_text: string; information: string; news_image_url: string }>(
      "select news_text, information, news_image_url from shop_news where users_id = $1",
      [usersId],
    ),
    query<{ seqno: number }>(
      "select seqno from shop_slideshow where users_id = $1 and slideshow_url <> '' order by seqno",
      [usersId],
    ),
    query<{ seqno: number }>(
      "select seqno from shop_images where users_id = $1 and shop_image_url <> '' order by seqno",
      [usersId],
    ),
  ]);
  return {
    newsText: news[0]?.news_text ?? "",
    information: news[0]?.information ?? "",
    hasNewsImage: (news[0]?.news_image_url ?? "") !== "",
    slideshowSeqnos: slideshow.map((row) => row.seqno),
    shopImageSeqnos: shopImages.map((row) => row.seqno),
  };
}

// 管理者画面用。常に DB から最新を読む（キャッシュしない）
export async function getAdminShopContent(usersId: string): Promise<ShopContent> {
  return loadShopContent(usersId);
}

// 一般ユーザー向け画面用。slug ごとにキャッシュする。存在しない slug なら null
export async function getPublicShop(slug: string): Promise<PublicShop | null> {
  "use cache";
  cacheTag(shopCacheTag(slug));
  cacheLife({ revalidate: 300 });

  const users = await query<{ id: string; user_name: string }>(
    "select id, user_name from users where slug = $1",
    [slug],
  );
  const user = users[0];
  if (!user) return null;
  return {
    slug,
    userName: user.user_name,
    ...(await loadShopContent(user.id)),
  };
}

export async function saveNewsText(usersId: string, newsText: string): Promise<void> {
  await query(
    `insert into shop_news (users_id, news_text) values ($1, $2)
     on conflict (users_id) do update set news_text = excluded.news_text`,
    [usersId, newsText],
  );
}

export async function saveInformation(
  usersId: string,
  information: string,
): Promise<void> {
  await query(
    `insert into shop_news (users_id, information) values ($1, $2)
     on conflict (users_id) do update set information = excluded.information`,
    [usersId, information],
  );
}

type ImageRecord = { path: string; contentType: string };

// 画像の種類ごとのテーブル・列。SQL に埋め込むのはこの固定値だけ
const IMAGE_TABLES = {
  slideshow: { table: "shop_slideshow", urlColumn: "slideshow_url" },
  images: { table: "shop_images", urlColumn: "shop_image_url" },
} as const;

// 登録済みの画像のオブジェクトパス。未登録なら null
export async function findImageRecord(
  usersId: string,
  slot: ImageSlotKey,
): Promise<ImageRecord | null> {
  const rows =
    slot.kind === "news"
      ? await query<{ path: string; content_type: string }>(
          "select news_image_url as path, content_type from shop_news where users_id = $1",
          [usersId],
        )
      : await query<{ path: string; content_type: string }>(
          `select ${IMAGE_TABLES[slot.kind].urlColumn} as path, content_type
           from ${IMAGE_TABLES[slot.kind].table} where users_id = $1 and seqno = $2`,
          [usersId, slot.seqno],
        );
  const row = rows[0];
  return row && row.path !== ""
    ? { path: row.path, contentType: row.content_type }
    : null;
}

// 一般ユーザー向け画面の読み出し用。slug から users を引いてから探す
export async function findImageRecordBySlug(
  slug: string,
  slot: ImageSlotKey,
): Promise<ImageRecord | null> {
  const users = await query<{ id: string }>(
    "select id from users where slug = $1",
    [slug],
  );
  return users[0] ? findImageRecord(users[0].id, slot) : null;
}

// 画像を登録する。同じ枠に既にあれば上書きする
export async function upsertImageRecord(
  usersId: string,
  slot: ImageSlotKey,
  record: ImageRecord,
): Promise<void> {
  if (slot.kind === "news") {
    await query(
      `insert into shop_news (users_id, news_image_url, content_type) values ($1, $2, $3)
       on conflict (users_id) do update
       set news_image_url = excluded.news_image_url, content_type = excluded.content_type`,
      [usersId, record.path, record.contentType],
    );
    return;
  }
  const { table, urlColumn } = IMAGE_TABLES[slot.kind];
  await query(
    `insert into ${table} (users_id, seqno, ${urlColumn}, content_type) values ($1, $2, $3, $4)
     on conflict (users_id, seqno) do update
     set ${urlColumn} = excluded.${urlColumn}, content_type = excluded.content_type`,
    [usersId, slot.seqno, record.path, record.contentType],
  );
}

// ニュース用画像は行を残して列を空文字に、それ以外は行を削除する
export async function deleteImageRecord(
  usersId: string,
  slot: ImageSlotKey,
): Promise<void> {
  if (slot.kind === "news") {
    await query(
      "update shop_news set news_image_url = '', content_type = '' where users_id = $1",
      [usersId],
    );
    return;
  }
  await query(
    `delete from ${IMAGE_TABLES[slot.kind].table} where users_id = $1 and seqno = $2`,
    [usersId, slot.seqno],
  );
}
