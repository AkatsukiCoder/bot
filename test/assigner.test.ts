import test from "node:test";
import assert from "node:assert/strict";
import { assignRobots } from "../src/assigner";
import type { Inventory } from "../src/types";

const defaultInventory: Inventory = { Bravo: 2, Charlie: 3, Delta: 2 };
const largeInventory: Inventory = { Bravo: 11, Charlie: 11, Delta: 11 };

test("uses a mixed-category assignment for 16 requested hours", () => {
  const result = assignRobots(largeInventory, 16);

  assert.deepEqual(result.counts, { Bravo: 1, Charlie: 1, Delta: 1 });
  assert.equal(result.provided, 16);
  assert.equal(result.requested, 16);
  assert.equal(result.excess, 0);
  assert.equal(result.level, 4);
});

test("uses six Bravo robots for 17 requested hours when inventory is 12/12/12", () => {
  const inventory: Inventory = { Bravo: 12, Charlie: 12, Delta: 12 };
  const result = assignRobots(inventory, 17);

  assert.deepEqual(result.counts, { Bravo: 6, Charlie: 0, Delta: 0 });
  assert.equal(result.provided, 18);
  assert.equal(result.excess, 1);
  assert.equal(result.level, 1);
});

test("uses multiple Bravo robots for 17 requested hours", () => {
  const result = assignRobots(largeInventory, 17);

  assert.deepEqual(result.counts, { Bravo: 6, Charlie: 0, Delta: 0 });
  assert.equal(result.provided, 18);
  assert.equal(result.excess, 1);
  assert.equal(result.level, 1);
});

test("uses a balanced mix for 21 requested hours", () => {
  const result = assignRobots(largeInventory, 21);

  assert.deepEqual(result.counts, { Bravo: 1, Charlie: 2, Delta: 1 });
  assert.equal(result.provided, 21);
  assert.equal(result.excess, 0);
  assert.equal(result.level, 4);
});

test("uses multiple Delta robots for 24 requested hours", () => {
  const result = assignRobots(largeInventory, 24);

  assert.deepEqual(result.counts, { Bravo: 1, Charlie: 1, Delta: 2 });
  assert.equal(result.provided, 24);
  assert.equal(result.excess, 0);
  assert.equal(result.level, 4);
});

test("prefers a mixed-category assignment when it meets the same hours", () => {
  const inventory: Inventory = { Bravo: 2, Charlie: 3, Delta: 2 };
  const result = assignRobots(inventory, 16);

  assert.deepEqual(result.counts, { Bravo: 1, Charlie: 1, Delta: 1 });
  assert.equal(result.provided, 16);
  assert.equal(result.excess, 0);
  assert.equal(result.level, 4);
});

test("minimises excess hours when an exact match is unavailable", () => {
  const result = assignRobots(largeInventory, 18);

  assert.deepEqual(result.counts, { Bravo: 6, Charlie: 0, Delta: 0 });
  assert.equal(result.provided, 18);
  assert.equal(result.excess, 0);
  assert.equal(result.level, 1);
});
