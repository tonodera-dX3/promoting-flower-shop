import type { ReactNode } from "react";

// ログイン画面・アカウント作成画面の枠
export default function AuthTemplate({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-center text-xl font-bold text-primary">{title}</h1>
      <div className="rounded-2xl bg-card p-5">{children}</div>
    </div>
  );
}
