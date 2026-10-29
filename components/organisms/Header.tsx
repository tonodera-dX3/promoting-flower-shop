// 全画面共通のヘッダー。タイトルを中央に表示する
export default function Header() {
  return (
    <header className="bg-primary pt-[env(safe-area-inset-top)] text-background">
      <div className="flex h-14 items-center justify-center px-4">
        <p className="text-lg font-bold tracking-wide">promoting-flower-shop</p>
      </div>
    </header>
  );
}
