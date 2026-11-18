import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

// Stores the Next.js incremental cache (SSG/ISR pages) in a Cloudflare R2 bucket
// (binding NEXT_INC_CACHE_R2_BUCKET in wrangler.jsonc). The deploy command creates
// the bucket if it does not exist yet; locally, wrangler makes one automatically.
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
