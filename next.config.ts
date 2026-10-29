import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloud Run 用に、実行に必要なファイルだけを .next/standalone に出力する
  output: "standalone",
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
