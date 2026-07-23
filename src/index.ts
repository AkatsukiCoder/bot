import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { assignRobots, formatAssignment } from "./assigner";
import { ROBOT_ORDER } from "./robots";
import type { Inventory, RobotType } from "./types";

function parseCount(line: string, type: RobotType): number {
  const count = Number.parseInt(line.trim(), 10);

  if (!Number.isInteger(count) || count < 0) {
    throw new Error(`${type} count must be a non-negative integer.`);
  }

  return count;
}

async function promptInventory(rl: readline.Interface): Promise<Inventory> {
  const inventory: Inventory = { Bravo: 0, Charlie: 0, Delta: 0 };

  console.log("Enter number of robots available:");

  for (const type of ROBOT_ORDER) {
    const line = await rl.question(`${type}: `);
    inventory[type] = parseCount(line, type);
  }

  return inventory;
}

export async function main(): Promise<void> {
  const rl = readline.createInterface({ input, output });

  try {
    const inventory = await promptInventory(rl);

    const workHoursInput = await rl.question("\nEnter client work hours:\n");
    const requestedHours = Number.parseInt(workHoursInput.trim(), 10);

    const result = assignRobots(inventory, requestedHours);
    console.log(`\n${formatAssignment(result)}`);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  main().catch((error: Error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
