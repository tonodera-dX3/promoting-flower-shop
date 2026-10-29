import "server-only";
import { Storage, type Bucket } from "@google-cloud/storage";
import { CONTENT_LENGTH_RANGE } from "@/utils/image-rules";

// Cloud Storage へのアクセスに失敗したことを表す
export class StorageError extends Error {
  constructor(cause: unknown) {
    super("Cloud Storage access failed", { cause });
    this.name = "StorageError";
  }
}

const SIGNED_URL_TTL_MS = 15 * 60 * 1000;

let storage: Storage | undefined;

function bucket(): Bucket {
  storage ??= new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    credentials: {
      client_email: process.env.GCP_CLIENT_EMAIL,
      // .env では改行を \n と書いているので実際の改行に戻す
      private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
  });
  return storage.bucket(process.env.GCP_BUCKET_NAME ?? "");
}

async function withStorageError<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(error);
    throw new StorageError(error);
  }
}

// アップロード用（PUT）。content-type とサイズ上限を署名に含める
export async function createUploadUrl(
  path: string,
  contentType: string,
): Promise<string> {
  return withStorageError(async () => {
    const [url] = await bucket()
      .file(path)
      .getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + SIGNED_URL_TTL_MS,
        contentType,
        extensionHeaders: { "x-goog-content-length-range": CONTENT_LENGTH_RANGE },
      });
    return url;
  });
}

// 読み出し用（GET）。有効期限の時刻も返す
export async function createReadUrl(
  path: string,
): Promise<{ url: string; expiresAt: number }> {
  return withStorageError(async () => {
    const expiresAt = Date.now() + SIGNED_URL_TTL_MS;
    const [url] = await bucket()
      .file(path)
      .getSignedUrl({ version: "v4", action: "read", expires: expiresAt });
    return { url, expiresAt };
  });
}

// オブジェクトが存在しなければ null
export async function getObjectContentType(
  path: string,
): Promise<string | null> {
  return withStorageError(async () => {
    const file = bucket().file(path);
    const [exists] = await file.exists();
    if (!exists) return null;
    const [metadata] = await file.getMetadata();
    return metadata.contentType ?? null;
  });
}

export async function deleteObject(path: string): Promise<void> {
  await withStorageError(() =>
    bucket().file(path).delete({ ignoreNotFound: true }),
  );
}
