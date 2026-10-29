// Server Action の戻り値。成功時は redirect するアクションもあるため、失敗時の形だけを決める
export type ActionResult = { ok: true } | { ok: false; error: string };

export type AccountField = "userId" | "userName" | "password";

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

export type LoginResult = {
  error: string;
  // 認証に失敗したときは入力欄をクリアする
  clearInputs: boolean;
};

export type AccountResult = {
  fieldErrors: FieldErrors<AccountField>;
  error?: string;
};
