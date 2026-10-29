# Cloud Run 用。next.config.ts の output: "standalone" の出力だけを実行用イメージに入れる
# 環境変数・秘密情報はイメージに含めず、Cloud Run の環境変数と Secret Manager から渡す

FROM node:24-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

FROM base AS deps
# package.json の packageManager と同じバージョンの pnpm を使う
RUN npm install -g pnpm@12.15.0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
# Cloud Run は PORT を渡す（既定は 8080）
ENV PORT=8080
RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs
COPY --from=build --chown=nextjs:nodejs /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 8080
CMD ["node", "server.js"]
