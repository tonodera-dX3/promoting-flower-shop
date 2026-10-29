// 画面に表示するメッセージ（spec.md の文言どおり）
export const MESSAGES = {
  loginUserIdRequired: "ユーザーIDを入力してください",
  loginPasswordRequired: "パスワードを入力してください",
  authFailed: "認証に失敗しました",
  alreadyRegistered: "既に登録済みです",
  userIdTooShort: "ユーザーIDに4文字以上を指定してください",
  userIdTooLong: "ユーザーIDに10文字未満を指定してください",
  userIdInvalidChars: "ユーザーIDに半角英数字を指定してください",
  passwordTooShort: "パスワードに4文字以上を指定してください",
  passwordTooLong: "パスワードに13文字未満を指定してください",
  userNameRequired: "ユーザー名を指定してください",
  newsTooLong: "ニュースは30文字以内で入力してください",
  informationTooLong: "ご案内は80文字以内で入力してください",
  invalidImage: "jpegまたはpngの10MB以下の画像を指定してください",
  imageSaveFailed: "画像の保存に失敗しました",
  imageDeleteFailed: "画像の削除に失敗しました",
  databaseFailed: "データベースのアクセスに失敗しました",
} as const;
