"use client";

import { useState, useTransition } from "react";
import Button from "@/components/atoms/Button";
import TextArea from "@/components/atoms/TextArea";
import TextInput from "@/components/atoms/TextInput";
import CharCounter from "@/components/molecules/CharCounter";
import FormField from "@/components/molecules/FormField";
import type { ActionResult } from "@/types/action-result";
import { countChars, truncateChars } from "@/utils/char-count";

type Props = {
  id: string;
  label: string;
  initialValue: string;
  maxChars: number;
  // true なら改行を入力できる textarea、false なら1行の input
  multiline: boolean;
  onSave: (value: string) => Promise<ActionResult>;
};

// ニュース・ご案内の入力欄と、タブ下部の「保存」ボタン。
// maxLength は UTF-16 単位で数えるため使わず、入力のたびに1文字単位で切り詰める
export default function TextSaveForm({
  id,
  label,
  initialValue,
  maxChars,
  multiline,
  onSave,
}: Props) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleChange(next: string) {
    const normalized = multiline ? next : next.replace(/[\r\n]/g, "");
    setValue(truncateChars(normalized, maxChars));
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await onSave(value);
      if (!result.ok) setError(result.error);
    });
  }

  const common = {
    id,
    value,
    invalid: Boolean(error),
    "aria-describedby": `${id}-error`,
  };

  return (
    <div className="flex flex-col gap-4">
      <FormField
        id={id}
        label={label}
        error={error}
        aside={<CharCounter count={countChars(value)} max={maxChars} />}
      >
        {multiline ? (
          <TextArea {...common} rows={6} onChange={(e) => handleChange(e.target.value)} />
        ) : (
          <TextInput
            {...common}
            enterKeyHint="done"
            onChange={(e) => handleChange(e.target.value)}
          />
        )}
      </FormField>
      <Button onClick={handleSave} disabled={pending} className="w-full">
        保存
      </Button>
    </div>
  );
}
