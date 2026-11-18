import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Where uploaded bytes live. Locally: a folder on this computer (.data/uploads).
 * On Cloudflare: the R2 bucket behind the UPLOADS binding (wrangler.jsonc), picked when
 * STORAGE=r2. Nothing else in the app touches files directly.
 */
export type Storage = {
  put(key: string, bytes: Uint8Array): Promise<void>;
  get(key: string): Promise<Uint8Array | null>;
  remove(key: string): Promise<void>;
};

// Keys are ids we generate ourselves; this guard stops any other value from reaching the file
// system or the R2 bucket.
const SAFE_KEY = /^[a-z0-9]{8,40}$/;
const dir = () => path.join(process.cwd(), ".data", "uploads");
const fileFor = (key: string) => {
  if (!SAFE_KEY.test(key)) throw new Error("Invalid storage key");
  return path.join(dir(), key);
};

const localStorage: Storage = {
  async put(key, bytes) {
    await mkdir(dir(), { recursive: true });
    await writeFile(fileFor(key), bytes);
  },
  async get(key) {
    try {
      return await readFile(fileFor(key));
    } catch {
      return null;
    }
  },
  async remove(key) {
    await rm(fileFor(key), { force: true });
  },
};

// The R2 bucket behind the UPLOADS binding. The full R2Bucket type comes from
// @cloudflare/workers-types, which is not installed, so this is the shape of the API we use.
type R2Bucket = {
  put(key: string, bytes: Uint8Array): Promise<unknown>;
  get(key: string): Promise<{ arrayBuffer(): Promise<ArrayBuffer> } | null>;
  delete(key: string): Promise<void>;
};

// The same key guard as the file system: nothing reaches the bucket unless it is a safe id.
const bucketFor = (key: string): R2Bucket => {
  if (!SAFE_KEY.test(key)) throw new Error("Invalid storage key");
  // UPLOADS is our own binding, not one of the bindings OpenNext puts in the env type.
  const bucket = (getCloudflareContext().env as { UPLOADS: R2Bucket }).UPLOADS;
  if (!bucket) throw new Error("R2 bucket UPLOADS is not available");
  return bucket;
};

export const r2Storage: Storage = {
  async put(key, bytes) {
    await bucketFor(key).put(key, bytes);
  },
  async get(key) {
    const object = await bucketFor(key).get(key);
    if (!object) return null;
    return new Uint8Array(await object.arrayBuffer());
  },
  async remove(key) {
    await bucketFor(key).delete(key);
  },
};

export const getStorage = (): Storage =>
  process.env.STORAGE === "r2" ? r2Storage : localStorage;
