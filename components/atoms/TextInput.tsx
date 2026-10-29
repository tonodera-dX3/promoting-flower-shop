import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean };

// 本文 16px（text-base）。iOS で入力時に拡大されないようにする
export default function TextInput({ invalid = false, className = "", ...props }: Props) {
  return (
    <input
      className={`min-h-11 w-full rounded-xl border-2 bg-background px-3 text-base text-foreground outline-none focus:border-primary ${invalid ? "border-red-700" : "border-secondary/40"} ${className}`}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}
