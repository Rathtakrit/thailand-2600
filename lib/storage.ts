import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Where uploaded bytes live. Today: a folder on this computer (.data/uploads).
 * To move to Cloudflare R2, write a second object with these three functions and return it from getStorage().
 * Nothing else in the app touches files directly.
 */
export type Storage = {
  put(key: string, bytes: Uint8Array): Promise<void>;
  get(key: string): Promise<Uint8Array | null>;
  remove(key: string): Promise<void>;
};

// Keys are ids we generate ourselves; this guard stops any other value from reaching the file system.
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

export const getStorage = (): Storage => localStorage;
