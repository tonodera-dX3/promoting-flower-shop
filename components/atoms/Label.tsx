import type { LabelHTMLAttributes } from "react";

export default function Label({
  className = "",
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={`text-base font-bold text-primary ${className}`} {...props} />;
}
