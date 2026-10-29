import type { Metadata } from "next";
import AccountForm from "@/components/organisms/AccountForm";
import AuthTemplate from "@/components/templates/AuthTemplate";

export const metadata: Metadata = {
  title: "アカウント作成 | promoting-flower-shop",
};

// アカウント作成画面（/account）。ログイン済みなら proxy が /admin へリダイレクトする
export default function AccountPage() {
  return (
    <AuthTemplate title="アカウント作成">
      <AccountForm />
    </AuthTemplate>
  );
}
