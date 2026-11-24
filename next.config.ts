import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Inline the build's preview status because Cloudflare previews share runtime secrets with main.
  env: {
    PREVIEW_BUILD: process.env.WORKERS_CI_BRANCH && process.env.WORKERS_CI_BRANCH !== "main" ? "1" : "",
  },
  // The embedded local database and the Postgres driver must run as plain Node modules.
  serverExternalPackages: ["@electric-sql/pglite", "pg"],
};

export default nextConfig;
