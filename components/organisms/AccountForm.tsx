"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import { createAccount } from "@/actions/account";
import Button from "@/components/atoms/Button";
import ErrorText from "@/components/atoms/ErrorText";
import TextInput from "@/components/atoms/TextInput";
import FormField from "@/components/molecules/FormField";
import type { AccountField, FieldErrors } from "@/types/action-result";
import { hasErrors, validateAccount } from "@/utils/validation";

export default function AccountForm() {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  // パスワードの初期表示は空欄
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<AccountField>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = { userId, userName, password };
    const errors = validateAccount(input);
    setFieldErrors(errors);
    setError(null);
    if (hasErrors(errors)) return;

    startTransition(async () => {
      // 成功時は Server Action が /admin へ redirect する
      const result = await createAccount(input);
      setFieldErrors(result.fieldErrors);
      setError(result.error ?? null);
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <FormField id="account-user-id" label="ユーザーID" error={fieldErrors.userId}>
        <TextInput
          id="account-user-id"
          name="userId"
          autoComplete="username"
          autoCapitalize="none"
          inputMode="email"
          invalid={Boolean(fieldErrors.userId)}
          aria-describedby="account-user-id-error"
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
        />
      </FormField>
      <FormField id="account-user-name" label="ユーザー名" error={fieldErrors.userName}>
        <TextInput
          id="account-user-name"
          name="userName"
          autoComplete="organization"
          invalid={Boolean(fieldErrors.userName)}
          aria-describedby="account-user-name-error"
          value={userName}
          onChange={(event) => setUserName(event.target.value)}
        />
      </FormField>
      <FormField id="account-password" label="パスワード" error={fieldErrors.password}>
        <TextInput
          id="account-password"
          name="password"
          type="password"
          autoComplete="new-password"
          invalid={Boolean(fieldErrors.password)}
          aria-describedby="account-password-error"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </FormField>
      <ErrorText message={error} />
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-secondary text-base font-bold text-secondary"
        >
          キャンセル
        </Link>
        <Button type="submit" disabled={pending}>
          保存
        </Button>
      </div>
    </form>
  );
}
