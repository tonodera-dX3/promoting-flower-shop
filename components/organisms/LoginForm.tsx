"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import { login } from "@/actions/auth";
import Button from "@/components/atoms/Button";
import ErrorText from "@/components/atoms/ErrorText";
import TextInput from "@/components/atoms/TextInput";
import FormField from "@/components/molecules/FormField";
import { validateLogin } from "@/utils/validation";

export default function LoginForm() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validateLogin(userId, password);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    startTransition(async () => {
      // 成功時は Server Action が /admin へ redirect する
      const result = await login(userId, password);
      setError(result.error);
      if (result.clearInputs) {
        setUserId("");
        setPassword("");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <FormField id="login-user-id" label="ユーザーID">
        <TextInput
          id="login-user-id"
          name="userId"
          autoComplete="username"
          autoCapitalize="none"
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
        />
      </FormField>
      <FormField id="login-password" label="パスワード">
        <TextInput
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </FormField>
      <ErrorText message={error} />
      <Button type="submit" disabled={pending} className="w-full">
        ログイン
      </Button>
      <Link
        href="/account"
        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border-2 border-secondary text-base font-bold text-secondary"
      >
        アカウントを作成
      </Link>
    </form>
  );
}
