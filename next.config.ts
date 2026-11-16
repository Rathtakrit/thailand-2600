import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // The embedded local database and the Postgres driver must run as plain Node modules.
  serverExternalPackages: ["@electric-sql/pglite", "pg"],
};

export default nextConfig;
