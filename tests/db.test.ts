import test from "node:test";
import assert from "node:assert/strict";
import { hostedUrl } from "../lib/db/index.ts";

const DATABASE_URL = "postgres://live.example.test/db";
const PREVIEW_DATABASE_URL = "postgres://preview.example.test/db";

test("preview builds prefer the preview database when both URLs are set", () => {
  assert.equal(hostedUrl({ PREVIEW_BUILD: "1", DATABASE_URL, PREVIEW_DATABASE_URL }), PREVIEW_DATABASE_URL);
});

test("preview builds fall back to the live database without a preview URL", () => {
  assert.equal(hostedUrl({ PREVIEW_BUILD: "1", DATABASE_URL }), DATABASE_URL);
});

test("non-preview builds use the live database when both URLs are set", () => {
  assert.equal(hostedUrl({ PREVIEW_BUILD: "", DATABASE_URL, PREVIEW_DATABASE_URL }), DATABASE_URL);
});

test("no database URLs selects local PGlite", () => {
  assert.equal(hostedUrl({}), undefined);
});
