// 存在しないページ・存在しない slug の公開ページ
export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-card p-6 text-center">
      <h1 className="text-xl font-bold text-primary">ページが見つかりません</h1>
      <p className="text-base">URLをご確認ください。</p>
    </div>
  );
}
