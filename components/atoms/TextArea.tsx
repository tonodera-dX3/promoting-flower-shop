import type { TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean };

export default function TextArea({ invalid = false, className = "", ...props }: Props) {
  return (
    <textarea
      className={`w-full resize-none rounded-xl border-2 bg-background px-3 py-2 text-base text-foreground outline-none focus:border-primary ${invalid ? "border-red-700" : "border-secondary/40"} ${className}`}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}
