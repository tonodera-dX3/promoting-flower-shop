"use client";

import { useRef, type ClipboardEvent, type ReactNode } from "react";

type Props = {
  label: string;
  // 選択・貼り付けした画像のプレビュー、または保存済みの画像
  children?: ReactNode;
  onSelect: (file: File) => void;
  disabled?: boolean;
  className?: string;
};

// タップでファイル選択（アルバム・カメラ）を開く。フォーカス中はクリップボードの画像の貼り付けも受け付ける
export default function ImageDropZone({
  label,
  children,
  onSelect,
  disabled = false,
  className = "",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    if (disabled) return;
    const file = Array.from(event.clipboardData.files).find((f) =>
      f.type.startsWith("image/"),
    );
    if (file) {
      event.preventDefault();
      onSelect(file);
    }
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`${label}を選択または貼り付け`}
      aria-disabled={disabled || undefined}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(event) => {
        if (!disabled && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      onPaste={handlePaste}
      className={`relative flex cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-secondary/50 bg-card outline-none focus:border-primary ${className}`}
    >
      {children ?? (
        <span className="px-1 text-center text-base text-secondary">{label}</span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        // input.click() のイベントが親に伝わり、もう一度 click() されるのを防ぐ
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => {
          const file = event.target.files?.[0];
          // 同じファイルを選び直しても onChange が発生するようにする
          event.target.value = "";
          if (file) onSelect(file);
        }}
      />
    </div>
  );
}
