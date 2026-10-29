import type { AccountField, FieldErrors } from "@/types/action-result";
import { countChars } from "@/utils/char-count";
import { MESSAGES } from "@/utils/messages";

export const NEWS_MAX_CHARS = 30;
export const INFORMATION_MAX_CHARS = 80;

const USER_ID_PATTERN = /^[A-Za-z0-9]+$/;

// ログイン画面: 両方空の場合はユーザーIDのメッセージを優先する
export function validateLogin(userId: string, password: string): string | null {
  if (userId === "") return MESSAGES.loginUserIdRequired;
  if (password === "") return MESSAGES.loginPasswordRequired;
  return null;
}

// アカウント作成画面: 欄ごとに、spec の記載順で最初のエラーを1件返す
export function validateAccount(input: {
  userId: string;
  userName: string;
  password: string;
}): FieldErrors<AccountField> {
  const errors: FieldErrors<AccountField> = {};

  const userIdLength = countChars(input.userId);
  if (userIdLength < 4) {
    errors.userId = MESSAGES.userIdTooShort;
  } else if (userIdLength >= 10) {
    errors.userId = MESSAGES.userIdTooLong;
  } else if (!USER_ID_PATTERN.test(input.userId)) {
    errors.userId = MESSAGES.userIdInvalidChars;
  }

  // \s は全角スペースも含む
  if (/^\s*$/.test(input.userName)) {
    errors.userName = MESSAGES.userNameRequired;
  }

  const passwordLength = countChars(input.password);
  if (passwordLength < 4) {
    errors.password = MESSAGES.passwordTooShort;
  } else if (passwordLength >= 13) {
    errors.password = MESSAGES.passwordTooLong;
  }

  return errors;
}

export function hasErrors(errors: FieldErrors<string>): boolean {
  return Object.values(errors).some(Boolean);
}

// slug はユーザーIDと同じ値なので、同じ規則で形式だけを確認する
export function isValidSlug(slug: string): boolean {
  return USER_ID_PATTERN.test(slug) && slug.length >= 4 && slug.length < 10;
}

// ニュースは改行不可。改行が混ざっていたら取り除いてから数える
export function normalizeNewsText(text: string): string {
  return text.replace(/[\r\n]/g, "");
}

export function validateNewsText(text: string): string | null {
  return countChars(text) > NEWS_MAX_CHARS ? MESSAGES.newsTooLong : null;
}

export function validateInformation(text: string): string | null {
  return countChars(text) > INFORMATION_MAX_CHARS
    ? MESSAGES.informationTooLong
    : null;
}
