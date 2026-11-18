import test from "node:test";
import assert from "node:assert/strict";
import { PROVINCES, GRID } from "../lib/provinces.ts";
import { REGIONS } from "../lib/content.ts";

test("there are exactly 77 provinces", () => {
  assert.equal(PROVINCES.length, 77);
});

test("no English name and no Thai name appears twice", () => {
  assert.equal(new Set(PROVINCES.map((p) => p.en)).size, PROVINCES.length);
  assert.equal(new Set(PROVINCES.map((p) => p.th)).size, PROVINCES.length);
});

test("no two provinces share the same col and row", () => {
  const cells = new Set(PROVINCES.map((p) => `${p.col},${p.row}`));
  assert.equal(cells.size, PROVINCES.length);
});

test("every col and row is inside the grid", () => {
  for (const p of PROVINCES) {
    assert.ok(p.col >= 0 && p.col <= GRID.cols - 1, `${p.en} col ${p.col}`);
    assert.ok(p.row >= 0 && p.row <= GRID.rows - 1, `${p.en} row ${p.row}`);
  }
});

test("every region is a real region and not 'all'", () => {
  const keys = REGIONS.map(([key]) => key);
  for (const p of PROVINCES) {
    assert.ok(keys.includes(p.region), `${p.en} region ${p.region}`);
    assert.notEqual(p.region, "all", p.en);
  }
});
