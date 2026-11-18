import test from "node:test";
import assert from "node:assert/strict";
import { getStorage, r2Storage } from "../lib/storage.ts";

const KEY = "abc123def4567890";

// A fake R2 bucket with the shape of the UPLOADS binding used by lib/storage.ts.
function fakeBucket() {
  const objects = new Map<string, Uint8Array>();
  return {
    objects,
    put: async (key: string, bytes: Uint8Array) => {
      objects.set(key, bytes);
    },
    get: async (key: string) => {
      const bytes = objects.get(key);
      return bytes ? { arrayBuffer: async () => bytes.slice().buffer } : null;
    },
    delete: async (key: string) => {
      objects.delete(key);
    },
  };
}

// getCloudflareContext() reads the context from this symbol on the global scope
// (node_modules/@opennextjs/cloudflare/dist/api/cloudflare-context.js). Setting it here
// fakes the binding without any Cloudflare call.
const CF_CONTEXT = Symbol.for("__cloudflare-context__");
const g = globalThis as { [key: symbol]: unknown };
const saved = { storage: process.env.STORAGE, context: g[CF_CONTEXT] };

test.afterEach(() => {
  if (saved.storage === undefined) delete process.env.STORAGE;
  else process.env.STORAGE = saved.storage;
  if (saved.context === undefined) delete g[CF_CONTEXT];
  else g[CF_CONTEXT] = saved.context;
});

test("getStorage picks the local folder when STORAGE is not set", () => {
  delete process.env.STORAGE;
  assert.notEqual(getStorage(), r2Storage);
});

test("getStorage picks R2 when STORAGE=r2", () => {
  process.env.STORAGE = "r2";
  assert.equal(getStorage(), r2Storage);
});

test("r2Storage rejects an unsafe key", async () => {
  const bytes = new Uint8Array([1, 2, 3]);
  await assert.rejects(() => r2Storage.put("../x", bytes), /Invalid storage key/);
  await assert.rejects(() => r2Storage.get("../x"), /Invalid storage key/);
  await assert.rejects(() => r2Storage.remove("../x"), /Invalid storage key/);
});

test("r2Storage puts, gets and removes through the UPLOADS binding", async () => {
  const bucket = fakeBucket();
  g[CF_CONTEXT] = { env: { UPLOADS: bucket }, cf: undefined, ctx: {} };
  const bytes = new Uint8Array([1, 2, 3]);

  await r2Storage.put(KEY, bytes);
  assert.deepEqual(await r2Storage.get(KEY), bytes);
  assert.equal(await r2Storage.get("notstored0000000"), null);

  await r2Storage.remove(KEY);
  assert.equal(await r2Storage.get(KEY), null);
});
