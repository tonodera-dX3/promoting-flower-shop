# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project state

A Next.js app for a flower shop's promotional site ("promoting-flower-shop"). It is currently the unmodified `create-next-app` scaffold (template `app-tw`, recommended defaults). The only source files are `app/layout.tsx`, `app/page.tsx`, and `app/globals.css`. `documents/` holds Japanese notes on the project's setup history. They are not code.

## Commands

Use pnpm (`packageManager: pnpm@12.15.0`). The repo has a `pnpm-lock.yaml`, so don't use npm or yarn.

- `pnpm dev`: dev server at http://localhost:3000 (Turbopack)
- `pnpm build`: production build. It also runs type checking.
- `pnpm start`: serve the production build
- `pnpm lint`: ESLint (flat config, `eslint-config-next` core-web-vitals + typescript). To lint a single file, run `pnpm lint app/page.tsx`.
- Type check without building: `pnpm exec tsc --noEmit`

No test framework is set up yet.

## Next.js 16 specifics (read the bundled docs first)

The installed versions are Next 16.4.3 and React 19.3. Their APIs differ from older Next.js. The authoritative docs ship with the package in `node_modules/next/dist/docs/` (`01-app/` covers the App Router, and `03-api-reference/05-config/01-next-config-js/` covers the config options). Check them before you write routing, data-fetching, or caching code.

Settings in `next.config.ts` that shape how code must be written:

- **`cacheComponents: true`**: data fetching is dynamic by default. Opt into caching with the `"use cache"` directive, plus `cacheLife` and `cacheTag`. Next prerenders a static shell and streams dynamic parts, so wrap dynamic or uncached data access in `<Suspense>`. Don't add a `runtime` route segment export, because Cache Components only supports the Node.js runtime. Legacy segment configs such as `dynamic` and `revalidate` are replaced: see the "Migrating to Cache Components" guide.
- **`partialPrefetching: true`**: `<Link>` prefetches only the static parts of each route by default. Use `prefetch={true}` to fetch more. This setting requires `cacheComponents`.
- **`experimental.agentFeedback: true`**: `next dev` rewrites the managed block in `AGENTS.md`. Leave that block alone.
- **Tailwind v4 through Turbopack**: `*.css` files go through the `@tailwindcss/turbopack` loader set in `turbopack.rules`. There is no `tailwind.config` or PostCSS config. Theme tokens live in `app/globals.css` under `@import "tailwindcss"` and `@theme inline` (`--color-background`, `--color-foreground`, and the Geist font variables set in `layout.tsx`). Dark mode comes from `prefers-color-scheme`.

Other conventions in use:

- Typed route helpers are global and generated at dev/build time (`next-env.d.ts`, `.next/types`). For example, `layout.tsx` uses `LayoutProps<"/">`. Use `PageProps<"/route">` and `LayoutProps<"/route">` instead of hand-written props types.
- The import alias `@/*` maps to the repo root.
- `pnpm-workspace.yaml` disables build scripts for `sharp` and `unrs-resolver` (`allowBuilds: false`).


## ディレクトリ構成

今後この構成で作る

|ディレクトリ|役割|
|----|----|
| app/ |ルーティング|
| components/ | Reactコンポーネント（Atomic Design） |
| hooks/ | カスタムフック |
| types/ | TypeScript型定義 |
| utils/ | 汎用ユーティリティ |
| api/ | データ取得・外部API呼び出し関数（Route Handler は app/api/ に置く） | 
| db/ | SQL（CREATE TABLE）文を定義したファイルの置き場所 |
| actions/ | Server Actions を置く場所 |


## 設計原則

- api/ の関数は DB や外部 API に直接アクセスする
- api/ はサーバー専用。各ファイルの先頭に `import "server-only"` を書く（Next.js が内部で処理するため、パッケージのインストールは不要）
- Client Component や hooks からのデータ取得・更新は、Server Actions か `app/api/` の Route Handler を経由する（api/ を直接 import しない）
- components/ には atoms / molecules / organisms / templates の4階層だけを置く。
- Server Component は api/ の関数を直接 await して呼ぶ。
- hooks は Client Component 専用。UI の状態や、クライアント側でのデータ取得・更新に使う。

## 言語設定
- `app/layout.tsx` の `<html lang>` は `ja` を維持する
- 応答は日本語で行う

# デザイン方針
- 本アプリはスマートフォン専用。対象幅は360〜430px、縦向きのみ
- PC・タブレット向けのレスポンシブ実装は禁止(md:/lg:/xl: は使わない)
- 外側のコンテナは max-w-[430px] mx-auto で固定
- タップ領域44px以上、本文16px以上、100dvh使用、safe-area対応
- 新しい画面やコンポーネントを作るときも、必ずこの方針に従うこと


