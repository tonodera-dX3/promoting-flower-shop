import "server-only";
import { query } from "@/api/db";
import type { User } from "@/types/shop";

type UserRow = {
  id: string;
  user_id: string;
  user_name: string;
  user_password: string;
  slug: string;
};

function toUser(row: UserRow): User {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    slug: row.slug,
  };
}

// ログイン用。パスワードのハッシュ値も返す（大文字・小文字を区別した完全一致）
export async function findUserForLogin(
  userId: string,
): Promise<(User & { passwordHash: string }) | null> {
  const rows = await query<UserRow>(
    "select id, user_id, user_name, user_password, slug from users where user_id = $1",
    [userId],
  );
  const row = rows[0];
  return row ? { ...toUser(row), passwordHash: row.user_password } : null;
}

export async function findUserById(id: string): Promise<User | null> {
  const rows = await query<UserRow>(
    "select id, user_id, user_name, slug from users where id = $1",
    [id],
  );
  return rows[0] ? toUser(rows[0]) : null;
}

// slug にはユーザーIDと同じ値を保存する。重複時は一意制約違反の DbError になる
export async function createUser(input: {
  userId: string;
  userName: string;
  passwordHash: string;
}): Promise<User> {
  const rows = await query<UserRow>(
    `insert into users (user_id, user_name, user_password, slug)
     values ($1, $2, $3, $1)
     returning id, user_id, user_name, slug`,
    [input.userId, input.userName, input.passwordHash],
  );
  return toUser(rows[0]);
}
