// 全角・半角・改行をすべて1文字と数える（サロゲートペアも1文字）
export function countChars(value: string): number {
  return Array.from(value).length;
}

export function truncateChars(value: string, max: number): string {
  const chars = Array.from(value);
  return chars.length <= max ? value : chars.slice(0, max).join("");
}

// ブラウザやフォーム送信で CRLF になった改行を LF にそろえる
export function normalizeNewlines(value: string): string {
  return value.replace(/\r\n?/g, "\n");
}
