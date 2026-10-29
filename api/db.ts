import "server-only";
import { Pool, type QueryResultRow } from "pg";

// DB へのアクセスに失敗したことを表す。code は PostgreSQL のエラーコード
export class DbError extends Error {
  readonly code: string | undefined;

  constructor(cause: unknown) {
    super("Database access failed", { cause });
    this.name = "DbError";
    this.code =
      typeof cause === "object" && cause !== null && "code" in cause
        ? String((cause as { code: unknown }).code)
        : undefined;
  }
}

export function isUniqueViolation(error: unknown): boolean {
  return error instanceof DbError && error.code === "23505";
}

// DATABASE_HOST が /cloudsql/... の場合、pg は Unix ソケットとして接続する
function createPool(): Pool {
  return new Pool({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT ?? 5432),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    max: 5,
  });
}

// 開発時はホットリロードのたびに Pool が増えないよう使い回す
const globalForPg = globalThis as unknown as { pgPool?: Pool };
const pool = globalForPg.pgPool ?? createPool();
if (process.env.NODE_ENV !== "production") globalForPg.pgPool = pool;

export async function query<T extends QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  try {
    const result = await pool.query<T>(text, params);
    return result.rows;
  } catch (error) {
    console.error(error);
    throw new DbError(error);
  }
}
