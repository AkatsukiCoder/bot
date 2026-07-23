import { assignByLevel, assignByCostEfficiency } from "./strategies";
import { ROBOT_ORDER } from "./robots";
import type { AssignmentResult, Inventory } from "./types";

export function parseInventory(lines: string[]): Inventory {
  const inventory: Inventory = { Bravo: 0, Charlie: 0, Delta: 0 };

  for (const line of lines) {
    const match = line.trim().match(/^(Bravo|Charlie|Delta):\s*(\d+)$/i);

    if (!match) {
      throw new Error(`Invalid robot inventory line: "${line}"`);
    }

    const type =
      match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase() as
        | "Bravo"
        | "Charlie"
        | "Delta";
    inventory[type] = Number.parseInt(match[2], 10);
  }

  return inventory;
}

export function assignRobots(
  inventory: Inventory,
  requestedHours: number,
): AssignmentResult {
  if (!Number.isInteger(requestedHours) || requestedHours <= 0) {
    throw new Error("Client work hours must be a positive integer.");
  }

  const totalAvailable = ROBOT_ORDER.reduce(
    (sum, type) => sum + inventory[type],
    0,
  );

  if (totalAvailable === 0) {
    throw new Error("No robots available to assign.");
  }

  const assignment = assignByLevel(inventory, requestedHours);

  if (!assignment || assignment.selectedLevel === undefined) {
    throw new Error(
      `Unable to fulfil ${requestedHours} work hours with available robots.`,
    );
  }

  return {
    counts: assignment.counts,
    provided: assignment.provided,
    requested: requestedHours,
    excess: assignment.excess,
    level: assignment.selectedLevel,
  };
}

export function assignRobotsByCostEfficiency(
  inventory: Inventory,
  requestedHours: number,
): AssignmentResult {
  if (!Number.isInteger(requestedHours) || requestedHours <= 0) {
    throw new Error("Client work hours must be a positive integer.");
  }

  const assignment = assignByCostEfficiency(inventory, requestedHours);

  if (!assignment) {
    throw new Error(
      `Unable to fulfil ${requestedHours} work hours with available robots.`,
    );
  }

  return {
    counts: assignment.counts,
    provided: assignment.provided,
    requested: requestedHours,
    excess: assignment.excess,
    level: assignment.level,
    chargingCost: assignment.chargingCost,
    strategyName: "Cost Optimized Allocation",
  };
}

export function formatAssignment(
  result: AssignmentResult,
  heading = "Robot Assignment",
): string {
  const lines = [heading];

  for (const type of ROBOT_ORDER) {
    lines.push(`${type}: ${result.counts[type]}`);
  }

  lines.push("");
  lines.push(`Total Work Hours Provided: ${result.provided}`);

  if (typeof result.chargingCost === "number") {
    lines.push(`Total Charging Cost: $${result.chargingCost}`);
  } else {
    lines.push(`Client Work Hours Requested: ${result.requested}`);
  }

  return lines.join("\n");
}
