import { logout } from "@/actions/auth";
import Button from "@/components/atoms/Button";

// セッションの Cookie を削除してログイン画面に戻る
export default function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" variant="secondary" className="w-full">
        ログオフ
      </Button>
    </form>
  );
}
