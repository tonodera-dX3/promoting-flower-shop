import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

const VARIANT_CLASSES = {
  primary: "bg-primary text-background",
  secondary: "border-2 border-secondary bg-background text-secondary",
};

// タップ領域 44px 以上（min-h-11）
export default function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl px-4 text-base font-bold transition-opacity active:opacity-80 disabled:opacity-40 ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
