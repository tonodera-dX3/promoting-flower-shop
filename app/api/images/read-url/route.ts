import type { NextRequest } from "next/server";
import { DbError } from "@/api/db";
import { findImageRecordBySlug } from "@/api/shop";
import { createReadUrl } from "@/api/storage";
import { parseImageSlotKey } from "@/utils/image-rules";
import { MESSAGES } from "@/utils/messages";
import { isValidSlug } from "@/utils/validation";

const NO_STORE = { "Cache-Control": "no-store" };

// 読み出し用の署名付き URL を返す（認証不要）。
// クエリは slug・kind・seqno だけ。DB に保存されたパスに対してだけ発行する
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const slug = params.get("slug") ?? "";
  const seqnoParam = params.get("seqno");
  const seqno = seqnoParam === null || seqnoParam === "" ? null : Number(seqnoParam);
  const slot = parseImageSlotKey(params.get("kind"), seqno);

  if (!isValidSlug(slug) || !slot) {
    return Response.json({ error: "not found" }, { status: 404, headers: NO_STORE });
  }

  try {
    const record = await findImageRecordBySlug(slug, slot);
    if (!record) {
      return Response.json({ error: "not found" }, { status: 404, headers: NO_STORE });
    }
    return Response.json(await createReadUrl(record.path), { headers: NO_STORE });
  } catch (error) {
    const message =
      error instanceof DbError ? MESSAGES.databaseFailed : "Cloud Storage access failed";
    return Response.json({ error: message }, { status: 500, headers: NO_STORE });
  }
}
