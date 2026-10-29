import { getSessionUsersId } from "@/api/session";
import { createUploadUrl } from "@/api/storage";
import { buildObjectPath } from "@/api/storage-path";
import {
  CONTENT_LENGTH_RANGE,
  isAllowedContentType,
  isValidImageSize,
  parseImageSlotKey,
} from "@/utils/image-rules";
import { MESSAGES } from "@/utils/messages";

const NO_STORE = { "Cache-Control": "no-store" };

// アップロード用の署名付き URL を返す（要ログイン）。
// body は { kind, seqno, contentType, size }。オブジェクトパスは受け取らない
export async function POST(request: Request) {
  const usersId = await getSessionUsersId();
  if (!usersId) {
    return Response.json({ error: "unauthorized" }, { status: 401, headers: NO_STORE });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: MESSAGES.invalidImage }, { status: 400, headers: NO_STORE });
  }

  const slot = parseImageSlotKey(body?.kind, body?.seqno ?? null);
  const { contentType, size } = body ?? {};
  if (!slot || !isAllowedContentType(contentType) || !isValidImageSize(size)) {
    return Response.json({ error: MESSAGES.invalidImage }, { status: 400, headers: NO_STORE });
  }

  try {
    const url = await createUploadUrl(buildObjectPath(usersId, slot), contentType);
    // ブラウザは PUT 時にこのヘッダーをそのまま付ける（署名に含まれている）
    return Response.json(
      {
        url,
        headers: {
          "Content-Type": contentType,
          "x-goog-content-length-range": CONTENT_LENGTH_RANGE,
        },
      },
      { headers: NO_STORE },
    );
  } catch {
    return Response.json({ error: MESSAGES.imageSaveFailed }, { status: 500, headers: NO_STORE });
  }
}
