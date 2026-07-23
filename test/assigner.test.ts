import { describe, expect, it } from "vitest";
import { assignRobots, assignRobotsByCostEfficiency } from "../src/assigner";
import type { Inventory } from "../src/types";

const largeInventory: Inventory = { Bravo: 11, Charlie: 11, Delta: 11 };

describe("assignRobots", () => {
  it("uses a mixed-category assignment for 16 requested hours", () => {
    const result = assignRobots(largeInventory, 16);

    expect(result.counts).toEqual({ Bravo: 1, Charlie: 1, Delta: 1 });
    expect(result.provided).toBe(16);
    expect(result.requested).toBe(16);
    expect(result.excess).toBe(0);
    expect(result.level).toBe(4);
  });

  it("uses six Bravo robots for 17 requested hours when inventory is 12/12/12", () => {
    const inventory: Inventory = { Bravo: 12, Charlie: 12, Delta: 12 };
    const result = assignRobots(inventory, 17);

    expect(result.counts).toEqual({ Bravo: 6, Charlie: 0, Delta: 0 });
    expect(result.provided).toBe(18);
    expect(result.excess).toBe(1);
    expect(result.level).toBe(1);
  });

  it("uses multiple Bravo robots for 17 requested hours", () => {
    const result = assignRobots(largeInventory, 17);

    expect(result.counts).toEqual({ Bravo: 6, Charlie: 0, Delta: 0 });
    expect(result.provided).toBe(18);
    expect(result.excess).toBe(1);
    expect(result.level).toBe(1);
  });

  it("uses a balanced mix for 21 requested hours", () => {
    const result = assignRobots(largeInventory, 21);

    expect(result.counts).toEqual({ Bravo: 1, Charlie: 2, Delta: 1 });
    expect(result.provided).toBe(21);
    expect(result.excess).toBe(0);
    expect(result.level).toBe(4);
  });

  it("uses multiple Delta robots for 24 requested hours", () => {
    const result = assignRobots(largeInventory, 24);

    expect(result.counts).toEqual({ Bravo: 1, Charlie: 1, Delta: 2 });
    expect(result.provided).toBe(24);
    expect(result.excess).toBe(0);
    expect(result.level).toBe(4);
  });

  it("prefers a mixed-category assignment when it meets the same hours", () => {
    const inventory: Inventory = { Bravo: 2, Charlie: 3, Delta: 2 };
    const result = assignRobots(inventory, 16);

    expect(result.counts).toEqual({ Bravo: 1, Charlie: 1, Delta: 1 });
    expect(result.provided).toBe(16);
    expect(result.excess).toBe(0);
    expect(result.level).toBe(4);
  });

  it("minimises excess hours when an exact match is unavailable", () => {
    const result = assignRobots(largeInventory, 18);

    expect(result.counts).toEqual({ Bravo: 6, Charlie: 0, Delta: 0 });
    expect(result.provided).toBe(18);
    expect(result.excess).toBe(0);
    expect(result.level).toBe(1);
  });
});

describe("assignRobotsByCostEfficiency", () => {
  it("minimises charging cost for the cost-efficiency strategy", () => {
    const inventory: Inventory = { Bravo: 2, Charlie: 3, Delta: 2 };
    const result = assignRobotsByCostEfficiency(inventory, 20);

    expect(result.counts).toEqual({ Bravo: 0, Charlie: 1, Delta: 2 });
    expect(result.provided).toBe(21);
    expect(result.excess).toBe(1);
    expect(result.chargingCost).toBe(11);
  });

  it("prefers the cheapest exact-fit combination for the cost-efficiency strategy", () => {
    const inventory: Inventory = { Bravo: 2, Charlie: 2, Delta: 3 };
    const result = assignRobotsByCostEfficiency(inventory, 6);

    expect(result.counts).toEqual({ Bravo: 2, Charlie: 0, Delta: 0 });
    expect(result.provided).toBe(6);
    expect(result.excess).toBe(0);
    expect(result.chargingCost).toBe(4);
  });
});
