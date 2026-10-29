import type { Metadata } from "next";
import LoginForm from "@/components/organisms/LoginForm";
import AuthTemplate from "@/components/templates/AuthTemplate";

export const metadata: Metadata = {
  title: "ログイン | promoting-flower-shop",
};

// ログイン画面（/）。ログイン済みなら proxy が /admin へリダイレクトする
export default function LoginPage() {
  return (
    <AuthTemplate title="ログイン">
      <LoginForm />
    </AuthTemplate>
  );
}
