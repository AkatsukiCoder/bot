import type { RobotSpec, RobotType } from "./types";

export const ROBOT_TYPES: Record<RobotType, RobotSpec> = {
  Bravo: { workingHoursPerDay: 3, chargingCostPerDay: 2, level: 1 },
  Charlie: { workingHoursPerDay: 5, chargingCostPerDay: 3, level: 2 },
  Delta: { workingHoursPerDay: 8, chargingCostPerDay: 4, level: 3 },
};

export const TEAM_CAPACITY = 16;

export const ROBOT_ORDER: RobotType[] = ["Bravo", "Charlie", "Delta"];
