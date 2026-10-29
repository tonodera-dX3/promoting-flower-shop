import type { ReactNode } from "react";
import ErrorText from "@/components/atoms/ErrorText";
import Label from "@/components/atoms/Label";

type Props = {
  id: string;
  label: string;
  error?: string | null;
  // 入力欄の右上に出す補足（文字数など）
  aside?: ReactNode;
  children: ReactNode;
};

// ラベル・入力欄・その欄のエラーをまとめる
export default function FormField({ id, label, error, aside, children }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-end justify-between">
        <Label htmlFor={id}>{label}</Label>
        {aside}
      </div>
      {children}
      <ErrorText id={`${id}-error`} message={error} />
    </div>
  );
}
